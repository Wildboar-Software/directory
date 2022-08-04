package x500_go

import (
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
	frame := []byte{}
	idm_prefix := []byte{0x01, 0x01}
	payload_length := make([]byte, 4)
	binary.BigEndian.PutUint32(payload_length, uint32(len(payload)))
	frame = idm_prefix
	frame = append(frame, payload_length...)
	return frame
}

func FrameIdm(payload []byte) []byte {
	frame := []byte{}
	idm_prefix := []byte{0x01, 0x01}
	payload_length := make([]byte, 4)
	binary.BigEndian.PutUint32(payload_length[:], uint32(len(payload)))
	frame = idm_prefix[:]
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
}

func (stack *IDMProtocolStack) GetNextInvokeId() int {
	ret := stack.NextInvokeId
	stack.NextInvokeId++
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
		return
	}
	req = IdmBind{
		ProtocolID: arg.ApplicationContext,
		Argument: asn1.RawValue{
			Tag:        2,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      bind_req_bytes,
		},
	}
	return
}

func (stack *IDMProtocolStack) ReadIDMv1Frame(startIndex uint32, frame *IDMFrame) (bytesRead uint32, err error) {
	receiveBuffer := make([]byte, BIND_RESPONSE_RECEIVE_BUFFER_SIZE)
	bytesReceived, err := stack.socket.Read(receiveBuffer)
	if err != nil {
		stack.mutex.Unlock()
		return
	}
	stack.mutex.Lock()
	stack.ReceivedData = append(stack.ReceivedData, receiveBuffer[0:bytesReceived]...)
	stack.mutex.Unlock()
	if len(stack.ReceivedData) < 6 {
		bytesRead = 0
		return
	}
	if stack.ReceivedData[0] != 1 {
		err = fmt.Errorf("Did not receive an IDMv1 response. First byte was 0x% x", stack.ReceivedData[0])
		return
	}
	size := binary.BigEndian.Uint32(stack.ReceivedData[startIndex+2 : startIndex+SIZE_OF_IDMV1_FRAME])
	lengthNeeded := (startIndex + SIZE_OF_IDMV1_FRAME + size)
	// TODO: Check if it's too large.
	if lengthNeeded < uint32(len(stack.ReceivedData)) {
		// fmt.Printf("Not enough bytes: % x\n", stack.ReceivedData)
		bytesRead = 0
	} else {
		bytesRead = lengthNeeded
		frame.Version = 1
		frame.Final = stack.ReceivedData[startIndex+1]
		frame.Data = stack.ReceivedData[startIndex+SIZE_OF_IDMV1_FRAME : lengthNeeded]
	}
	return
}

func (stack *IDMProtocolStack) ReadIDMv1PDU(startIndex uint32, pdu *IDM_PDU) (bytesRead uint32, err error) {
	var frames = make([]IDMFrame, 0)
	index := startIndex
	for err == nil {
		frame := IDMFrame{}
		bytesRead, err := stack.ReadIDMv1Frame(index, &frame)
		if err != nil {
			break
		}
		index += bytesRead
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
				err = errors.New("Extra data hidden at the end of an IDM frame")
				break
			}
			return (index - startIndex), nil
		} else {
			// TODO: Check maximum frames
			frames = append(frames, frame)
		}
	}
	return
}

func (stack *IDMProtocolStack) HandleBindPDU(pdu IdmBind) {

}

func (stack *IDMProtocolStack) HandleBindResultPDU(pdu IdmBindResult) {
	stack.bound <- true
}

func (stack *IDMProtocolStack) HandleBindErrorPDU(pdu IdmBindError) {

}

func (stack *IDMProtocolStack) HandleRequestPDU(pdu Request) {

}

func (stack *IDMProtocolStack) HandleResultPDU(pdu IdmResult) {
	op := stack.PendingOperations[pdu.InvokeID]
	if op == nil {
		fmt.Printf("Unexpected result with invocation %d\n", pdu.InvokeID)
		// TODO: Handle unexpected result
		return
	}
	iidBytes, err := asn1.Marshal(pdu.InvokeID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	res := X500OperationOutcome{
		OutcomeType: OPERATION_OUTCOME_TYPE_RESULT,
		InvokeId: asn1.RawValue{
			FullBytes: iidBytes,
		},
		OpCode:    pdu.Opcode,
		Parameter: pdu.Result,
	}
	op.Res = res
	op.Done <- true
}

func (stack *IDMProtocolStack) HandleErrorPDU(pdu IdmError) {
	fmt.Println("ERROR")
}

func (stack *IDMProtocolStack) HandleRejectPDU(pdu IdmReject) {
	fmt.Println("REJECT")
}

func (stack *IDMProtocolStack) HandleUnbindPDU(pdu Unbind) {
	fmt.Println("UNBIND")
}

func (stack *IDMProtocolStack) HandleAbortPDU(pdu Abort) {
	fmt.Println("ABORT")
}

func (stack *IDMProtocolStack) HandleStartTLSPDU(pdu StartTLS) {

}

func (stack *IDMProtocolStack) HandleTLSResponsePDU(pdu TLSResponse) {

}

// IDM-PDU{IDM-PROTOCOL:protocol} ::= CHOICE {
// 	bind         [0]  IdmBind{{protocol}},
// 	bindResult   [1]  IdmBindResult{{protocol}},
// 	bindError    [2]  IdmBindError{{protocol}},
// 	request      [3]  Request{{protocol.&Operations}},
// 	result       [4]  IdmResult{{protocol.&Operations}},
// 	error        [5]  Error{{protocol.&Operations}},
// 	reject       [6]  IdmReject,
// 	unbind       [7]  Unbind,
// 	abort        [8]  Abort,
// 	startTLS     [9]  StartTLS,
// 	tLSResponse  [10] TLSResponse,
// 	... }
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

func (stack *IDMProtocolStack) ProcessNextPDU(startIndex uint32) (bytesRead uint32, err error) {
	pdu := IDM_PDU{}
	bytesRead, err = stack.ReadIDMv1PDU(startIndex, &pdu)
	if err != nil {
		return
	}
	if bytesRead == 0 {
		return
	}
	go stack.HandlePDU(pdu)
	return
}

func (stack *IDMProtocolStack) ProcessReceivedPDUs() (bytesRead uint32, err error) {
	var index uint32 = 0
	for err == nil {
		pduLength, err := stack.ProcessNextPDU(index)
		index += pduLength
		if err != nil {
			break
		}
	}
	if index > 0 {
		stack.ReceivedData = stack.ReceivedData[index:]
	}
	return index, err
}

func (stack *IDMProtocolStack) BindAnonymously() (err error) {
	bind_arg := DirectoryBindArgument{}
	bind_arg_bytes, err := asn1.MarshalWithParams(bind_arg, "set")
	if err != nil {
		return
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
		ProtocolID: Id_idm_dap,
		Argument:   bind_arg_el,
	}
	bind_bytes, err := asn1.Marshal(bind)
	if err != nil {
		return
	}
	op_element := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        0,
		IsCompound: true,
		Bytes:      bind_bytes,
	}
	idm_payload, err := asn1.Marshal(op_element)
	if err != nil {
		return
	}
	frame := GetIdmFrame(idm_payload)
	stack.socket.Write(frame)
	stack.socket.Write(idm_payload)
	<-stack.bound
	return
}

func (stack *IDMProtocolStack) Request(req X500Request) (response X500OperationOutcome, err error) {
	var invokeId int = 0
	rest, err := asn1.Unmarshal(req.InvokeId.FullBytes, &invokeId)
	if err != nil {
		return
	}
	if len(rest) > 0 {
		return
	}
	idmRequest := Request{
		InvokeID: invokeId,
		Opcode:   req.OpCode,
		Argument: req.Argument,
	}
	reqBytes, err := asn1.Marshal(idmRequest)
	if err != nil {
		return
	}
	idmPDU := asn1.RawValue{
		Tag:        3,
		Class:      asn1.ClassContextSpecific,
		IsCompound: true,
		Bytes:      reqBytes,
	}
	pduBytes, err := asn1.Marshal(idmPDU)
	if err != nil {
		return
	}
	op := X500Operation{
		Req:   req,
		Done:  make(chan bool),
		Error: nil,
	}
	stack.PendingOperations[invokeId] = &op
	frame := GetIdmFrame(pduBytes)
	_, err = stack.socket.Write(frame)
	if err != nil {
		return
	}
	_, err = stack.socket.Write(pduBytes)
	if err != nil {
		return
	}
	select {
	case <-op.Done:
	case <-time.After(15 * time.Second):
		err = errors.New("request timeout")
	}
	if err != nil {
		return
	}
	return op.Res, nil
}
