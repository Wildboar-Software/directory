package x500_go

import (
	"context"
	"crypto"
	"crypto/ecdsa"
	"crypto/ed25519"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/tls"
	"crypto/x509/pkix"
	"encoding/asn1"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"math"
	"net"
	"os"
	"runtime"
	"sync"
	"time"
)

const BIND_RESPONSE_RECEIVE_BUFFER_SIZE = 4096
const SIZE_OF_IDMV1_FRAME = uint32(6)
const SIZE_OF_IDMV2_FRAME = uint32(8)

func GetIdmFrame(payload []byte, version int) []byte {
	var idm_prefix []byte
	if version <= 1 {
		idm_prefix = []byte{0x01, 0x01}
	} else {
		idm_prefix = []byte{0x02, 0x01, 0, 0} // v=2, DER encoding
	}
	payload_length := make([]byte, 4)
	binary.BigEndian.PutUint32(payload_length, uint32(len(payload)))
	frame := idm_prefix
	frame = append(frame, payload_length...)
	return frame
}

type IDMFrame struct {
	Version  uint8
	Final    uint8
	Encoding uint16
	Data     []byte
}

// Socket defines a type that works with both TCP and TLS connections
type Socket interface {
	io.Reader
	io.Writer
	Close() error
}

type StartTLSChoice int

const (
	// Demand StartTLS: if TLS cannot be started, return an error.
	StartTLSDemand StartTLSChoice = iota
	// Try to start TLS. If it cannot be started, just continue without it.
	StartTLSPrefer StartTLSChoice = iota
	// Never attempt to start TLS.
	StartTLSNever StartTLSChoice = iota
)

type IDMProtocolStack struct {
	socket            Socket
	idmVersion        int
	startTLSResponse  chan StartTLSOutcome
	pendingOperations map[int]chan X500OpOutcome
	mutex             sync.Mutex
	nextInvokeId      int
	receivedData      []byte
	bound             bool
	bindOutcome       chan X500AssociateOutcome
	SigningKey        *crypto.Signer
	SigningCert       *CertificationPath
	ResultsSigning    ProtectionRequest
	ErrorSigning      ErrorProtectionRequest
	TlsConfig         *tls.Config
	StartTLSPolicy    StartTLSChoice
	derAccepted       bool // TODO: Remove?
	readerSpawned     bool

	// Channel where errors can be returned to the main thread.
	ErrorChannel chan error
}

type IDMClientConfig struct {
	ResultSigning  ProtectionRequest
	ErrorSigning   ErrorProtectionRequest
	TlsConfig      *tls.Config
	SigningKey     *crypto.Signer
	SigningCert    *CertificationPath
	StartTLSPolicy StartTLSChoice
	UseIDMv1       bool
	Errchan        chan error
}

func IDMClient(socket Socket, options *IDMClientConfig) *IDMProtocolStack {
	if options == nil {
		errchan := make(chan error)
		options = &IDMClientConfig{
			ResultSigning:  ProtectionRequest_None,
			ErrorSigning:   ProtectionRequest_None,
			TlsConfig:      nil,
			SigningKey:     nil,
			SigningCert:    nil,
			StartTLSPolicy: StartTLSDemand,
			UseIDMv1:       false, // Prefer IDMv2: we can request DER encoding.
			Errchan:        errchan,
		}
	}
	return &IDMProtocolStack{
		socket:            socket,
		receivedData:      make([]byte, 0),
		nextInvokeId:      1,
		startTLSResponse:  make(chan StartTLSOutcome),
		pendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		ResultsSigning:    options.ResultSigning,
		ErrorSigning:      options.ErrorSigning,
		SigningKey:        options.SigningKey,
		SigningCert:       options.SigningCert,
		ErrorChannel:      options.Errchan,
		StartTLSPolicy:    options.StartTLSPolicy,
		TlsConfig:         options.TlsConfig,
	}
}

func (stack *IDMProtocolStack) dispatchError(err error) {
	// Write to the error channel if the user is listening, otherwise, just
	// print the error to stderr.
	select {
	case stack.ErrorChannel <- err:
		break
	default:
		// We intentionally ignore errors from this Fprintf() call.
		fmt.Fprintf(os.Stderr, "x.500/idm client error: %v\n", err)
	}
}

func (stack *IDMProtocolStack) GetNextInvokeId() int {
	stack.mutex.Lock()
	ret := stack.nextInvokeId
	stack.nextInvokeId++
	stack.mutex.Unlock()
	return ret
}

func ConvertX500AssociateToIdmBind(arg X500AssociateArgument) (req IdmBind, err error) {
	bitLength := 0
	var versions_byte byte = 0
	if arg.V2 {
		bitLength = 2
		versions_byte = 0b1100_0000
	} else {
		bitLength = 1
		versions_byte = 0b1000_0000
	}
	var creds asn1.RawValue = asn1.RawValue{}
	if arg.Credentials != nil {
		credbytes, err := asn1.Marshal(*arg.Credentials)
		if err != nil {
			return IdmBind{}, err
		}
		creds = asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      credbytes,
		}
	}

	bind_req := DirectoryBindArgument{
		Versions: asn1.BitString{
			BitLength: bitLength,
			Bytes:     []byte{versions_byte},
		},
		Credentials: creds,
	}
	bind_req_bytes, err := asn1.MarshalWithParams(bind_req, "set")
	if err != nil {
		return IdmBind{}, err
	}
	req = IdmBind{
		ProtocolID:     Id_idm_dap,
		CallingAETitle: arg.CallingAETitle,
		CalledAETitle:  arg.CalledAETitle,
		Argument: asn1.RawValue{
			Tag:        2,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      bind_req_bytes,
		},
	}
	return req, nil
}

func (stack *IDMProtocolStack) readIDMv1Frame(startIndex uint32, frame *IDMFrame) (bytesRead uint32, err error) {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()
	if uint32(len(stack.receivedData)) < SIZE_OF_IDMV1_FRAME {
		bytesRead = 0
		return
	}
	if stack.receivedData[startIndex] != 1 {
		err = fmt.Errorf("non idm v1 response; first byte=0x%02x", stack.receivedData[0])
		return
	}
	lengthOfDataField := binary.BigEndian.Uint32(stack.receivedData[startIndex+2 : startIndex+SIZE_OF_IDMV1_FRAME])
	lengthNeeded := (startIndex + SIZE_OF_IDMV1_FRAME + lengthOfDataField)
	// TODO: Check if it's too large.
	if lengthNeeded > uint32(len(stack.receivedData)) {
		bytesRead = 0
	} else {
		bytesRead = SIZE_OF_IDMV1_FRAME + lengthOfDataField
		frame.Version = 1
		frame.Final = stack.receivedData[startIndex+1]
		frame.Data = stack.receivedData[startIndex+SIZE_OF_IDMV1_FRAME : lengthNeeded]
	}
	return
}

func (stack *IDMProtocolStack) readIDMv2Frame(startIndex uint32, frame *IDMFrame) (bytesRead uint32, err error) {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()
	if uint32(len(stack.receivedData)) < SIZE_OF_IDMV2_FRAME {
		bytesRead = 0
		return
	}
	if stack.receivedData[startIndex] != 2 {
		err = fmt.Errorf("non idm v2 response; first byte=0x%02x", stack.receivedData[0])
		return
	}
	lengthOfDataField := binary.BigEndian.Uint32(stack.receivedData[startIndex+4 : startIndex+SIZE_OF_IDMV2_FRAME])
	lengthNeeded := (startIndex + SIZE_OF_IDMV2_FRAME + lengthOfDataField)
	// TODO: Check if it's too large.
	if lengthNeeded > uint32(len(stack.receivedData)) {
		bytesRead = 0
	} else {
		bytesRead = SIZE_OF_IDMV2_FRAME + lengthOfDataField
		frame.Version = 2
		frame.Final = stack.receivedData[startIndex+1]
		frame.Data = stack.receivedData[startIndex+SIZE_OF_IDMV2_FRAME : lengthNeeded]
	}
	return
}

func (stack *IDMProtocolStack) readPDU(pdu *IDM_PDU) (bytesRead uint32, err error) {
	var frames = make([]IDMFrame, 0)
	var startIndex uint32 = 0
	index := startIndex
	for err == nil {
		frame := IDMFrame{}
		var frameBytesRead uint32
		if stack.idmVersion <= 1 {
			frameBytesRead, err = stack.readIDMv1Frame(index, &frame)
		} else if stack.idmVersion == 2 {
			frameBytesRead, err = stack.readIDMv2Frame(index, &frame)
		} else {
			return 0, errors.New("unsupported idm version")
		}
		if err != nil {
			return 0, err
		}
		/* If there was no error, but no bytes were read, it means that there
		   wasn't enough data in the buffer to read a full IDM PDU yet. So now we
		   call the read() system call to fetch more data, if its available. In
		   any similar implementation, it is important that this gets called
		   AFTER attempting to read a frame from the buffer so that we do not
		   block on a read() call when there is already data in the buffer that
		   would give us the next IDM PDU. */
		if frameBytesRead == 0 {
			// FIXME: Don't allocate a new buffer each time.
			receiveBuffer := make([]byte, BIND_RESPONSE_RECEIVE_BUFFER_SIZE)
			bytesReceived, err := stack.socket.Read(receiveBuffer)
			if err != nil {
				return 0, err
			}
			stack.mutex.Lock()
			stack.receivedData = append(stack.receivedData, receiveBuffer[0:bytesReceived]...)
			stack.mutex.Unlock()
		}
		index += frameBytesRead
		if frame.Final > 0 {
			var completeSegment []byte = make([]byte, 0)
			for _, frame := range frames {
				completeSegment = append(completeSegment, frame.Data...)
			}
			completeSegment = append(completeSegment, frame.Data...)
			rest, err := asn1.Unmarshal(completeSegment, pdu)
			if err != nil {
				return bytesRead, err
			}
			if len(rest) > 0 {
				err = errors.New("trailing data in idm frame")
				return 0, err
			}
			bytesRead = index - startIndex
			// We purge the buffer of unneeded data once we parse a full IDM PDU
			stack.mutex.Lock()
			stack.receivedData = stack.receivedData[startIndex+bytesRead:]
			stack.mutex.Unlock()
			return bytesRead, nil
		} else {
			// TODO: Check maximum frames
			frames = append(frames, frame)
		}
	}
	return bytesRead, nil
}

func (stack *IDMProtocolStack) handleBindPDU(pdu IdmBind) {
	stack.dispatchError(errors.New("server sent bind"))
}

func (stack *IDMProtocolStack) handleBindResultPDU(pdu IdmBindResult) {
	var dirBindResult DirectoryBindResult
	rest, err := asn1.UnmarshalWithParams(pdu.Result.Bytes, &dirBindResult, "set")
	if err != nil {
		stack.dispatchError(err)
		return
	}
	if len(rest) > 0 {
		stack.dispatchError(errors.New("trailing bytes in bind result parameter"))
		return
	}
	v1 := true
	v2 := false
	if len(dirBindResult.Versions.Bytes) > 0 {
		if dirBindResult.Versions.BitLength >= 2 {
			v1 = dirBindResult.Versions.Bytes[0]&0b1000_0000 > 0
			v2 = dirBindResult.Versions.Bytes[0]&0b0100_0000 > 0
		} else if dirBindResult.Versions.BitLength == 1 {
			v1 = dirBindResult.Versions.Bytes[0]&0b1000_0000 > 0
		}
	}

	timeLeft := -1
	gracesRemaining := -1
	pwdError := -1
	if dirBindResult.PwdResponseValue != nil {
		pwd := dirBindResult.PwdResponseValue
		if pwd.Warning.Class == asn1.ClassContextSpecific {
			// Just ignore the errors from these. It's only informative.
			switch pwd.Warning.Tag {
			case 0:
				asn1.Unmarshal(pwd.Warning.Bytes, &timeLeft)
			case 1:
				asn1.Unmarshal(pwd.Warning.Bytes, &gracesRemaining)
			}
		}
		if pwd.Error != nil {
			pwdError = int(*pwd.Error)
		}
	}

	// TODO: Is there a better way?
	// We return this value regardless of what the server responded, since we
	// still send DER exclusively.
	transferSyntax := asn1.ObjectIdentifier{2, 1, 2, 1} // Distinguished Encoding Rules
	outcome := X500AssociateOutcome{
		OutcomeType:                OPERATION_OUTCOME_TYPE_RESULT,
		ACSEResult:                 Associate_result_Accepted,
		ApplicationContext:         pdu.ProtocolID, // Technically not an application context
		TransferSyntaxName:         transferSyntax,
		RespondingAETitle:          pdu.RespondingAETitle,
		Parameter:                  pdu.Result,
		V1:                         v1,
		V2:                         v2,
		Credentials:                dirBindResult.Credentials,
		PwdResponseTimeLeft:        timeLeft,
		PwdResponseGracesRemaining: gracesRemaining,
		PwdResponseError:           pwdError,
	}
	select {
	case stack.bindOutcome <- outcome:
	default:
		stack.dispatchError(errors.New("bind outcome channel closed prematurely (bind result)"))
	}
}

func (stack *IDMProtocolStack) handleBindErrorPDU(pdu IdmBindError) {
	var dirBindErr DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1
	optProtDirBindErr := asn1.RawValue{}
	var rest []byte
	var err error
	rest, err = asn1.Unmarshal(pdu.Error.Bytes, &optProtDirBindErr)
	if err != nil {
		stack.dispatchError(err)
		return
	}
	if len(rest) > 0 {
		stack.dispatchError(errors.New("trailing bytes in bind error"))
		return
	}
	if optProtDirBindErr.Class != asn1.ClassUniversal {
		stack.dispatchError(errors.New("unrecognized bind error syntax (1)"))
		return
	}
	var unsignedBindErr asn1.RawValue
	if optProtDirBindErr.Tag == asn1.TagSequence {
		// This is the signed variant.
		signed := SIGNED{}
		rest, err = asn1.Unmarshal(optProtDirBindErr.FullBytes, &signed)
		if err != nil {
			stack.dispatchError(err)
			return
		}
		if len(rest) > 0 {
			stack.dispatchError(errors.New("trailing bytes in bind error signature"))
			return
		}
		unsignedBindErr = signed.ToBeSigned
	} else if optProtDirBindErr.Tag == asn1.TagSet {
		unsignedBindErr = optProtDirBindErr
	} else {
		stack.dispatchError(errors.New("unrecognized bind error syntax (2)"))
		return
	}
	rest, err = asn1.UnmarshalWithParams(unsignedBindErr.FullBytes, &dirBindErr, "set")
	if err != nil {
		stack.dispatchError(err)
		return
	}
	if len(rest) > 0 {
		stack.dispatchError(errors.New("trailing bytes in bind result parameter"))
		return
	}
	v1 := true
	v2 := false
	if len(dirBindErr.Versions.Bytes) > 0 {
		if dirBindErr.Versions.BitLength >= 2 {
			v1 = dirBindErr.Versions.Bytes[0]&0b1000_0000 > 0
			v2 = dirBindErr.Versions.Bytes[0]&0b0100_0000 > 0
		} else if dirBindErr.Versions.BitLength == 1 {
			v1 = dirBindErr.Versions.Bytes[0]&0b1000_0000 > 0
		}
	}

	var serviceError int64 = 0
	var securityError int64 = 0
	acseResult := Associate_result_Rejected_permanent
	if dirBindErr.Error.Class == asn1.ClassContextSpecific {
		switch dirBindErr.Error.Tag {
		case 1:
			rest, err = asn1.Unmarshal(dirBindErr.Error.Bytes, &serviceError)
		case 2:
			rest, err = asn1.Unmarshal(dirBindErr.Error.Bytes, &securityError)
		}
		if err != nil {
			stack.dispatchError(err)
			return
		}
		if len(rest) > 0 {
			stack.dispatchError(errors.New("trailing bytes in bind error code"))
			return
		}
		// We treat busy, unavailable, ditError, saslBindInProgress as "transient"
		switch serviceError {
		case ServiceProblem_Busy:
			fallthrough
		case ServiceProblem_Unavailable:
			fallthrough
		case ServiceProblem_DitError:
			fallthrough
		case ServiceProblem_SaslBindInProgress:
			acseResult = Associate_result_Rejected_transient
		}
	}

	// TODO: Is there a better way?
	// We return this value regardless of what the server responded, since we
	// still send DER exclusively.
	transferSyntax := asn1.ObjectIdentifier{2, 1, 2, 1} // Distinguished Encoding Rules
	outcome := X500AssociateOutcome{
		OutcomeType:        OPERATION_OUTCOME_TYPE_ERROR,
		ACSEResult:         acseResult,
		ApplicationContext: pdu.ProtocolID, // Technically not an application context
		TransferSyntaxName: transferSyntax,
		RespondingAETitle:  pdu.RespondingAETitle,
		Parameter:          pdu.Error,
		V1:                 v1,
		V2:                 v2,
		SecurityParameters: dirBindErr.SecurityParameters,
		ServiceError:       serviceError,
		SecurityError:      securityError,
	}
	select {
	case stack.bindOutcome <- outcome:
	default:
		stack.dispatchError(errors.New("bind outcome channel closed prematurely (bind error)"))
	}
}

func (stack *IDMProtocolStack) handleRequestPDU(pdu Request) {
	stack.dispatchError(errors.New("server sent request"))
}

func (stack *IDMProtocolStack) handleResultPDU(pdu IdmResult) {
	stack.mutex.Lock()
	op, op_known := stack.pendingOperations[pdu.InvokeID]
	stack.mutex.Unlock()
	if !op_known {
		stack.dispatchError(errors.New("unrecognized result invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.dispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_RESULT,
		InvokeId:    asn1.RawValue{FullBytes: iidBytes},
		OpCode:      pdu.Opcode,
		Parameter:   pdu.Result,
	}
	// If the channel was closed (which shouldn't happen until the operation is
	// done), we don't want this goroutine hanging indefinitely.
	select {
	case op <- res:
	default:
		stack.dispatchError(errors.New("operation outcome channel closed prematurely"))
	}
}

func (stack *IDMProtocolStack) handleErrorPDU(pdu IdmError) {
	op, op_known := stack.pendingOperations[pdu.InvokeID]
	if !op_known {
		stack.dispatchError(errors.New("unrecognized error invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.dispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_ERROR,
		InvokeId:    asn1.RawValue{FullBytes: iidBytes},
		ErrCode:     pdu.Errcode,
		Parameter:   pdu.Error,
	}
	// If the channel was closed (which shouldn't happen until the operation is
	// done), we don't want this goroutine hanging indefinitely.
	select {
	case op <- res:
	default:
		stack.dispatchError(errors.New("operation outcome channel closed prematurely"))
	}
}

func (stack *IDMProtocolStack) handleRejectPDU(pdu IdmReject) {
	op, op_known := stack.pendingOperations[pdu.InvokeID]
	if !op_known {
		stack.dispatchError(errors.New("unrecognized error invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.dispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType:   OPERATION_OUTCOME_TYPE_REJECT,
		InvokeId:      asn1.RawValue{FullBytes: iidBytes},
		RejectProblem: pdu.Reason,
	}
	// If the channel was closed (which shouldn't happen until the operation is
	// done), we don't want this goroutine hanging indefinitely.
	select {
	case op <- res:
	default:
		stack.dispatchError(errors.New("operation outcome channel closed prematurely"))
	}
}

func (stack *IDMProtocolStack) handleUnbindPDU(pdu Unbind) {
	stack.dispatchError(errors.New("server sent unbind message, which is not allowed"))
}

func (stack *IDMProtocolStack) handleAbortPDU(pdu Abort) {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()
	stack.bound = false

	bindOutcome := X500AssociateOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_ABORT,
		ACSEResult:  Associate_result_Rejected_permanent,
		Abort: X500Abort{
			UserReason: pdu,
		},
	}
	select {
	case stack.bindOutcome <- bindOutcome:
	default: // Just ignore it: we might not be waiting on a bind result.
	}

	for iid, op := range stack.pendingOperations {
		iidBytes, err := asn1.Marshal(iid)
		if err != nil {
			stack.dispatchError(err)
			return
		}
		outcome := X500OpOutcome{
			OutcomeType: OPERATION_OUTCOME_TYPE_ABORT,
			InvokeId:    asn1.RawValue{FullBytes: iidBytes},
			Abort: X500Abort{
				UserReason: pdu,
			},
		}
		// If the channel was closed (which shouldn't happen until the operation is
		// done), we don't want this goroutine hanging indefinitely.
		select {
		case op <- outcome:
		default:
			stack.dispatchError(errors.New("operation outcome channel closed prematurely"))
		}
	}
	stack.nextInvokeId = 1
	stack.receivedData = make([]byte, 0)
}

func (stack *IDMProtocolStack) handleStartTLSPDU(pdu StartTLS) {
	stack.dispatchError(errors.New("server sent starttls message, which is not allowed"))
}

func (stack *IDMProtocolStack) handleTLSResponsePDU(pdu TLSResponse) {
	select {
	case stack.startTLSResponse <- StartTLSOutcome{response: pdu}:
	default:
		stack.dispatchError(errors.New("tls response channel closed prematurely"))
	}
}

//	IDM-PDU{IDM-PROTOCOL:protocol} ::= CHOICE {
//		bind         [0]  IdmBind{{protocol}},
//		bindResult   [1]  IdmBindResult{{protocol}},
//		bindError    [2]  IdmBindError{{protocol}},
//		request      [3]  Request{{protocol.&Operations}},
//		result       [4]  IdmResult{{protocol.&Operations}},
//		error        [5]  Error{{protocol.&Operations}},
//		reject       [6]  IdmReject,
//		unbind       [7]  Unbind,
//		abort        [8]  Abort,
//		startTLS     [9]  StartTLS,
//		tLSResponse  [10] TLSResponse,
//		... }
func (stack *IDMProtocolStack) handlePDU(pdu IDM_PDU) {
	if pdu.Class != asn1.ClassContextSpecific {
		return
	}
	switch pdu.Tag {
	case 0:
		{
			payload := IdmBind{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleBindPDU(payload)
		}
	case 1:
		{
			payload := IdmBindResult{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleBindResultPDU(payload)
		}
	case 2:
		{
			payload := IdmBindError{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleBindErrorPDU(payload)
		}
	case 3:
		{
			payload := Request{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleRequestPDU(payload)
		}
	case 4:
		{
			payload := IdmResult{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleResultPDU(payload)
		}
	case 5:
		{
			payload := IdmError{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleErrorPDU(payload)
		}
	case 6:
		{
			payload := IdmReject{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleRejectPDU(payload)
		}
	case 7:
		{
			payload := Unbind{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleUnbindPDU(payload)
		}
	case 8:
		{
			var abortReason asn1.Enumerated = 0
			rest, err := asn1.Unmarshal(pdu.Bytes, &abortReason)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleAbortPDU(abortReason)
		}
	case 9:
		{
			payload := StartTLS{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleStartTLSPDU(payload)
		}
	case 10:
		{
			var tlsResponse asn1.Enumerated = 0
			rest, err := asn1.Unmarshal(pdu.Bytes, &tlsResponse)
			if err != nil {
				stack.dispatchError(err)
				return
			}
			if len(rest) > 0 {
				stack.dispatchError(errors.New("trailing bytes after idm pdu"))
				return
			}
			stack.handleTLSResponsePDU(tlsResponse)
		}
	default:
		{
			stack.dispatchError(errors.New("unrecognized idm pdu"))
			return
		}
	}
}

func (stack *IDMProtocolStack) processNextPDU() (bytesRead uint32, err error) {
	pdu := IDM_PDU{}
	bytesRead, err = stack.readPDU(&pdu)
	if err != nil {
		if errors.Is(err, net.ErrClosed) {
			// If the socket is closed, we have to cancel all outstanding
			// operations.
			stack.mutex.Lock()
			bindOutcome := X500AssociateOutcome{
				OutcomeType: OPERATION_OUTCOME_TYPE_FAILURE,
				ACSEResult:  Associate_result_Rejected_transient,
				err:         err,
			}
			select {
			case stack.bindOutcome <- bindOutcome:
			default: // We might not be listening for a bind.
			}
			starttlsOutcome := StartTLSOutcome{err: err}
			select {
			case stack.startTLSResponse <- starttlsOutcome:
			default: // We might not be listening for a StartTLS response.
			}
			for _, op := range stack.pendingOperations {
				outcome := X500OpOutcome{
					OutcomeType: OPERATION_OUTCOME_TYPE_FAILURE,
					err:         err,
				}
				select {
				case op <- outcome:
				default:
					stack.dispatchError(errors.New("operation outcome channel closed prematurely"))
				}
			}
			stack.mutex.Unlock()
		} else {
			// For all errors other than socket closure, we dispatch the
			// error to the error channel as usual.
			stack.dispatchError(err)
		}
		return bytesRead, err
	}
	// TODO: Under what circumstances will this happen?
	if bytesRead == 0 {
		return bytesRead, err
	}
	// This will get freed once the socket is closed.
	go stack.handlePDU(pdu)
	return
}

func (stack *IDMProtocolStack) processReceivedPDUs() (err error) {
	for err == nil {
		_, err := stack.processNextPDU()
		if err != nil {
			break
		}
	}
	return err
}

func (stack *IDMProtocolStack) BindAnonymously(ctx context.Context) (response X500AssociateOutcome, err error) {
	arg := X500AssociateArgument{
		V1: true,
		V2: true,
	}
	return stack.Bind(ctx, arg)
}

func (stack *IDMProtocolStack) startTLS(ctx context.Context) (response StartTLSOutcome, err error) {
	go stack.processNextPDU() // Listen for a single StartTLS response PDU.
	// TODO: This entire PDU has predictable form. Just use one write.
	idm_payload := []byte{0xA9, 2, 5, 0} // This is the entire startTLS [9] EXPLICIT NULL
	frame := GetIdmFrame(idm_payload, stack.idmVersion)
	stack.mutex.Lock()
	_, err = stack.socket.Write(frame)
	if err != nil {
		return StartTLSOutcome{}, err
	}
	_, err = stack.socket.Write(idm_payload)
	if err != nil {
		return StartTLSOutcome{}, err
	}
	stack.mutex.Unlock()

	select {
	case response = <-stack.startTLSResponse:
		break
	case <-ctx.Done():
		return StartTLSOutcome{}, ctx.Err()
	}
	if response.err != nil {
		return StartTLSOutcome{}, response.err
	}
	switch response.response {
	case TLSResponse_Success:
		netconn, is_tcp := stack.socket.(net.Conn)
		if !is_tcp {
			return response, errors.New("tls already in use")
		}
		if stack.TlsConfig == nil {
			return response, errors.New("no tlsconfig defined: not performing x509 authentication of peer")
		}
		tlsConn := tls.Client(netconn, stack.TlsConfig)
		err = tlsConn.HandshakeContext(ctx)
		if err != nil {
			return response, err
		}
		stack.socket = tlsConn
	case TLSResponse_Unavailable:
		return response, errors.New("tls unavailable")
	case TLSResponse_OperationsError:
		return response, errors.New("starttls operations error")
	case TLSResponse_ProtocolError:
		return response, errors.New("starttls protocol error")
	default:
		return response, errors.New("unrecognized starttls error")
	}
	return response, nil
}

func (stack *IDMProtocolStack) Bind(ctx context.Context, arg X500AssociateArgument) (response X500AssociateOutcome, err error) {
	_, tls_not_in_use := stack.socket.(net.Conn)
	if tls_not_in_use && stack.StartTLSPolicy != StartTLSNever {
		_, err = stack.startTLS(ctx)
		if err != nil && stack.StartTLSPolicy == StartTLSDemand {
			return X500AssociateOutcome{}, err
		}
	}
	// There should only ever be one of these goroutines spawned per client.
	// These are terminated when the socket is closed.
	if stack.readerSpawned == false {
		stack.readerSpawned = true
		go stack.processReceivedPDUs()
	}
	bind_arg, err := ConvertX500AssociateToIdmBind(arg)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	bind_bytes, err := asn1.Marshal(bind_arg)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	op_element := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        0,
		IsCompound: true,
		Bytes:      bind_bytes,
	}
	idm_payload, err := asn1.Marshal(op_element)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	frame := GetIdmFrame(idm_payload, stack.idmVersion)
	if stack.idmVersion == 2 {
		/* We request DER encoding because technically, this Golang library only
		   supports encoding and decoding DER. Fortunately, Meerkat DSA encodes
		   all BER responses in definite-length form, so it is pretty much DER
		   compatible anyway. If the server doesn't give us DER encoding, it must
		   mean that it gave us BER encoding. But regardless of whether BER or DER,
		   we don't do anything other than hope this library can tolerate whatever
		   encoding is returned. */
		frame[2] = 0b1000_0000
	}
	stack.mutex.Lock()
	if stack.bound == true {
		stack.mutex.Unlock()
		return X500AssociateOutcome{}, errors.New("already bound")
	}
	// TODO: If bind is anonymous, send a single write.
	_, err = stack.socket.Write(frame)
	if err != nil {
		stack.mutex.Unlock()
		return X500AssociateOutcome{}, err
	}
	_, err = stack.socket.Write(idm_payload)
	if err != nil {
		stack.mutex.Unlock()
		return X500AssociateOutcome{}, err
	}
	stack.mutex.Unlock()
	select {
	case response = <-stack.bindOutcome:
		stack.mutex.Lock()
		defer stack.mutex.Unlock()
		if response.OutcomeType == OPERATION_OUTCOME_TYPE_RESULT {
			stack.bound = true
		} else {
			stack.bound = false
		}
		if response.OutcomeType == OPERATION_OUTCOME_TYPE_FAILURE {
			return response, response.err
		}
		return response, nil
	case <-ctx.Done():
		return response, ctx.Err()
	}
}

func (stack *IDMProtocolStack) Request(ctx context.Context, req X500Request) (response X500OpOutcome, err error) {
	var invokeId int = 0
	rest, err := asn1.Unmarshal(req.InvokeId.FullBytes, &invokeId)
	if err != nil {
		return X500OpOutcome{}, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, errors.New("trailing bytes after invoke id")
	}
	idmRequest := Request{
		InvokeID: invokeId,
		Opcode:   req.OpCode,
		Argument: req.Argument,
	}
	reqBytes, err := asn1.Marshal(idmRequest)
	if err != nil {
		return X500OpOutcome{}, err
	}
	idmPDU := asn1.RawValue{
		Tag:        3,
		Class:      asn1.ClassContextSpecific,
		IsCompound: true,
		Bytes:      reqBytes,
	}
	pduBytes, err := asn1.Marshal(idmPDU)
	if err != nil {
		return X500OpOutcome{}, err
	}
	op := make(chan X500OpOutcome)
	frame := GetIdmFrame(pduBytes, stack.idmVersion)
	stack.mutex.Lock()
	if stack.bound == false {
		stack.mutex.Unlock()
		return X500OpOutcome{}, errors.New("request sent while not bound")
	}
	stack.pendingOperations[invokeId] = op
	_, err = stack.socket.Write(frame)
	if err != nil {
		delete(stack.pendingOperations, invokeId)
		return X500OpOutcome{}, err
	}
	_, err = stack.socket.Write(pduBytes)
	if err != nil {
		delete(stack.pendingOperations, invokeId)
		return X500OpOutcome{}, err
	}
	stack.mutex.Unlock()
	select {
	case response = <-op:
		break
	case <-ctx.Done():
		stack.mutex.Lock()
		delete(stack.pendingOperations, invokeId)
		stack.mutex.Unlock()
		return X500OpOutcome{}, ctx.Err()
	}
	stack.mutex.Lock()
	delete(stack.pendingOperations, invokeId)
	stack.mutex.Unlock()
	if err != nil {
		return X500OpOutcome{}, err
	}
	if response.OutcomeType == OPERATION_OUTCOME_TYPE_FAILURE {
		return response, response.err
	}
	return response, nil
}

func (stack *IDMProtocolStack) Unbind(_ context.Context, req X500UnbindRequest) (response X500UnbindOutcome, err error) {
	// TODO: This entire PDU has predictable form. Send this in a single write.
	op_element := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        7,
		IsCompound: true,
		Bytes:      asn1.NullBytes,
	}
	idm_payload, err := asn1.Marshal(op_element)
	if err != nil {
		return X500UnbindOutcome{}, err
	}
	frame := GetIdmFrame(idm_payload, stack.idmVersion)
	stack.mutex.Lock()
	defer stack.mutex.Unlock()
	if stack.bound == false {
		return X500UnbindOutcome{}, nil
	}
	stack.bound = false
	_, err = stack.socket.Write(frame)
	if err != nil {
		return X500UnbindOutcome{}, err
	}
	_, err = stack.socket.Write(idm_payload)
	if err != nil {
		return X500UnbindOutcome{}, err
	}
	return X500UnbindOutcome{}, nil
}

func HashAlgFromHash(h crypto.Hash) (alg pkix.AlgorithmIdentifier, err error) {
	switch h {
	case crypto.MD5:
		{
			alg.Algorithm = asn1.ObjectIdentifier{1, 2, 840, 113549, 2, 5}
			alg.Parameters = asn1.NullRawValue
		}
	case crypto.SHA1:
		{
			alg.Algorithm = Id_sha1
			alg.Parameters = asn1.NullRawValue
		}
	case crypto.SHA224:
		{
			alg.Algorithm = Id_sha224
		}
	case crypto.SHA256:
		{
			alg.Algorithm = Id_sha256
		}
	case crypto.SHA384:
		{
			alg.Algorithm = Id_sha384
		}
	case crypto.SHA512:
		{
			alg.Algorithm = Id_sha512
		}
	case crypto.SHA512_224:
		{
			alg.Algorithm = Id_sha512_224
		}
	case crypto.SHA512_256:
		{
			alg.Algorithm = Id_sha512_256
		}
	case crypto.SHA3_224:
		{
			alg.Algorithm = Id_sha3_224
		}
	case crypto.SHA3_256:
		{
			alg.Algorithm = Id_sha3_256
		}
	case crypto.SHA3_384:
		{
			alg.Algorithm = Id_sha3_384
		}
	case crypto.SHA3_512:
		{
			alg.Algorithm = Id_sha3_512
		}
	default:
		return alg, errors.New("no algorithm identifier for that")
	}
	return alg, nil
}

/*
Produce a `SIGNATURE` as defined in ITU-T Recommendation X.509 from a "signer"
(a `PrivateKey` such as `rsa.PrivateKey`), and the raw `data` to be signed.

This only supports RSA (PSS, not PKCS v1.5), ECDSA, and Ed25519.
*/
func sign(signer crypto.Signer, data []byte) (sig SIGNATURE, err error) {
	to_sign := data
	// No, we are not making this customizable right now.
	var opts crypto.SignerOpts = crypto.SHA256
	_, is_ed25519 := signer.(ed25519.PrivateKey)
	if is_ed25519 {
		opts = crypto.Hash(0)
		sig.AlgorithmIdentifier = pkix.AlgorithmIdentifier{
			Algorithm: asn1.ObjectIdentifier{1, 3, 101, 113}, // Not defined in the X.500 standards.
			// Will this handle the undefined value correctly?
		}
	}
	_, is_ecdsa := signer.(*ecdsa.PrivateKey)
	if is_ecdsa {
		sig.AlgorithmIdentifier = pkix.AlgorithmIdentifier{
			Algorithm: Ecdsa_with_SHA256,
		}
		hash := sha256.Sum256(data)
		to_sign = hash[:]
	}
	_, is_rsa := signer.(*rsa.PrivateKey)
	if is_rsa {
		opts = &rsa.PSSOptions{
			SaltLength: 32, // Recommended to be size of hash output.
			Hash:       crypto.SHA256,
		}
		pss_params := RSASSA_PSS_Type{
			HashAlgorithm: pkix.AlgorithmIdentifier{
				Algorithm: Id_sha256,
			},
			SaltLength:   32, // Recommended to be size of hash output.
			TrailerField: 1,  // This is always supposed to be 1, apparently.
		}
		pss_params_bytes, err := asn1.Marshal(pss_params)
		if err != nil {
			return SIGNATURE{}, err
		}
		sig.AlgorithmIdentifier = pkix.AlgorithmIdentifier{
			Algorithm:  Id_RSASSA_PSS,
			Parameters: asn1.RawValue{FullBytes: pss_params_bytes},
		}
		hash := sha256.Sum256(data)
		to_sign = hash[:]
	}

	sig_bytes, err := signer.Sign(rand.Reader, to_sign, opts)
	if err != nil {
		return SIGNATURE{}, err
	}
	sig.Signature.Bytes = sig_bytes
	sig.Signature.BitLength = len(sig_bytes) * 8
	return sig, nil
}

func getSigAlg(signer crypto.Signer) (sig_alg pkix.AlgorithmIdentifier, err error) {
	_, is_ed25519 := signer.(ed25519.PrivateKey)
	if is_ed25519 {
		sig_alg = pkix.AlgorithmIdentifier{
			Algorithm: asn1.ObjectIdentifier{1, 3, 101, 113}, // Not defined in the X.500 standards.
			// Will this handle the undefined value correctly?
		}
		return sig_alg, nil
	}
	_, is_ecdsa := signer.(*ecdsa.PrivateKey)
	if is_ecdsa {
		sig_alg = pkix.AlgorithmIdentifier{
			Algorithm: Ecdsa_with_SHA256,
		}
		return sig_alg, nil
	}
	_, is_rsa := signer.(*rsa.PrivateKey)
	if is_rsa {
		pss_params := RSASSA_PSS_Type{
			HashAlgorithm: pkix.AlgorithmIdentifier{
				Algorithm: Id_sha256,
			},
			SaltLength:   32, // Recommended to be size of hash output.
			TrailerField: 1,  // This is always supposed to be 1, apparently.
		}
		pss_params_bytes, err := asn1.Marshal(pss_params)
		if err != nil {
			return pkix.AlgorithmIdentifier{}, err
		}
		sig_alg = pkix.AlgorithmIdentifier{
			Algorithm:  Id_RSASSA_PSS,
			Parameters: asn1.RawValue{FullBytes: pss_params_bytes},
		}
		return sig_alg, nil
	}
	return pkix.AlgorithmIdentifier{}, errors.New("unsupported signing key algorithm")
}

func createSecurityParameters(
	opCode asn1.RawValue,
	certPath *CertificationPath,
	target ProtectionRequest,
	errorProtection ErrorProtectionRequest,
	name *DistinguishedName,
) (sp SecurityParameters, err error) {
	// 1 hour is long enough for any operation to complete, but not be easy to replay.
	sp_time := time.Now().Add(time.Duration(1) * time.Hour)
	time_bytes, err := asn1.Marshal(sp_time)
	if err != nil {
		return sp, err
	}
	random := make([]byte, 32)
	randlen, err := rand.Read(random)
	if err != nil {
		return sp, err
	}
	sp = SecurityParameters{
		Certification_path: *certPath,
		OperationCode: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        6,
			IsCompound: true,
			Bytes:      opCode.FullBytes,
		},
		Time: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        2,
			IsCompound: true,
			Bytes:      time_bytes,
		},
		Random: asn1.BitString{
			Bytes:     random[:randlen],
			BitLength: randlen * 8,
		},
		Target:          target,
		ErrorProtection: errorProtection,
		Name:            *name,
	}
	return sp, nil
}

func localOpCode(opcode byte) asn1.RawValue {
	return asn1.RawValue{
		Tag:        asn1.TagInteger,
		Class:      asn1.ClassUniversal,
		IsCompound: false,
		Bytes:      []byte{opcode},
		FullBytes:  []byte{byte(asn1.ClassUniversal) | byte(asn1.TagInteger), 1, opcode},
	}
}

func getToBeSigned[T any](signedBytes []byte, dataIsSet bool) (res *T, err error) {
	signedResult := SIGNED{}
	var innerResult T
	var rest []byte
	if dataIsSet {
		// If the signed data is a SET, the SIGNED is a SEQUENCE
		rest, err = asn1.Unmarshal(signedBytes, &signedResult)
	} else {
		// If the signed data is NOT a SET, the SIGNED is an [0] IMPLICIT SEQUENCE
		rest, err = asn1.UnmarshalWithParams(signedBytes, &signedResult, "tag:0")
	}
	if err != nil {
		return nil, err
	}
	if len(rest) > 0 {
		return nil, errors.New("trailing bytes in result encoding")
	}
	if dataIsSet {
		rest, err = asn1.UnmarshalWithParams(signedResult.ToBeSigned.FullBytes, &innerResult, "set")
	} else {
		rest, err = asn1.Unmarshal(signedResult.ToBeSigned.FullBytes, &innerResult)
	}
	if err != nil {
		return nil, err
	}
	if len(rest) > 0 {
		return nil, errors.New("trailing bytes in result data encoding")
	}
	return &innerResult, nil
}

func getDataFromNullOrOptProtSeq[T any](outcome X500OpOutcome) (response X500OpOutcome, result *T, err error) {
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	param := outcome.Parameter
	if param.Class == asn1.ClassContextSpecific && param.Tag == 0 {
		tbs, err := getToBeSigned[T](outcome.Parameter.FullBytes, false)
		if err != nil {
			return outcome, nil, err
		}
		return outcome, tbs, nil
	}
	if param.Class != asn1.ClassUniversal {
		// We don't recognize this result syntax. Just return the outcome.
		return outcome, nil, nil
	}
	if param.Tag == asn1.TagNull {
		// There's no data to return if this variant is used.
		return outcome, nil, nil
	} else if param.Tag == asn1.TagSequence {
		var res T
		rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &res)
		if err != nil {
			return outcome, nil, err
		}
		if len(rest) > 0 {
			return outcome, nil, errors.New("trailing bytes in result encoding")
		}
		return outcome, &res, nil
	} else {
		// We don't recognize this result syntax. Just return the outcome.
		return outcome, nil, nil
	}
}

// In case the user submits a value of a CHOICE field that does not have the
// correct tag, this function applies it.
func wrapWithTag(v asn1.RawValue, tag int) asn1.RawValue {
	if v.Class == asn1.ClassContextSpecific && v.Tag == tag {
		return v
	}
	innerBytes, err := asn1.Marshal(v)
	if err != nil {
		panic(err)
	}
	return asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        tag,
		IsCompound: true,
		Bytes:      innerBytes,
	}
}

const NORMAL_ATTR_SIZE_LIMIT = 1_000_000
const NORMAL_SIZE_LIMIT = 100_000

const SMALL_ATTR_SIZE_LIMIT = 65535
const SMALL_SIZE_LIMIT = 10_000

func configureServiceControls(ctx context.Context, sc *ServiceControls) {
	// If the user didn't specify a time limit for the request, we set one based
	// on the timeout of the context object. We round down the seconds to
	// accommodate for network latency and processing time.
	if sc.TimeLimit == 0 {
		deadline, has_deadline := ctx.Deadline()
		if has_deadline {
			timeLeft := int(math.Floor(deadline.Sub(time.Now()).Seconds()))
			sc.TimeLimit = timeLeft
		}
	}
	/* We want to set size default size limits so the directory does not hose
	   this computer by sending it a gigabyte-sized result. I use a simple
	   heuristic: number of CPUs. I use this heuristic because the number of CPUs
	   is just a static variable, so it requires virtually no computational
	   expense to use it with each request, in contrast to something like memory
	   usage, which is not cross-platform and more expensive to figure out. */
	numCpus := runtime.NumCPU()
	isSmallHost := numCpus <= 2
	if sc.AttributeSizeLimit == 0 {
		if isSmallHost {
			sc.AttributeSizeLimit = SMALL_ATTR_SIZE_LIMIT
		} else {
			sc.AttributeSizeLimit = NORMAL_ATTR_SIZE_LIMIT
		}
	}
	if sc.SizeLimit == 0 {
		if isSmallHost {
			sc.SizeLimit = SMALL_SIZE_LIMIT
		} else {
			sc.SizeLimit = NORMAL_SIZE_LIMIT
		}
	}
}

func (stack *IDMProtocolStack) Read(ctx context.Context, arg_data ReadArgumentData) (response X500OpOutcome, result *ReadResultData, err error) {
	opCode := localOpCode(1) // Read operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	if outcome.Parameter.Class != asn1.ClassUniversal {
		// We don't recognize this result syntax.
		return outcome, nil, nil
	}
	if outcome.Parameter.Tag == asn1.TagSet {
		var res ReadResultData
		rest, err := asn1.UnmarshalWithParams(outcome.Parameter.FullBytes, &res, "set")
		if err != nil {
			return outcome, nil, err
		}
		if len(rest) > 0 {
			return outcome, nil, errors.New("trailing bytes in result encoding")
		}
		return outcome, &res, nil
	} else if outcome.Parameter.Tag == asn1.TagSequence {
		tbs, err := getToBeSigned[ReadResultData](outcome.Parameter.FullBytes, true)
		if err != nil {
			return outcome, nil, err
		}
		return outcome, tbs, nil
	} else {
		// We don't recognize this result syntax. Just return the outcome.
		return outcome, nil, nil
	}
}

func (stack *IDMProtocolStack) Compare(ctx context.Context, arg_data CompareArgumentData) (resp X500OpOutcome, result *CompareResultData, err error) {
	opCode := localOpCode(2) // Compare operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	if outcome.Parameter.Class != asn1.ClassUniversal {
		// We don't recognize this result syntax.
		return outcome, nil, nil
	}
	if outcome.Parameter.Tag == asn1.TagSet {
		var res CompareResultData
		rest, err := asn1.UnmarshalWithParams(outcome.Parameter.FullBytes, &res, "set")
		if err != nil {
			return outcome, nil, err
		}
		if len(rest) > 0 {
			return outcome, nil, errors.New("trailing bytes in result encoding")
		}
		return outcome, &res, nil
	} else if outcome.Parameter.Tag == asn1.TagSequence {
		tbs, err := getToBeSigned[CompareResultData](outcome.Parameter.FullBytes, true)
		if err != nil {
			return outcome, nil, err
		}
		return outcome, tbs, nil
	} else {
		// We don't recognize this result syntax. Just return the outcome.
		return outcome, nil, nil
	}
}

func (stack *IDMProtocolStack) Abandon(ctx context.Context, arg_data AbandonArgumentData) (resp X500OpOutcome, result *AbandonResultData, err error) {
	opCode := localOpCode(3) // Abandon operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	arg_data.InvokeID = wrapWithTag(arg_data.InvokeID, 0)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_bytes[0] = 0xA0 // [0] IMPLICIT (Constructed)
	} else {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[AbandonResultData](outcome)
}

func (stack *IDMProtocolStack) List(ctx context.Context, arg_data ListArgumentData) (resp X500OpOutcome, info *ListResultData_listInfo, err error) {
	opCode := localOpCode(4) // List operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	if arg_data.PagedResults.Tag != 0 {
		arg_data.PagedResults = wrapWithTag(arg_data.PagedResults, 1)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	param := outcome.Parameter
	if param.Class == asn1.ClassUniversal && param.Tag == asn1.TagSequence {
		signedResult := SIGNED{}
		rest, err := asn1.Unmarshal(param.FullBytes, &signedResult)
		if err != nil {
			return outcome, nil, err
		}
		if len(rest) > 0 {
			return outcome, nil, errors.New("trailing bytes")
		}
		param = signedResult.ToBeSigned
	}
	if param.Class == asn1.ClassContextSpecific && param.Tag == 0 {
		// This is the uncorrelatedListInfo: we can't simplify this any further.
		return outcome, nil, nil
	}
	if param.Class != asn1.ClassUniversal || param.Tag != asn1.TagSet {
		// This is some other syntax other than listInfo.
		return outcome, nil, nil
	}
	info = &ListResultData_listInfo{}
	rest, err := asn1.UnmarshalWithParams(param.FullBytes, info, "set")
	if err != nil {
		return outcome, nil, err
	}
	if len(rest) > 0 {
		return outcome, nil, errors.New("trailing bytes")
	}
	return outcome, info, nil
}

func (stack *IDMProtocolStack) Search(ctx context.Context, arg_data SearchArgumentData) (resp X500OpOutcome, info *SearchResultData_searchInfo, err error) {
	opCode := localOpCode(5) // Search operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.BaseObject = wrapWithTag(arg_data.BaseObject, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	if arg_data.PagedResults.Tag != 0 {
		arg_data.PagedResults = wrapWithTag(arg_data.PagedResults, 5)
	}
	if arg_data.Filter.Tag != 0 {
		arg_data.Filter = wrapWithTag(arg_data.Filter, 2)
	}
	if arg_data.ExtendedFilter.Tag != 0 {
		arg_data.ExtendedFilter = wrapWithTag(arg_data.ExtendedFilter, 7)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	param := outcome.Parameter
	if param.Class == asn1.ClassUniversal && param.Tag == asn1.TagSequence {
		signedResult := SIGNED{}
		rest, err := asn1.Unmarshal(param.FullBytes, &signedResult)
		if err != nil {
			return outcome, nil, err
		}
		if len(rest) > 0 {
			return outcome, nil, errors.New("trailing bytes")
		}
		param = signedResult.ToBeSigned
	}
	if param.Class == asn1.ClassContextSpecific && param.Tag == 0 {
		// This is the uncorrelatedSearchInfo: we can't simplify this any further.
		return outcome, nil, nil
	}
	if param.Class != asn1.ClassUniversal || param.Tag != asn1.TagSet {
		// This is some other syntax other than searchInfo.
		return outcome, nil, nil
	}
	info = &SearchResultData_searchInfo{}
	rest, err := asn1.UnmarshalWithParams(param.FullBytes, info, "set")
	if err != nil {
		return outcome, nil, err
	}
	if len(rest) > 0 {
		return outcome, nil, errors.New("trailing bytes")
	}
	return outcome, info, nil
}

func (stack *IDMProtocolStack) AddEntry(ctx context.Context, arg_data AddEntryArgumentData) (resp X500OpOutcome, result *AddEntryResultData, err error) {
	opCode := localOpCode(6) // AddEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[AddEntryResultData](outcome)
}

func (stack *IDMProtocolStack) RemoveEntry(ctx context.Context, arg_data RemoveEntryArgumentData) (resp X500OpOutcome, result *RemoveEntryResultData, err error) {
	opCode := localOpCode(7) // RemoveEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[RemoveEntryResultData](outcome)
}

func (stack *IDMProtocolStack) ModifyEntry(ctx context.Context, arg_data ModifyEntryArgumentData) (resp X500OpOutcome, result *ModifyEntryResultData, err error) {
	opCode := localOpCode(8) // ModifyEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.Object = wrapWithTag(arg_data.Object, 0)
	if arg_data.OperationContexts.Tag != 0 {
		arg_data.OperationContexts = wrapWithTag(arg_data.OperationContexts, 20)
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[ModifyEntryResultData](outcome)
}

func (stack *IDMProtocolStack) ModifyDN(ctx context.Context, arg_data ModifyDNArgumentData) (resp X500OpOutcome, result *ModifyDNResultData, err error) {
	opCode := localOpCode(9) // ModifyDN operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	configureServiceControls(ctx, &arg_data.ServiceControls)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.SigningCert,
			stack.ResultsSigning,
			stack.ErrorSigning,
			nil,
		)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_data.SecurityParameters = sp
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	} else {
		arg_bytes, err = asn1.MarshalWithParams(arg_data, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[ModifyDNResultData](outcome)
}

func (stack *IDMProtocolStack) ChangePassword(ctx context.Context, arg_data ChangePasswordArgumentData) (resp X500OpOutcome, result *ChangePasswordResultData, err error) {
	opCode := localOpCode(10) // ChangePassword operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.OldPwd = wrapWithTag(arg_data.OldPwd, 1)
	arg_data.NewPwd = wrapWithTag(arg_data.NewPwd, 2)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_bytes[0] = 0xA0 // [0] IMPLICIT (Constructed)
	} else {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[ChangePasswordResultData](outcome)
}

func (stack *IDMProtocolStack) AdministerPassword(ctx context.Context, arg_data AdministerPasswordArgumentData) (resp X500OpOutcome, result *AdministerPasswordResultData, err error) {
	opCode := localOpCode(11) // AdministerPassword operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	// Just to make sure the library user got it correct.
	arg_data.NewPwd = wrapWithTag(arg_data.NewPwd, 1)
	var arg_bytes []byte
	if stack.SigningKey != nil && stack.SigningCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.SigningKey, arg_bytes)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		signed := SIGNED{
			ToBeSigned:          asn1.RawValue{FullBytes: arg_bytes},
			AlgorithmIdentifier: sig.AlgorithmIdentifier,
			Signature:           sig.Signature,
		}
		arg_bytes, err = asn1.Marshal(signed)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		arg_bytes[0] = 0xA0 // [0] IMPLICIT (Constructed)
	} else {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
	}
	req := X500Request{
		InvokeId: asn1.RawValue{FullBytes: iidBytes},
		OpCode:   opCode,
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := stack.Request(ctx, req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	return getDataFromNullOrOptProtSeq[AdministerPasswordResultData](outcome)
}

func (stack *IDMProtocolStack) BindSimply(ctx context.Context, dn DistinguishedName, password string) (resp X500AssociateOutcome, err error) {
	unprotected := asn1.RawValue{
		Class:      asn1.ClassUniversal,
		Tag:        asn1.TagOctetString,
		IsCompound: false,
		Bytes:      []byte(password),
	}
	unprotectedBytes, err := asn1.Marshal(unprotected)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	simpleCreds := SimpleCredentials{
		Name:     dn,
		Validity: SimpleCredentials_validity{
			// TODO:
		},
		Password: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        2,
			IsCompound: true,
			Bytes:      unprotectedBytes,
		},
	}
	simpleCredsBytes, err := asn1.Marshal(simpleCreds)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	creds := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        0,
		IsCompound: true,
		Bytes:      simpleCredsBytes,
	}
	credsBytes, err := asn1.Marshal(creds)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	arg := X500AssociateArgument{
		V1: true,
		V2: true,
		Credentials: &asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      credsBytes,
		},
	}
	return stack.Bind(ctx, arg)
}

func (stack *IDMProtocolStack) BindStrongly(ctx context.Context, requesterDN DistinguishedName, recipientDN DistinguishedName, acPath *AttributeCertificationPath) (resp X500AssociateOutcome, err error) {
	if stack.SigningKey == nil {
		return X500AssociateOutcome{}, errors.New("no signing key configured")
	}
	if stack.SigningCert == nil {
		return X500AssociateOutcome{}, errors.New("no signing cert configured")
	}
	sig_alg, err := getSigAlg(*stack.SigningKey)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	// Twelve-hour time limit for this token, just to mitigate any problems with
	// timezones differences.
	timeBytes, err := asn1.Marshal(time.Now().Add(time.Duration(12) * time.Hour))
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	random := make([]byte, 32)
	randlen, err := rand.Read(random)
	if err != nil {
		return X500AssociateOutcome{}, err
	}

	tokenContent := TokenContent{
		Algorithm: sig_alg,
		Name:      recipientDN,
		Time: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        2,
			IsCompound: true,
			Bytes:      timeBytes,
		},
		Random: asn1.BitString{
			Bytes:     random[:randlen],
			BitLength: randlen * 8,
		},
	}
	tokenContentBytes, err := asn1.Marshal(tokenContent)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	sig, err := sign(*stack.SigningKey, tokenContentBytes)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	token := Token{
		ToBeSigned:          asn1.RawValue{FullBytes: tokenContentBytes},
		AlgorithmIdentifier: sig.AlgorithmIdentifier,
		Signature:           sig.Signature,
	}
	certPathRaw := CertificationPathRaw{
		UserCertificate:   asn1.RawValue{FullBytes: stack.SigningCert.UserCertificate.Raw},
		TheCACertificates: make([]CertificatePairRaw, 0), // I already know this is empty.
	}
	strongCreds := StrongCredentials{
		Certification_path: certPathRaw,
		Bind_token:         token,
		Name:               requesterDN,
	}
	if acPath != nil {
		strongCreds.AttributeCertificationPath = *acPath
	}
	strongCredsBytes, err := asn1.MarshalWithParams(strongCreds, "set")
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	// creds := asn1.RawValue{
	// 	Class:      asn1.ClassContextSpecific,
	// 	Tag:        1,
	// 	IsCompound: true,
	// 	Bytes:      strongCredsBytes,
	// }
	// credsBytes, err := asn1.Marshal(creds)
	// if err != nil {
	// 	return X500AssociateOutcome{}, err
	// }
	arg := X500AssociateArgument{
		V1: true,
		V2: true,
		Credentials: &asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        1,
			IsCompound: true,
			Bytes:      strongCredsBytes,
		},
	}
	return stack.Bind(ctx, arg)
}

func containsNullChar(s string) bool {
	for _, c := range s {
		if c == 0 {
			return true
		}
	}
	return false
}

func (stack *IDMProtocolStack) BindPlainly(ctx context.Context, username string, password string) (resp X500AssociateOutcome, err error) {
	if containsNullChar(username) {
		return X500AssociateOutcome{}, errors.New("username contains null character")
	}
	if containsNullChar(password) {
		return X500AssociateOutcome{}, errors.New("password contains null character")
	}
	saslPayload := []byte{'\x00'}
	saslPayload = append(saslPayload, []byte(username)...)
	saslPayload = append(saslPayload, '\x00')
	saslPayload = append(saslPayload, []byte(password)...)
	saslCreds := SaslCredentials{
		Mechanism: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      []byte{asn1.TagPrintableString, 5, 'P', 'L', 'A', 'I', 'N'},
		},
		Credentials: saslPayload,
	}
	saslCredsBytes, err := asn1.Marshal(saslCreds)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	creds := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        4,
		IsCompound: true,
		Bytes:      saslCredsBytes,
	}
	credsBytes, err := asn1.Marshal(creds)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	arg := X500AssociateArgument{
		V1: true,
		V2: true,
		Credentials: &asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      credsBytes,
		},
	}
	return stack.Bind(ctx, arg)
}

func (stack *IDMProtocolStack) ReadSimple(ctx context.Context, dn DistinguishedName, userAttributes []asn1.ObjectIdentifier) (response X500OpOutcome, result *ReadResultData, err error) {
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	read_arg := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name_bytes,
		},
	}
	if len(userAttributes) > 0 {
		attrBytes, err := asn1.MarshalWithParams(userAttributes, "set")
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		read_arg.Selection.Attributes = asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        1,
			IsCompound: true,
			Bytes:      attrBytes,
		}
	}
	return stack.Read(ctx, read_arg)
}

func (stack *IDMProtocolStack) RemoveEntryByDN(ctx context.Context, dn DistinguishedName) (resp X500OpOutcome, result *RemoveEntryResultData, err error) {
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	arg := RemoveEntryArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name_bytes,
		},
	}
	return stack.RemoveEntry(ctx, arg)
}

func (stack *IDMProtocolStack) AbandonById(ctx context.Context, invokeId int) (resp X500OpOutcome, result *AbandonResultData, err error) {
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	arg := AbandonArgumentData{
		InvokeID: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      iidBytes,
		},
	}
	return stack.Abandon(ctx, arg)
}

func (stack *IDMProtocolStack) ListByDN(ctx context.Context, dn DistinguishedName, limit int) (resp X500OpOutcome, info *ListResultData_listInfo, err error) {
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	arg := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name_bytes,
		},
	}
	if limit > 0 {
		arg.ServiceControls.SizeLimit = limit
	}
	return stack.List(ctx, arg)
}

func (stack *IDMProtocolStack) AddEntrySimple(ctx context.Context, dn DistinguishedName, attrs []Attribute) (resp X500OpOutcome, result *AddEntryResultData, err error) {
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	arg := AddEntryArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name_bytes,
		},
		Entry: attrs,
	}
	return stack.AddEntry(ctx, arg)
}

func (stack *IDMProtocolStack) ChangePasswordSimple(ctx context.Context, dn DistinguishedName, old string, new string) (resp X500OpOutcome, result *ChangePasswordResultData, err error) {
	oldstr, err := asn1.MarshalWithParams(old, "utf8")
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	newstr, err := asn1.MarshalWithParams(new, "utf8")
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	oldPwd := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        1,
		IsCompound: true,
		Bytes:      oldstr,
	}
	newPwd := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        2,
		IsCompound: true,
		Bytes:      newstr,
	}
	arg := ChangePasswordArgumentData{
		Object: dn,
		OldPwd: oldPwd,
		NewPwd: newPwd,
	}
	return stack.ChangePassword(ctx, arg)
}

func (stack *IDMProtocolStack) AdministerPasswordSimple(ctx context.Context, dn DistinguishedName, new string) (resp X500OpOutcome, result *AdministerPasswordResultData, err error) {
	newstr, err := asn1.MarshalWithParams(new, "utf8")
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	newPwd := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        2,
		IsCompound: true,
		Bytes:      newstr,
	}
	arg := AdministerPasswordArgumentData{
		Object: dn,
		NewPwd: newPwd,
	}
	return stack.AdministerPassword(ctx, arg)
}
