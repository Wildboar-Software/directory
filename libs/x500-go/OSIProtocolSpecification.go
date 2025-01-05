package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	OSI-PDU{APPLICATION-CONTEXT:protocol} ::= TYPE-IDENTIFIER.&Type (
//		OsiBind{{protocol}} |
//		OsiBindResult{{protocol}} |
//		OsiBindError{{protocol}} |
//		OsiOperation{{protocol.&Operations}} |
//		OsiUnbind |
//		PresentationAbort )
type OSI_PDU = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBind{APPLICATION-CONTEXT:Protocols} ::= SET {
//	  mode-selector                  [0]  IMPLICIT SET {
//	    mode-value                     [0]  IMPLICIT INTEGER(1)},
//	  normal-mode-parameters         [2]  IMPLICIT SEQUENCE {
//	    protocol-version               [0]  IMPLICIT BIT STRING {version-1(0)}
//	                                          DEFAULT {version-1},
//	    calling-presentation-selector  [1]  IMPLICIT Presentation-selector OPTIONAL,
//	    called-presentation-selector   [2]  IMPLICIT Presentation-selector OPTIONAL,
//	    presentation-context-definition-list
//	                                   [4]  IMPLICIT Context-list,
//	    user-data                           CHOICE {
//	      fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
//	        transfer-syntax-name              Transfer-syntax-name OPTIONAL,
//	        presentation-context-identifier   Presentation-context-identifier,
//	        presentation-data-values          CHOICE {
//	          single-ASN1-type             [0]  ABSTRACT-SYNTAX.&Type
//	                                             (AARQ-apdu{{Protocols}})}}}}}
type OsiBind struct {
	Mode_selector          OsiBind_mode_selector          `asn1:"tag:0,set"`
	Normal_mode_parameters OsiBind_normal_mode_parameters `asn1:"tag:2"`
}

// # ASN.1 Definition:
//
//	Presentation-selector ::= OCTET STRING(SIZE (1..4, ..., 5..MAX))
type Presentation_selector = []byte

// # ASN.1 Definition:
//
//	Context-list ::= SEQUENCE SIZE (2) OF SEQUENCE {
//	  presentation-context-identifier  Presentation-context-identifier,
//	  abstract-syntax-name             Abstract-syntax-name,
//	  transfer-syntax-name-list        SEQUENCE OF Transfer-syntax-name }
type Context_list = [](Context_list_Item)

// # ASN.1 Definition:
//
//	Presentation-context-identifier ::= INTEGER(1..127, ..., 128..MAX)
type Presentation_context_identifier = int64

// # ASN.1 Definition:
//
//	Abstract-syntax-name ::= OBJECT IDENTIFIER
type Abstract_syntax_name = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	Transfer-syntax-name ::= OBJECT IDENTIFIER
type Transfer_syntax_name = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	AARQ-apdu{APPLICATION-CONTEXT:Protocols} ::= [APPLICATION 0] IMPLICIT SEQUENCE {
//	  protocol-version                  [0] IMPLICIT BIT STRING {version1(0)}
//	                                             DEFAULT {version1},
//	  application-context-name          [1]  Application-context-name,
//	  called-AP-title                   [2]  Name OPTIONAL,
//	  called-AE-qualifier               [3]  RelativeDistinguishedName    OPTIONAL,
//	  called-AP-invocation-identifier   [4]  AP-invocation-identifier     OPTIONAL,
//	  called-AE-invocation-identifier   [5]  AE-invocation-identifier     OPTIONAL,
//	  calling-AP-title                  [6]  Name                         OPTIONAL,
//	  calling-AE-qualifier              [7]  RelativeDistinguishedName    OPTIONAL,
//	  calling-AP-invocation-identifier  [8]  AP-invocation-identifier     OPTIONAL,
//	  calling-AE-invocation-identifier  [9]  AE-invocation-identifier     OPTIONAL,
//	  implementation-information        [29] IMPLICIT Implementation-data OPTIONAL,
//	  user-information                  [30] IMPLICIT
//	                                           Association-informationBind{{Protocols}}}
type AARQ_apdu struct {
	Protocol_version                 AARQ_apdu_protocol_version  `asn1:"optional,tag:0"`
	Application_context_name         Application_context_name    `asn1:"explicit,tag:1"`
	Called_AP_title                  Name                        `asn1:"optional,explicit,tag:2"`
	Called_AE_qualifier              RelativeDistinguishedName   `asn1:"optional,explicit,tag:3"`
	Called_AP_invocation_identifier  AP_invocation_identifier    `asn1:"optional,explicit,tag:4"`
	Called_AE_invocation_identifier  AE_invocation_identifier    `asn1:"optional,explicit,tag:5"`
	Calling_AP_title                 Name                        `asn1:"optional,explicit,tag:6"`
	Calling_AE_qualifier             RelativeDistinguishedName   `asn1:"optional,explicit,tag:7"`
	Calling_AP_invocation_identifier AP_invocation_identifier    `asn1:"optional,explicit,tag:8"`
	Calling_AE_invocation_identifier AE_invocation_identifier    `asn1:"optional,explicit,tag:9"`
	Implementation_information       Implementation_data         `asn1:"optional,tag:29"`
	User_information                 Association_informationBind `asn1:"tag:30"`
}

// # ASN.1 Definition:
//
//	  Association-informationBind{APPLICATION-CONTEXT:Protocols} ::= SEQUENCE SIZE (1..MAX) OF
//		  EXTERNAL
//		    (WITH COMPONENTS {
//		       identification         (WITH COMPONENTS {..., syntax ABSENT}),
//		       data-value-descriptor  ABSENT,
//		       data-value             (CONTAINING TheOsiBind{{Protocols}})})
type Association_informationBind = [](asn1.RawValue)

// # ASN.1 Definition:
//
//	Application-context-name ::= OBJECT IDENTIFIER
type Application_context_name = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	AP-invocation-identifier ::= INTEGER
type AP_invocation_identifier = int64

// # ASN.1 Definition:
//
//	AE-invocation-identifier ::= INTEGER
type AE_invocation_identifier = int64

// # ASN.1 Definition:
//
//	Implementation-data ::= GraphicString
type Implementation_data = string // GraphicString
// # ASN.1 Definition:
//
//	TheOsiBind{APPLICATION-CONTEXT:Protocols} ::= [16] APPLICATION-CONTEXT.&bind-operation.&ArgumentType({Protocols})
type TheOsiBind = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindResult{APPLICATION-CONTEXT:Protocols} ::= SET {
//	  mode-selector                    [0] IMPLICIT SET {mode-value  [0] IMPLICIT INTEGER(1)},
//	  normal-mode-parameters           [2] IMPLICIT SEQUENCE {
//	    protocol-version                 [0] IMPLICIT BIT STRING {version-1(0)}
//	                                           DEFAULT {version-1},
//	    responding-presentation-selector [3] IMPLICIT Presentation-selector OPTIONAL,
//	    presentation-context-definition-result-list
//	                                     [5] IMPLICIT SEQUENCE SIZE (2) OF SEQUENCE {
//	      result                           [0] IMPLICIT Result(acceptance),
//	      transfer-syntax-name             [1] IMPLICIT Transfer-syntax-name },
//	    user-data                            CHOICE {
//	      fully-encoded-data [APPLICATION 1] IMPLICIT SEQUENCE SIZE(1) OF SEQUENCE {
//	        transfer-syntax-name               Transfer-syntax-name OPTIONAL,
//	        presentation-context-identifier    Presentation-context-identifier,
//	        presentation-data-values           CHOICE {
//	          single-ASN1-type              [0]  ABSTRACT-SYNTAX.&Type(AARE-apdu{{Protocols}}
//	  )}}}}}
type OsiBindResult struct {
	Mode_selector          OsiBindResult_mode_selector          `asn1:"tag:0,set"`
	Normal_mode_parameters OsiBindResult_normal_mode_parameters `asn1:"tag:2"`
}

// # ASN.1 Definition:
//
//	Result ::= INTEGER {
//	  acceptance         (0),
//	  user-rejection     (1),
//	  provider-rejection (2)}
type Result = int64

const Result_Acceptance Result = 0

const Result_User_rejection Result = 1

const Result_Provider_rejection Result = 2

// # ASN.1 Definition:
//
//	AARE-apdu{APPLICATION-CONTEXT:Protocols} ::= [APPLICATION 1] IMPLICIT SEQUENCE {
//	  protocol-version                     [0] IMPLICIT BIT STRING {version1(0)}
//	                                             DEFAULT {version1},
//	  application-context-name             [1]  Application-context-name,
//	  result                               [2]  Associate-result(accepted),
//	  result-source-diagnostic             [3]  Associate-source-diagnostic,
//	  responding-AP-title                  [4]  Name                          OPTIONAL,
//	  responding-AE-qualifier              [5]  RelativeDistinguishedName     OPTIONAL,
//	  responding-AP-invocation-identifier  [6]  AP-invocation-identifier      OPTIONAL,
//	  responding-AE-invocation-identifier  [7]  AE-invocation-identifier      OPTIONAL,
//	  implementation-information           [29] IMPLICIT Implementation-data  OPTIONAL,
//	  user-information                     [30] IMPLICIT
//	                                        Association-informationBindRes{{Protocols}}}
type AARE_apdu struct {
	Protocol_version                    AARE_apdu_protocol_version     `asn1:"optional,tag:0"`
	Application_context_name            Application_context_name       `asn1:"explicit,tag:1"`
	Result                              Associate_result               `asn1:"explicit,tag:2"`
	Result_source_diagnostic            Associate_source_diagnostic    `asn1:"explicit,tag:3"`
	Responding_AP_title                 Name                           `asn1:"optional,explicit,tag:4"`
	Responding_AE_qualifier             RelativeDistinguishedName      `asn1:"optional,explicit,tag:5"`
	Responding_AP_invocation_identifier AP_invocation_identifier       `asn1:"optional,explicit,tag:6"`
	Responding_AE_invocation_identifier AE_invocation_identifier       `asn1:"optional,explicit,tag:7"`
	Implementation_information          Implementation_data            `asn1:"optional,tag:29"`
	User_information                    Association_informationBindRes `asn1:"tag:30"`
}

// # ASN.1 Definition:
//
// Association-informationBindRes{APPLICATION-CONTEXT:Protocols}  ::=
//
//	SEQUENCE SIZE (1) OF
//	  EXTERNAL (
//	    WITH COMPONENTS {
//	      identification         (WITH COMPONENTS {..., syntax ABSENT}),
//	      data-value-descriptor  ABSENT,
//	      data-value             (CONTAINING TheOsiBindRes{{Protocols}})})
type Association_informationBindRes = [](asn1.RawValue)

// # ASN.1 Definition:
//
//	Associate-result ::= INTEGER {
//	  accepted           (0),
//	  rejected-permanent (1),
//	  rejected-transient (2)}(0..2, ...)
type Associate_result = int64

const Associate_result_Accepted Associate_result = 0

const Associate_result_Rejected_permanent Associate_result = 1

const Associate_result_Rejected_transient Associate_result = 2

// # ASN.1 Definition:
//
//	Associate-source-diagnostic ::= CHOICE {
//	  acse-service-user     [1]  INTEGER {
//	    null                                            (0),
//	    no-reason-given                                 (1),
//	    application-context-name-not-supported          (2),
//	    calling-AP-title-not-recognized                 (3),
//	    calling-AP-invocation-identifier-not-recognized (4),
//	    calling-AE-qualifier-not-recognized             (5),
//	    calling-AE-invocation-identifier-not-recognized (6),
//	    called-AP-title-not-recognized                  (7),
//	    called-AP-invocation-identifier-not-recognized  (8),
//	    called-AE-qualifier-not-recognized              (9),
//	    called-AE-invocation-identifier-not-recognized  (10)}(0..10, ...),
//	  acse-service-provider [2]  INTEGER {
//	    null                                            (0),
//	    no-reason-given                                 (1),
//	    no-common-acse-version                          (2)}(0..2, ...)}
type Associate_source_diagnostic = asn1.RawValue

// # ASN.1 Definition:
//
//	TheOsiBindRes{APPLICATION-CONTEXT:Protocols} ::= [17] APPLICATION-CONTEXT.&bind-operation.&ResultType({Protocols})
type TheOsiBindRes = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindError{APPLICATION-CONTEXT:Protocols} ::= CHOICE {
//	  normal-mode-parameters  SEQUENCE {
//	    protocol-version               [0]  IMPLICIT BIT STRING {version-1(0)}
//	                                          DEFAULT {version-1},
//	    responding-presentation-selector
//	                                   [3]  IMPLICIT Presentation-selector OPTIONAL,
//	    presentation-context-definition-result-list
//	                                   [5]  IMPLICIT Result-list OPTIONAL,
//	    provider-reason                [10] IMPLICIT Provider-reason OPTIONAL,
//	    user-data                           CHOICE {
//	      fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
//	        transfer-syntax-name                Transfer-syntax-name   OPTIONAL,
//	        presentation-context-identifier     Presentation-context-identifier,
//	        presentation-data-values            CHOICE {
//	          single-ASN1-type               [0]
//	                     ABSTRACT-SYNTAX.&Type(AAREerr-apdu{{Protocols}})}}} OPTIONAL}}
type OsiBindError = asn1.RawValue

// # ASN.1 Definition:
//
//	Result-list ::= SEQUENCE SIZE (2) OF SEQUENCE {
//		  result                [0] IMPLICIT Result,
//		  transfer-syntax-name  [1] IMPLICIT Transfer-syntax-name   OPTIONAL,
//		  provider-reason       [2] IMPLICIT INTEGER {
//		    reason-not-specified                     (0),
//		    abstract-syntax-not-supported            (1),
//		    proposed-transfer-syntaxes-not-supported (2)} OPTIONAL}
type Result_list = [](Result_list_Item)

// # ASN.1 Definition:
//
//	Provider-reason ::= INTEGER {
//	  reason-not-specified                (0),
//	  temporary-congestion                (1),
//	  local-limit-exceeded                (2),
//	  called-presentation-address-unknown (3),
//	  protocol-version-not-supported      (4),
//	  default-context-not-supported       (5),
//	  user-data-not-readable              (6),
//	  no-PSAP-available                   (7)}
type Provider_reason = int64

const Provider_reason_Reason_not_specified Provider_reason = 0

const Provider_reason_Temporary_congestion Provider_reason = 1

const Provider_reason_Local_limit_exceeded Provider_reason = 2

const Provider_reason_Called_presentation_address_unknown Provider_reason = 3

const Provider_reason_Protocol_version_not_supported Provider_reason = 4

const Provider_reason_Default_context_not_supported Provider_reason = 5

const Provider_reason_User_data_not_readable Provider_reason = 6

const Provider_reason_No_PSAP_available Provider_reason = 7

// # ASN.1 Definition:
//
//	AAREerr-apdu{APPLICATION-CONTEXT:Protocols} ::= [APPLICATION 1] IMPLICIT SEQUENCE {
//	  protocol-version                    [0]  IMPLICIT BIT STRING {version1(0)}
//	                                             DEFAULT {version1},
//	  application-context-name            [1]  Application-context-name,
//	  result                              [2]  Associate-result
//	                                             (rejected-permanent..rejected-transient),
//	  result-source-diagnostic            [3]  Associate-source-diagnostic,
//	  responding-AP-title                 [4]  Name OPTIONAL,
//	  responding-AE-qualifier             [5]  RelativeDistinguishedName OPTIONAL,
//	  responding-AP-invocation-identifier [6]  AP-invocation-identifier  OPTIONAL,
//	  responding-AE-invocation-identifier [7]  AE-invocation-identifier  OPTIONAL,
//	  implementation-information          [29] IMPLICIT Implementation-data OPTIONAL,
//	  user-information                    [30] IMPLICIT
//	                                Association-informationBindErr{{Protocols}} OPTIONAL }
type AAREerr_apdu struct {
	Protocol_version                    AAREerr_apdu_protocol_version  `asn1:"optional,tag:0"`
	Application_context_name            Application_context_name       `asn1:"explicit,tag:1"`
	Result                              Associate_result               `asn1:"explicit,tag:2"`
	Result_source_diagnostic            Associate_source_diagnostic    `asn1:"explicit,tag:3"`
	Responding_AP_title                 Name                           `asn1:"optional,explicit,tag:4"`
	Responding_AE_qualifier             RelativeDistinguishedName      `asn1:"optional,explicit,tag:5"`
	Responding_AP_invocation_identifier AP_invocation_identifier       `asn1:"optional,explicit,tag:6"`
	Responding_AE_invocation_identifier AE_invocation_identifier       `asn1:"optional,explicit,tag:7"`
	Implementation_information          Implementation_data            `asn1:"optional,tag:29"`
	User_information                    Association_informationBindErr `asn1:"optional,tag:30"`
}

// # ASN.1 Definition:
//
//	  Association-informationBindErr{APPLICATION-CONTEXT:Protocols} ::= SEQUENCE SIZE (1) OF
//		EXTERNAL (
//		  WITH COMPONENTS {
//		    identification         (WITH COMPONENTS {..., syntax ABSENT}),
//		    data-value-descriptor  ABSENT,
//		    data-value             (CONTAINING TheOsiBindErr{{Protocols}})})
type Association_informationBindErr = [](asn1.RawValue)

// # ASN.1 Definition:
//
//	TheOsiBindErr{APPLICATION-CONTEXT:Protocols} ::= [18] APPLICATION-CONTEXT.&bind-operation.&Errors.&ParameterType ({Protocols})
type TheOsiBindErr = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiUnbind ::= CHOICE {
//	  fully-encoded-data
//	    [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
//	       presentation-context-identifier  Presentation-context-identifier,
//	       presentation-data-values     CHOICE {
//	         single-ASN1-type        [0]  ABSTRACT-SYNTAX.&Type(TheOsiUnbind)}}}
type OsiUnbind = asn1.RawValue

// # ASN.1 Definition:
//
//	TheOsiUnbind ::= [APPLICATION 2] IMPLICIT SEQUENCE {
//	  reason  [0] IMPLICIT Release-request-reason OPTIONAL}
type TheOsiUnbind struct {
	Reason Release_request_reason `asn1:"optional,tag:0"`
}

// # ASN.1 Definition:
//
//	Release-request-reason ::= INTEGER {normal(0)}
type Release_request_reason = int64

const Release_request_reason_Normal Release_request_reason = 0

// # ASN.1 Definition:
//
//	OsiUnbindResult ::= CHOICE {
//	  fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
//	    presentation-context-identifier     Presentation-context-identifier,
//	    presentation-data-values            CHOICE {
//	      single-ASN1-type               [0]  ABSTRACT-SYNTAX.&Type(TheOsiUnbindRes)}}}
type OsiUnbindResult = asn1.RawValue

// # ASN.1 Definition:
//
//	TheOsiUnbindRes ::= [APPLICATION 3] IMPLICIT SEQUENCE {
//	  reason  [0] IMPLICIT Release-response-reason OPTIONAL }
type TheOsiUnbindRes struct {
	Reason Release_response_reason `asn1:"optional,tag:0"`
}

// # ASN.1 Definition:
//
//	Release-response-reason ::= INTEGER {normal(0)}
type Release_response_reason = int64

const Release_response_reason_Normal Release_response_reason = 0

// # ASN.1 Definition:
//
//	OsiOperation{OPERATION:Operations} ::= CHOICE {
//	  fully-encoded-data [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
//	    presentation-context-identifier    Presentation-context-identifier,
//	    presentation-data-values           CHOICE {
//	      single-ASN1-type              [0]
//	                     ABSTRACT-SYNTAX.&Type(OsiDirectoryOperation {{Operations}})}}}
type OsiOperation = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiDirectoryOperation{OPERATION:Operations} ::= CHOICE {
//	  request  OsiReq{{Operations}},
//	  result   OsiRes{{Operations}},
//	  error    OsiErr{{Operations}},
//	  reject   OsiRej}
type OsiDirectoryOperation = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiReq{OPERATION:Operations} ::= [1] IMPLICIT SEQUENCE {
//	  invokeId  InvokeId,
//	  opcode    OPERATION.&operationCode({Operations}),
//	  argument  OPERATION.&ArgumentType({Operations}{@opcode}) }
type OsiReq struct {
	InvokeId InvokeId
	Opcode   Code
	Argument asn1.RawValue
}

// # ASN.1 Definition:
//
//	OsiRes{OPERATION:Operations} ::= [2] IMPLICIT SEQUENCE {
//	  invokeId  InvokeId,
//	  result    SEQUENCE {
//	    opcode    OPERATION.&operationCode({Operations}),
//	    result    OPERATION.&ResultType({Operations}{@.opcode}) }}
type OsiRes struct {
	InvokeId InvokeId
	Result   OsiRes_result
}

// # ASN.1 Definition:
//
//	OsiErr{OPERATION:Operations} ::= [3] IMPLICIT SEQUENCE {
//	  invokeID  InvokeId,
//	  errcode   OPERATION.&Errors.&errorCode({Operations}),
//	  error     OPERATION.&Errors.&ParameterType({Operations}{@.errcode}) }
type OsiErr struct {
	InvokeID InvokeId
	Errcode  asn1.RawValue
	Error    asn1.RawValue
}

// # ASN.1 Definition:
//
//	OsiRej ::= [4] IMPLICIT SEQUENCE {
//	  invokeId          InvokeId,
//	  problem           CHOICE {
//	    general      [0]  IMPLICIT GeneralProblem,
//	    invoke       [1]  IMPLICIT InvokeProblem,
//	    returnResult [2]  IMPLICIT ReturnResultProblem,
//	    returnError  [3]  IMPLICIT ReturnErrorProblem,
//	    ... },
//	  ... }
type OsiRej struct {
	InvokeId InvokeId
	Problem  OsiRej_problem
}

// # ASN.1 Definition:
//
//	GeneralProblem ::= INTEGER {
//	  unrecognizedPDU          (0),
//	  mistypedPDU              (1),
//	  badlyStructuredPDU       (2) }
type GeneralProblem = int64

const GeneralProblem_UnrecognizedPDU GeneralProblem = 0

const GeneralProblem_MistypedPDU GeneralProblem = 1

const GeneralProblem_BadlyStructuredPDU GeneralProblem = 2

// # ASN.1 Definition:
//
//	InvokeProblem ::= INTEGER {
//	  duplicateInvocation      (0),
//	  unrecognizedOperation    (1),
//	  mistypedArgument         (2),
//	  resourceLimitation       (3),
//	  releaseInProgress        (4)}
type InvokeProblem = int64

const InvokeProblem_DuplicateInvocation InvokeProblem = 0

const InvokeProblem_UnrecognizedOperation InvokeProblem = 1

const InvokeProblem_MistypedArgument InvokeProblem = 2

const InvokeProblem_ResourceLimitation InvokeProblem = 3

const InvokeProblem_ReleaseInProgress InvokeProblem = 4

// # ASN.1 Definition:
//
//	ReturnResultProblem ::= INTEGER {
//	  unrecognizedInvocation   (0),
//	  resultResponseUnexpected (1),
//	  mistypedResult           (2)}
type ReturnResultProblem = int64

const ReturnResultProblem_UnrecognizedInvocation ReturnResultProblem = 0

const ReturnResultProblem_ResultResponseUnexpected ReturnResultProblem = 1

const ReturnResultProblem_MistypedResult ReturnResultProblem = 2

// # ASN.1 Definition:
//
//	ReturnErrorProblem ::= INTEGER {
//	  unrecognizedInvocation   (0),
//	  errorResponseUnexpected  (1),
//	  unrecognizedError        (2),
//	  unexpectedError          (3),
//	  mistypedParameter        (4)}
type ReturnErrorProblem = int64

const ReturnErrorProblem_UnrecognizedInvocation ReturnErrorProblem = 0

const ReturnErrorProblem_ErrorResponseUnexpected ReturnErrorProblem = 1

const ReturnErrorProblem_UnrecognizedError ReturnErrorProblem = 2

const ReturnErrorProblem_UnexpectedError ReturnErrorProblem = 3

const ReturnErrorProblem_MistypedParameter ReturnErrorProblem = 4

// # ASN.1 Definition:
//
//	PresentationAbort ::= CHOICE {
//	  aru-ppdu  ARU-PPDU,
//	  arp-ppdu  ARP-PPDU }
type PresentationAbort = asn1.RawValue

// # ASN.1 Definition:
//
//	ARU-PPDU ::= CHOICE {
//	  normal-mode-parameters     [0] IMPLICIT SEQUENCE {
//	    presentation-context-identifier-list
//	                                    [0] IMPLICIT Presentation-context-identifier-list,
//	    user-data                           CHOICE {
//	      fully-encoded-data [APPLICATION 1]  IMPLICIT SEQUENCE SIZE(1..MAX) OF SEQUENCE {
//	        presentation-context-identifier     Presentation-context-identifier,
//	        presentation-data-values            CHOICE {
//	          single-ASN1-type               [0]  ABSTRACT-SYNTAX.&Type(ABRT-apdu)}}}}}
type ARU_PPDU = asn1.RawValue

// # ASN.1 Definition:
//
//	Presentation-context-identifier-list ::= SEQUENCE SIZE (1) OF SEQUENCE {
//	  presentation-context-identifier  Presentation-context-identifier,
//	  transfer-syntax-name             Transfer-syntax-name}
type Presentation_context_identifier_list = [](Presentation_context_identifier_list_Item)

// # ASN.1 Definition:
//
//	ABRT-apdu ::= [APPLICATION 4] IMPLICIT SEQUENCE {
//	  abort-source  [0] IMPLICIT ABRT-source }
type ABRT_apdu struct {
	Abort_source ABRT_source `asn1:"tag:0"`
}

// # ASN.1 Definition:
//
//	ABRT-source ::= INTEGER {
//	  acse-service-user     (0),
//	  acse-service-provider (1) }
type ABRT_source = int64

const ABRT_source_Acse_service_user ABRT_source = 0

const ABRT_source_Acse_service_provider ABRT_source = 1

// # ASN.1 Definition:
//
//	ARP-PPDU ::= SEQUENCE {
//	  provider-reason   [0] IMPLICIT Abort-reason OPTIONAL,
//	  event-identifier  [1] IMPLICIT Event-identifier OPTIONAL }
type ARP_PPDU struct {
	Provider_reason  Abort_reason     `asn1:"optional,tag:0"`
	Event_identifier Event_identifier `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	Abort-reason ::= INTEGER {
//	  reason-not-specified                 (0),
//	  unrecognized-ppdu                    (1),
//	  unexpected-ppdu                      (2),
//	  unexpected-session-service-primitive (3),
//	  unrecognized-ppdu-parameter          (4),
//	  unexpected-ppdu-parameter            (5),
//	  invalid-ppdu-parameter-value         (6)}
type Abort_reason = int64

const Abort_reason_Reason_not_specified Abort_reason = 0

const Abort_reason_Unrecognized_ppdu Abort_reason = 1

const Abort_reason_Unexpected_ppdu Abort_reason = 2

const Abort_reason_Unexpected_session_service_primitive Abort_reason = 3

const Abort_reason_Unrecognized_ppdu_parameter Abort_reason = 4

const Abort_reason_Unexpected_ppdu_parameter Abort_reason = 5

const Abort_reason_Invalid_ppdu_parameter_value Abort_reason = 6

// # ASN.1 Definition:
//
//	Event-identifier ::= INTEGER {
//	  cp-PPDU              (0),
//	  cpa-PPDU             (1),
//	  cpr-PPDU             (2),
//	  aru-PPDU             (3),
//	  arp-PPDU             (4),
//	  td-PPDU              (7),
//	  s-release-indication (14),
//	  s-release-confirm    (15) }
type Event_identifier = int64

const Event_identifier_Cp_PPDU Event_identifier = 0

const Event_identifier_Cpa_PPDU Event_identifier = 1

const Event_identifier_Cpr_PPDU Event_identifier = 2

const Event_identifier_Aru_PPDU Event_identifier = 3

const Event_identifier_Arp_PPDU Event_identifier = 4

const Event_identifier_Td_PPDU Event_identifier = 7

const Event_identifier_S_release_indication Event_identifier = 14

const Event_identifier_S_release_confirm Event_identifier = 15

// # ASN.1 Definition:
//
//	OsiBind-mode-selector ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_mode_selector struct {
	Mode_value int `asn1:"tag:0"`
}

// # ASN.1 Definition:
//
//	OsiBind-normal-mode-parameters-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_normal_mode_parameters_protocol_version = asn1.BitString

const OsiBind_normal_mode_parameters_protocol_version_Version_1 int32 = 0

// # ASN.1 Definition:
//
//	OsiBind-normal-mode-parameters-user-data-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBind-normal-mode-parameters-user-data-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_normal_mode_parameters_user_data_fully_encoded_data_Item struct {
	Transfer_syntax_name            Transfer_syntax_name `asn1:"optional"`
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiBind_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiBind-normal-mode-parameters-user-data ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_normal_mode_parameters_user_data = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBind-normal-mode-parameters ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBind_normal_mode_parameters struct {
	Protocol_version                     OsiBind_normal_mode_parameters_protocol_version `asn1:"optional,tag:0"`
	Calling_presentation_selector        Presentation_selector                           `asn1:"optional,tag:1"`
	Called_presentation_selector         Presentation_selector                           `asn1:"optional,tag:2"`
	Presentation_context_definition_list Context_list                                    `asn1:"tag:4"`
	User_data                            OsiBind_normal_mode_parameters_user_data
}

// # ASN.1 Definition:
//
//	Context-list-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type Context_list_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Abstract_syntax_name            Abstract_syntax_name
	Transfer_syntax_name_list       [](Transfer_syntax_name)
}

// # ASN.1 Definition:
//
//	AARQ-apdu-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type AARQ_apdu_protocol_version = asn1.BitString

const AARQ_apdu_protocol_version_Version1 int32 = 0

// # ASN.1 Definition:
//
//	OsiBindResult-mode-selector ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_mode_selector struct {
	Mode_value int `asn1:"tag:0"`
}

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters_protocol_version = asn1.BitString

const OsiBindResult_normal_mode_parameters_protocol_version_Version_1 int32 = 0

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters-presentation-context-definition-result-list-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters_presentation_context_definition_result_list_Item struct {
	Result               Result               `asn1:"tag:0"`
	Transfer_syntax_name Transfer_syntax_name `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters-user-data-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters-user-data-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters_user_data_fully_encoded_data_Item struct {
	Transfer_syntax_name            Transfer_syntax_name `asn1:"optional"`
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiBindResult_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters-user-data ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters_user_data = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindResult-normal-mode-parameters ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindResult_normal_mode_parameters struct {
	Protocol_version                            OsiBindResult_normal_mode_parameters_protocol_version                                     `asn1:"optional,tag:0"`
	Responding_presentation_selector            Presentation_selector                                                                     `asn1:"optional,tag:3"`
	Presentation_context_definition_result_list [](OsiBindResult_normal_mode_parameters_presentation_context_definition_result_list_Item) `asn1:"tag:5"`
	User_data                                   OsiBindResult_normal_mode_parameters_user_data
}

// # ASN.1 Definition:
//
//	AARE-apdu-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type AARE_apdu_protocol_version = asn1.BitString

const AARE_apdu_protocol_version_Version1 int32 = 0

// # ASN.1 Definition:
//
//	Associate-source-diagnostic-acse-service-user ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type Associate_source_diagnostic_acse_service_user = int64

const Associate_source_diagnostic_acse_service_user_Null Associate_source_diagnostic_acse_service_user = 0

const Associate_source_diagnostic_acse_service_user_No_reason_given Associate_source_diagnostic_acse_service_user = 1

const Associate_source_diagnostic_acse_service_user_Application_context_name_not_supported Associate_source_diagnostic_acse_service_user = 2

const Associate_source_diagnostic_acse_service_user_Calling_AP_title_not_recognized Associate_source_diagnostic_acse_service_user = 3

const Associate_source_diagnostic_acse_service_user_Calling_AP_invocation_identifier_not_recognized Associate_source_diagnostic_acse_service_user = 4

const Associate_source_diagnostic_acse_service_user_Calling_AE_qualifier_not_recognized Associate_source_diagnostic_acse_service_user = 5

const Associate_source_diagnostic_acse_service_user_Calling_AE_invocation_identifier_not_recognized Associate_source_diagnostic_acse_service_user = 6

const Associate_source_diagnostic_acse_service_user_Called_AP_title_not_recognized Associate_source_diagnostic_acse_service_user = 7

const Associate_source_diagnostic_acse_service_user_Called_AP_invocation_identifier_not_recognized Associate_source_diagnostic_acse_service_user = 8

const Associate_source_diagnostic_acse_service_user_Called_AE_qualifier_not_recognized Associate_source_diagnostic_acse_service_user = 9

const Associate_source_diagnostic_acse_service_user_Called_AE_invocation_identifier_not_recognized Associate_source_diagnostic_acse_service_user = 10

// # ASN.1 Definition:
//
//	Associate-source-diagnostic-acse-service-provider ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type Associate_source_diagnostic_acse_service_provider = int64

const Associate_source_diagnostic_acse_service_provider_Null Associate_source_diagnostic_acse_service_provider = 0

const Associate_source_diagnostic_acse_service_provider_No_reason_given Associate_source_diagnostic_acse_service_provider = 1

const Associate_source_diagnostic_acse_service_provider_No_common_acse_version Associate_source_diagnostic_acse_service_provider = 2

// # ASN.1 Definition:
//
//	OsiBindError-normal-mode-parameters-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type OsiBindError_normal_mode_parameters_protocol_version = asn1.BitString

const OsiBindError_normal_mode_parameters_protocol_version_Version_1 int32 = 0

// # ASN.1 Definition:
//
//	OsiBindError-normal-mode-parameters-user-data-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindError_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindError-normal-mode-parameters-user-data-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindError_normal_mode_parameters_user_data_fully_encoded_data_Item struct {
	Transfer_syntax_name            Transfer_syntax_name `asn1:"optional"`
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiBindError_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiBindError-normal-mode-parameters-user-data ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindError_normal_mode_parameters_user_data = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiBindError-normal-mode-parameters ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiBindError_normal_mode_parameters struct {
	Protocol_version                            OsiBindError_normal_mode_parameters_protocol_version `asn1:"optional,tag:0"`
	Responding_presentation_selector            Presentation_selector                                `asn1:"optional,tag:3"`
	Presentation_context_definition_result_list Result_list                                          `asn1:"optional,tag:5"`
	Provider_reason                             Provider_reason                                      `asn1:"optional,tag:10"`
	User_data                                   OsiBindError_normal_mode_parameters_user_data        `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Result-list-Item-provider-reason ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type Result_list_Item_provider_reason = int64

const Result_list_Item_provider_reason_Reason_not_specified Result_list_Item_provider_reason = 0

const Result_list_Item_provider_reason_Abstract_syntax_not_supported Result_list_Item_provider_reason = 1

const Result_list_Item_provider_reason_Proposed_transfer_syntaxes_not_supported Result_list_Item_provider_reason = 2

// # ASN.1 Definition:
//
//	Result-list-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type Result_list_Item struct {
	Result               Result                           `asn1:"tag:0"`
	Transfer_syntax_name Transfer_syntax_name             `asn1:"optional,tag:1"`
	Provider_reason      Result_list_Item_provider_reason `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	AAREerr-apdu-protocol-version ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type AAREerr_apdu_protocol_version = asn1.BitString

const AAREerr_apdu_protocol_version_Version1 int32 = 0

// # ASN.1 Definition:
//
//	OsiUnbind-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiUnbind_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiUnbind-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiUnbind_fully_encoded_data_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiUnbind_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiUnbindResult-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiUnbindResult_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiUnbindResult-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiUnbindResult_fully_encoded_data_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiUnbindResult_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiOperation-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiOperation_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	OsiOperation-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiOperation_fully_encoded_data_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        OsiOperation_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	OsiRes-result ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type OsiRes_result struct {
	Opcode Code
	Result asn1.RawValue
}

// # ASN.1 Definition:
//
//	OsiRej-problem ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OsiRej_problem = asn1.RawValue

// # ASN.1 Definition:
//
//	ARU-PPDU-normal-mode-parameters-user-data-fully-encoded-data-Item-presentation-data-values ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ARU_PPDU_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values = asn1.RawValue

// # ASN.1 Definition:
//
//	ARU-PPDU-normal-mode-parameters-user-data-fully-encoded-data-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ARU_PPDU_normal_mode_parameters_user_data_fully_encoded_data_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Presentation_data_values        ARU_PPDU_normal_mode_parameters_user_data_fully_encoded_data_Item_presentation_data_values
}

// # ASN.1 Definition:
//
//	ARU-PPDU-normal-mode-parameters-user-data ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ARU_PPDU_normal_mode_parameters_user_data = asn1.RawValue

// # ASN.1 Definition:
//
//	ARU-PPDU-normal-mode-parameters ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ARU_PPDU_normal_mode_parameters struct {
	Presentation_context_identifier_list Presentation_context_identifier_list `asn1:"tag:0"`
	User_data                            ARU_PPDU_normal_mode_parameters_user_data
}

// # ASN.1 Definition:
//
//	Presentation-context-identifier-list-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type Presentation_context_identifier_list_Item struct {
	Presentation_context_identifier Presentation_context_identifier
	Transfer_syntax_name            Transfer_syntax_name
}
