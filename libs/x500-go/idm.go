package x500_go

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/ed25519"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/asn1"
	"encoding/binary"
	"errors"
	"fmt"
	"net"
	"sync"
	"time"
)

const BIND_RESPONSE_RECEIVE_BUFFER_SIZE = 4096
const SIZE_OF_IDMV1_FRAME = uint32(6)
const SIZE_OF_IDMv2_FRAME = 8

func GetIdmFrame(payload []byte) []byte {
	idm_prefix := []byte{0x01, 0x01}
	payload_length := make([]byte, 4)
	binary.BigEndian.PutUint32(payload_length, uint32(len(payload)))
	frame := idm_prefix
	frame = append(frame, payload_length...)
	return frame
}

func FrameIdm(payload []byte) []byte {
	idm_prefix := []byte{0x01, 0x01}
	payload_length := make([]byte, 4)
	binary.BigEndian.PutUint32(payload_length[:], uint32(len(payload)))
	frame := idm_prefix[:]
	frame = append(frame, payload_length[:]...)
	frame = append(frame, payload[:]...)
	return frame
}

type IDMFrame struct {
	Version  uint8
	Final    uint8
	Encoding uint16
	Data     []byte
}

type IDMProtocolStack struct {
	socket            net.Conn
	PendingOperations map[int]*X500Operation
	mutex             sync.Mutex
	NextInvokeId      int
	ReceivedData      []byte
	bound             chan bool
	signingKey        *crypto.Signer
	signingCert       *CertificationPath
	resultSigning     ProtectionRequest
	errorSigning      ErrorProtectionRequest

	// Channel where errors can be returned to the main thread.
	errorChannel chan error
}

func (stack *IDMProtocolStack) DispatchError(err error) {
	stack.errorChannel <- err
}

func (stack *IDMProtocolStack) GetNextInvokeId() int {
	stack.mutex.Lock()
	ret := stack.NextInvokeId
	stack.NextInvokeId++
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
	bind_req := DirectoryBindArgument{
		Versions: asn1.BitString{
			BitLength: bitLength,
			Bytes:     []byte{versions_byte},
		},
		Credentials: arg.Credentials,
	}
	bind_req_bytes, err := asn1.MarshalWithParams(bind_req, "set")
	if err != nil {
		return IdmBind{}, err
	}
	req = IdmBind{
		ProtocolID: Id_idm_dap,
		Argument: asn1.RawValue{
			Tag:        2,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      bind_req_bytes,
		},
	}
	return req, nil
}

func (stack *IDMProtocolStack) ReadIDMv1Frame(startIndex uint32, frame *IDMFrame) (bytesRead uint32, err error) {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()
	if uint32(len(stack.ReceivedData)) < SIZE_OF_IDMV1_FRAME {
		bytesRead = 0
		return
	}
	if stack.ReceivedData[startIndex] != 1 {
		err = fmt.Errorf("non idm v1 response; first byte=0x% x", stack.ReceivedData[0])
		return
	}
	lengthOfDataField := binary.BigEndian.Uint32(stack.ReceivedData[startIndex+2 : startIndex+SIZE_OF_IDMV1_FRAME])
	lengthNeeded := (startIndex + SIZE_OF_IDMV1_FRAME + lengthOfDataField)
	// TODO: Check if it's too large.
	if lengthNeeded > uint32(len(stack.ReceivedData)) {
		bytesRead = 0
	} else {
		bytesRead = SIZE_OF_IDMV1_FRAME + lengthOfDataField
		frame.Version = 1
		frame.Final = stack.ReceivedData[startIndex+1]
		frame.Data = stack.ReceivedData[startIndex+SIZE_OF_IDMV1_FRAME : lengthNeeded]
	}
	return
}

func (stack *IDMProtocolStack) ReadIDMv1PDU(pdu *IDM_PDU) (bytesRead uint32, err error) {
	var frames = make([]IDMFrame, 0)
	var startIndex uint32 = 0
	index := startIndex
	for err == nil {
		frame := IDMFrame{}
		frameBytesRead, err := stack.ReadIDMv1Frame(index, &frame)
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
			receiveBuffer := make([]byte, BIND_RESPONSE_RECEIVE_BUFFER_SIZE)
			// FIXME: This needs to go at the end. Reading will block subsequent IDM packets from being read.
			bytesReceived, err := stack.socket.Read(receiveBuffer)
			if err != nil {
				return 0, err
			}
			stack.mutex.Lock()
			stack.ReceivedData = append(stack.ReceivedData, receiveBuffer[0:bytesReceived]...)
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
			stack.ReceivedData = stack.ReceivedData[startIndex+bytesRead:]
			stack.mutex.Unlock()
			return bytesRead, nil
		} else {
			// TODO: Check maximum frames
			frames = append(frames, frame)
		}
	}
	return bytesRead, nil
}

func (stack *IDMProtocolStack) HandleBindPDU(pdu IdmBind) {
	stack.DispatchError(errors.New("server sent bind"))
}

func (stack *IDMProtocolStack) HandleBindResultPDU(pdu IdmBindResult) {
	stack.bound <- true
}

func (stack *IDMProtocolStack) HandleBindErrorPDU(pdu IdmBindError) {
	stack.bound <- false
}

func (stack *IDMProtocolStack) HandleRequestPDU(pdu Request) {
	stack.DispatchError(errors.New("server sent request"))
}

func (stack *IDMProtocolStack) HandleResultPDU(pdu IdmResult) {
	stack.mutex.Lock()
	op, op_known := stack.PendingOperations[pdu.InvokeID]
	stack.mutex.Unlock()
	if !op_known {
		stack.DispatchError(errors.New("unrecognized result invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.DispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_RESULT,
		InvokeId:    asn1.RawValue{FullBytes: iidBytes},
		OpCode:      pdu.Opcode,
		Parameter:   pdu.Result,
	}
	op.Res = &res
	op.Done <- true
}

func (stack *IDMProtocolStack) HandleErrorPDU(pdu IdmError) {
	op, op_known := stack.PendingOperations[pdu.InvokeID]
	if !op_known {
		stack.DispatchError(errors.New("unrecognized error invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.DispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_ERROR,
		InvokeId:    asn1.RawValue{FullBytes: iidBytes},
		OpCode:      op.Req.OpCode,
		ErrCode:     pdu.Errcode,
		Parameter:   pdu.Error,
	}
	op.Res = &res
	op.Done <- true
}

func (stack *IDMProtocolStack) HandleRejectPDU(pdu IdmReject) {
	op, op_known := stack.PendingOperations[pdu.InvokeID]
	if !op_known {
		stack.DispatchError(errors.New("unrecognized error invoke id"))
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		stack.DispatchError(err)
		return
	}
	res := X500OpOutcome{
		OutcomeType:   OPERATION_OUTCOME_TYPE_REJECT,
		InvokeId:      asn1.RawValue{FullBytes: iidBytes},
		OpCode:        op.Req.OpCode,
		RejectProblem: pdu.Reason,
	}
	op.Res = &res
	op.Done <- true
}

func (stack *IDMProtocolStack) HandleUnbindPDU(pdu Unbind) {
	fmt.Println("UNBIND")
}

func (stack *IDMProtocolStack) HandleAbortPDU(pdu Abort) {
	// TODO: Set all outstanding operations to abort
	stack.socket.Close()
}

func (stack *IDMProtocolStack) HandleStartTLSPDU(pdu StartTLS) {

}

func (stack *IDMProtocolStack) HandleTLSResponsePDU(pdu TLSResponse) {

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
//
// TODO: Do something with errors
func (stack *IDMProtocolStack) HandlePDU(pdu IDM_PDU) {
	if pdu.Class != asn1.ClassContextSpecific {
		return
	}
	switch pdu.Tag {
	case 0:
		{
			payload := IdmBind{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleBindPDU(payload)
		}
	case 1:
		{
			payload := IdmBindResult{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleBindResultPDU(payload)
		}
	case 2:
		{
			payload := IdmBindError{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleBindErrorPDU(payload)
		}
	case 3:
		{
			payload := Request{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleRequestPDU(payload)
		}
	case 4:
		{
			payload := IdmResult{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleResultPDU(payload)
		}
	case 5:
		{
			payload := IdmError{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleErrorPDU(payload)
		}
	case 6:
		{
			payload := IdmReject{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleRejectPDU(payload)
		}
	case 7:
		{
			payload := Unbind{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleUnbindPDU(payload)
		}
	case 8:
		{
			abortReason := 0
			rest, err := asn1.Unmarshal(pdu.Bytes, &abortReason)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleAbortPDU(abortReason)
		}
	case 9:
		{
			payload := StartTLS{}
			rest, err := asn1.Unmarshal(pdu.Bytes, &payload)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleStartTLSPDU(payload)
		}
	case 10:
		{
			tlsResponse := 0
			rest, err := asn1.Unmarshal(pdu.Bytes, &tlsResponse)
			if err != nil {
				return
			}
			if len(rest) > 0 {
				return
			}
			stack.HandleTLSResponsePDU(tlsResponse)
		}
	default:
		{
			return
		}
	}
}

func (stack *IDMProtocolStack) ProcessNextPDU() (bytesRead uint32, err error) {
	pdu := IDM_PDU{}
	bytesRead, err = stack.ReadIDMv1PDU(&pdu)
	if err != nil {
		return
	}
	if bytesRead == 0 {
		return
	}
	go stack.HandlePDU(pdu)
	return
}

func (stack *IDMProtocolStack) ProcessReceivedPDUs() (err error) {
	for err == nil {
		_, err := stack.ProcessNextPDU()
		if err != nil {
			return err
		}
	}
	return err
}

func (stack *IDMProtocolStack) BindAnonymously() (response X500AssociateOutcome, err error) {
	arg := X500AssociateArgument{
		V1: true,
		V2: true,
	}
	return stack.Bind(arg)
}

func (stack *IDMProtocolStack) Bind(arg X500AssociateArgument) (response X500AssociateOutcome, err error) {
	bind_arg, err := ConvertX500AssociateToIdmBind(arg)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	bind_arg_bytes, err := asn1.MarshalWithParams(bind_arg, "set")
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	// I don't know why Marshal() does not handle this, but apparently, I have
	// to manually apply the outer [2] tag.
	bind_arg_el := asn1.RawValue{
		Tag:        2,
		Class:      asn1.ClassContextSpecific,
		IsCompound: true,
		Bytes:      bind_arg_bytes,
	}
	bind := IdmBind{
		ProtocolID:     Id_idm_dap,
		Argument:       bind_arg_el,
		CallingAETitle: arg.CallingAETitle,
		CalledAETitle:  arg.CalledAETitle,
	}
	bind_bytes, err := asn1.Marshal(bind)
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
	frame := GetIdmFrame(idm_payload)
	stack.mutex.Lock()
	_, err = stack.socket.Write(frame)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	_, err = stack.socket.Write(idm_payload)
	if err != nil {
		return X500AssociateOutcome{}, err
	}
	stack.mutex.Unlock()
	<-stack.bound
	return
}

func (stack *IDMProtocolStack) Request(req X500Request) (response X500OpOutcome, err error) {
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
	op := X500Operation{
		Req:   req,
		Done:  make(chan bool),
		Error: nil,
	}
	frame := GetIdmFrame(pduBytes)
	stack.mutex.Lock()
	stack.PendingOperations[invokeId] = &op
	_, err = stack.socket.Write(frame)
	if err != nil {
		delete(stack.PendingOperations, invokeId)
		return X500OpOutcome{}, err
	}
	_, err = stack.socket.Write(pduBytes)
	if err != nil {
		delete(stack.PendingOperations, invokeId)
		return X500OpOutcome{}, err
	}
	stack.mutex.Unlock()
	select {
	case <-op.Done:
	case <-time.After(15 * time.Second):
		stack.mutex.Lock()
		delete(stack.PendingOperations, invokeId)
		stack.mutex.Unlock()
		return X500OpOutcome{}, errors.New("request timeout")
	}
	stack.mutex.Lock()
	delete(stack.PendingOperations, invokeId)
	stack.mutex.Unlock()
	if err != nil {
		return X500OpOutcome{}, err
	}
	return *op.Res, nil
}

func (stack *IDMProtocolStack) Unbind(req X500UnbindRequest) (response X500UnbindOutcome, err error) {
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
	frame := GetIdmFrame(idm_payload)
	stack.mutex.Lock()
	_, err = stack.socket.Write(frame)
	if err != nil {
		return X500UnbindOutcome{}, err
	}
	_, err = stack.socket.Write(idm_payload)
	if err != nil {
		return X500UnbindOutcome{}, err
	}
	stack.mutex.Unlock()
	<-stack.bound
	return X500UnbindOutcome{}, nil
}

func HashAlgFromHash(h crypto.Hash) (alg AlgorithmIdentifier, err error) {
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
		sig.AlgorithmIdentifier = AlgorithmIdentifier{
			Algorithm: asn1.ObjectIdentifier{1, 3, 101, 113}, // Not defined in the X.500 standards.
			// Will this handle the undefined value correctly?
		}
	}
	_, is_ecdsa := signer.(*ecdsa.PrivateKey)
	if is_ecdsa {
		sig.AlgorithmIdentifier = AlgorithmIdentifier{
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
			HashAlgorithm: AlgorithmIdentifier{
				Algorithm: Id_sha256,
			},
			SaltLength:   32, // Recommended to be size of hash output.
			TrailerField: 1,  // This is always supposed to be 1, apparently.
		}
		pss_params_bytes, err := asn1.Marshal(pss_params)
		if err != nil {
			return SIGNATURE{}, err
		}
		sig.AlgorithmIdentifier = AlgorithmIdentifier{
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
		OperationCode:      opCode,
		Time:               asn1.RawValue{FullBytes: time_bytes},
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
	}
}

func getToBeSigned[T any](signedBytes []byte, isSet bool) (res *T, err error) {
	signedResult := SIGNED{}
	var innerResult T
	rest, err := asn1.Unmarshal(signedBytes, &signedResult)
	if err != nil {
		return nil, err
	}
	if len(rest) > 0 {
		return nil, errors.New("trailing bytes in result encoding")
	}
	if isSet {
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

func (stack *IDMProtocolStack) Read(arg_data ReadArgumentData) (response X500OpOutcome, result *ReadResultData, err error) {
	opCode := localOpCode(1) // Read operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
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
		// res := ReadResultData{}
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

func (stack *IDMProtocolStack) Compare(arg_data CompareArgumentData) (resp X500OpOutcome, result *CompareResult, err error) {
	opCode := localOpCode(2) // Compare operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) Abandon(arg_data AbandonArgumentData) (resp X500OpOutcome, result *AbandonResult, err error) {
	opCode := localOpCode(3) // Abandon operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) List(arg_data ListArgumentData) (resp X500OpOutcome, result *ListResult, err error) {
	opCode := localOpCode(4) // List operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) Search(arg_data SearchArgumentData) (resp X500OpOutcome, result *SearchResult, err error) {
	opCode := localOpCode(5) // Search operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) AddEntry(arg_data AddEntryArgumentData) (resp X500OpOutcome, result *AddEntryResult, err error) {
	opCode := localOpCode(6) // AddEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) RemoveEntry(arg_data RemoveEntryArgumentData) (resp X500OpOutcome, result *RemoveEntryResult, err error) {
	opCode := localOpCode(7) // RemoveEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) ModifyEntry(arg_data ModifyEntryArgumentData) (resp X500OpOutcome, result *ModifyEntryResult, err error) {
	opCode := localOpCode(8) // ModifyEntry operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) ModifyDN(arg_data ModifyDNArgumentData) (resp X500OpOutcome, result *ModifyDNResult, err error) {
	opCode := localOpCode(9) // ModifyDN operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		sp, err := createSecurityParameters(
			opCode,
			stack.signingCert,
			stack.resultSigning,
			stack.errorSigning,
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
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) ChangePassword(arg_data ChangePasswordArgumentData) (resp X500OpOutcome, result *ChangePasswordResult, err error) {
	opCode := localOpCode(10) // ChangePassword operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}

func (stack *IDMProtocolStack) AdministerPassword(arg_data AdministerPasswordArgumentData) (resp X500OpOutcome, result *AdministerPasswordResult, err error) {
	opCode := localOpCode(11) // AdministerPassword operation
	invokeId := stack.GetNextInvokeId()
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	var arg_bytes []byte
	if stack.signingKey != nil && stack.signingCert != nil {
		arg_bytes, err = asn1.Marshal(arg_data)
		if err != nil {
			return X500OpOutcome{}, nil, err
		}
		sig, err := sign(*stack.signingKey, arg_bytes)
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
	outcome, err := stack.Request(req)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
		return outcome, nil, nil
	}
	rest, err := asn1.Unmarshal(outcome.Parameter.FullBytes, &result)
	if err != nil {
		return X500OpOutcome{}, nil, err
	}
	if len(rest) > 0 {
		return X500OpOutcome{}, nil, errors.New("trailing bytes")
	}
	return outcome, result, nil
}
