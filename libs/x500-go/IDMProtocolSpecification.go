package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION IDM_PDU */
// ### ASN.1 Definition:
//
// ```asn1
// IDM-PDU{IDM-PROTOCOL:protocol}  ::=  CHOICE {
//   bind         [0]  IdmBind{{protocol}},
//   bindResult   [1]  IdmBindResult{{protocol}},
//   bindError    [2]  IdmBindError{{protocol}},
//   request      [3]  Request{{protocol.&Operations}},
//   result       [4]  IdmResult{{protocol.&Operations}},
//   error        [5]  Error{{protocol.&Operations}},
//   reject       [6]  IdmReject,
//   unbind       [7]  Unbind,
//   abort        [8]  Abort,
//   startTLS     [9]  StartTLS,
//   tLSResponse  [10] TLSResponse,
//   ... }
// ```
type IDM_PDU = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION IDM_PDU */ /* START_OF_SYMBOL_DEFINITION IdmBind */
// ### ASN.1 Definition:
//
// ```asn1
// IdmBind{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
//   protocolID           IDM-PROTOCOL.&id({Protocols}),
//   callingAETitle  [0]  GeneralName OPTIONAL,
//   calledAETitle   [1]  GeneralName OPTIONAL,
//   argument        [2]  IDM-PROTOCOL.&bind-operation.&ArgumentType
//                          ({Protocols}{@protocolID}),
//   ... }
// ```
//
//
type IdmBind struct {
	ProtocolID     asn1.ObjectIdentifier
	CallingAETitle GeneralName   `asn1:"optional,explicit,tag:0"`
	CalledAETitle  GeneralName   `asn1:"optional,explicit,tag:1"`
	Argument       asn1.RawValue `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION IdmBind */ /* START_OF_SYMBOL_DEFINITION IdmBindResult */
// ### ASN.1 Definition:
//
// ```asn1
// IdmBindResult{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
//   protocolID              IDM-PROTOCOL.&id({Protocols}),
//   respondingAETitle  [0]  GeneralName OPTIONAL,
//   result             [1]  IDM-PROTOCOL.&bind-operation.&ResultType
//                             ({Protocols}{@protocolID}),
//   ... }
// ```
//
//
type IdmBindResult struct {
	ProtocolID        asn1.ObjectIdentifier
	RespondingAETitle GeneralName   `asn1:"optional,explicit,tag:0"`
	Result            asn1.RawValue `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION IdmBindResult */ /* START_OF_SYMBOL_DEFINITION IdmBindError */
// ### ASN.1 Definition:
//
// ```asn1
// IdmBindError{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
//   protocolID              IDM-PROTOCOL.&id({Protocols}),
// --errcode                 IDM-PROTOCOL.&bind-operation.&Errors.&errorCode OPTIONAL
//   respondingAETitle  [0]  GeneralName OPTIONAL,
//   aETitleError            ENUMERATED {
//     callingAETitleNotAccepted  (0),
//     calledAETitleNotRecognized (1),
//     ...} OPTIONAL,
//   error              [1]  IDM-PROTOCOL.&bind-operation.&Errors.&ParameterType
//                             ({Protocols}{@protocolID}),
//   ... }
// ```
//
//
type IdmBindError struct {
	ProtocolID        asn1.ObjectIdentifier
	RespondingAETitle GeneralName               `asn1:"optional,explicit,tag:0"`
	AETitleError      IdmBindError_aETitleError `asn1:"optional"`
	Error             asn1.RawValue             `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION IdmBindError */ /* START_OF_SYMBOL_DEFINITION Request */
// ### ASN.1 Definition:
//
// ```asn1
// Request{OPERATION:Operations} ::= SEQUENCE {
//   invokeID  INTEGER,
//   opcode    OPERATION.&operationCode({Operations}),
//   argument  OPERATION.&ArgumentType({Operations}{@opcode}),
//   ... }
// ```
//
//
type Request struct {
	InvokeID int
	Opcode   Code
	Argument asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION Request */ /* START_OF_SYMBOL_DEFINITION IdmResult */
// ### ASN.1 Definition:
//
// ```asn1
// IdmResult{OPERATION:Operations} ::= SEQUENCE {
//   invokeID  INTEGER,
//   opcode    OPERATION.&operationCode({Operations}),
//   result    OPERATION.&ResultType({Operations}{@opcode}),
//   ... }
// ```
//
//
type IdmResult struct {
	InvokeID int
	Opcode   Code
	Result   asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION IdmResult */ /* START_OF_SYMBOL_DEFINITION Error */
// ### ASN.1 Definition:
//
// ```asn1
// Error{OPERATION:Operations} ::= SEQUENCE {
//   invokeID  INTEGER,
//   errcode   OPERATION.&Errors.&errorCode({Operations}),
//   error     OPERATION.&Errors.&ParameterType({Operations}{@errcode}),
//   ... }
// ```
//
//
type IdmError struct {
	InvokeID int
	Errcode  asn1.RawValue
	Error    asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION Error */ /* START_OF_SYMBOL_DEFINITION IdmReject */
// ### ASN.1 Definition:
//
// ```asn1
// IdmReject ::= SEQUENCE {
//   invokeID  INTEGER,
//   reason    ENUMERATED {
//     mistypedPDU                 (0),
//     duplicateInvokeIDRequest    (1),
//     unsupportedOperationRequest (2),
//     unknownOperationRequest     (3),
//     mistypedArgumentRequest     (4),
//     resourceLimitationRequest   (5),
//     unknownInvokeIDResult       (6),
//     mistypedResultRequest       (7),
//     unknownInvokeIDError        (8),
//     unknownError                (9),
//     mistypedParameterError      (10),
//     unsupportedIdmVersion       (11),
//     unsuitableIdmVersion        (12),
//     invalidIdmVersion           (13),
//     ...},
//   ... }
// ```
//
//
type IdmReject struct {
	InvokeID int
	Reason   IdmReject_reason
}

/* END_OF_SYMBOL_DEFINITION IdmReject */ /* START_OF_SYMBOL_DEFINITION Unbind */
// ### ASN.1 Definition:
//
// ```asn1
// Unbind  ::=  NULL
// ```
type Unbind = asn1.RawValue // NullType
/* END_OF_SYMBOL_DEFINITION Unbind */ /* START_OF_SYMBOL_DEFINITION Abort */
// ### ASN.1 Definition:
//
// ```asn1
// Abort  ::=  ENUMERATED {
//   mistypedPDU         (0),
//   unboundRequest      (1),
//   invalidPDU          (2),
//   resourceLimitation  (3),
//   connectionFailed    (4),
//   invalidProtocol     (5),
//   reasonNotSpecified  (6),
//   ...}
// ```
type Abort = asn1.Enumerated

const (
	Abort_MistypedPDU        Abort = 0 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_UnboundRequest     Abort = 1 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_InvalidPDU         Abort = 2 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_ResourceLimitation Abort = 3 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_ConnectionFailed   Abort = 4 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_InvalidProtocol    Abort = 5 // LONG_NAMED_ENUMERATED_VALUE,
	Abort_ReasonNotSpecified Abort = 6 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION Abort */ /* START_OF_SYMBOL_DEFINITION StartTLS */
// ### ASN.1 Definition:
//
// ```asn1
// StartTLS  ::=  NULL
// ```
type StartTLS = asn1.RawValue // NullType
/* END_OF_SYMBOL_DEFINITION StartTLS */ /* START_OF_SYMBOL_DEFINITION TLSResponse */
// ### ASN.1 Definition:
//
// ```asn1
// TLSResponse  ::=  ENUMERATED {
//   success         (0),
//   operationsError (1),
//   protocolError   (2),
//   unavailable     (3),
//   ...}
// ```
type TLSResponse = asn1.Enumerated

const (
	TLSResponse_Success         TLSResponse = 0 // LONG_NAMED_ENUMERATED_VALUE,
	TLSResponse_OperationsError TLSResponse = 1 // LONG_NAMED_ENUMERATED_VALUE,
	TLSResponse_ProtocolError   TLSResponse = 2 // LONG_NAMED_ENUMERATED_VALUE,
	TLSResponse_Unavailable     TLSResponse = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION TLSResponse */ /* START_OF_SYMBOL_DEFINITION IdmBindError_aETitleError */
// ### ASN.1 Definition:
//
// ```asn1
// IdmBindError-aETitleError ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type IdmBindError_aETitleError = asn1.Enumerated

const (
	IdmBindError_aETitleError_CallingAETitleNotAccepted  IdmBindError_aETitleError = 0 // LONG_NAMED_ENUMERATED_VALUE,
	IdmBindError_aETitleError_CalledAETitleNotRecognized IdmBindError_aETitleError = 1 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION IdmBindError_aETitleError */ /* START_OF_SYMBOL_DEFINITION IdmReject_reason */
// ### ASN.1 Definition:
//
// ```asn1
// IdmReject-reason ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type IdmReject_reason = asn1.Enumerated

const (
	IdmReject_reason_MistypedPDU                 IdmReject_reason = 0  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_DuplicateInvokeIDRequest    IdmReject_reason = 1  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnsupportedOperationRequest IdmReject_reason = 2  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnknownOperationRequest     IdmReject_reason = 3  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_MistypedArgumentRequest     IdmReject_reason = 4  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_ResourceLimitationRequest   IdmReject_reason = 5  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnknownInvokeIDResult       IdmReject_reason = 6  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_MistypedResultRequest       IdmReject_reason = 7  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnknownInvokeIDError        IdmReject_reason = 8  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnknownError                IdmReject_reason = 9  // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_MistypedParameterError      IdmReject_reason = 10 // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnsupportedIdmVersion       IdmReject_reason = 11 // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_UnsuitableIdmVersion        IdmReject_reason = 12 // LONG_NAMED_ENUMERATED_VALUE,
	IdmReject_reason_InvalidIdmVersion           IdmReject_reason = 13 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION IdmReject_reason */
