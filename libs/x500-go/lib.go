package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

const (
	OPERATION_OUTCOME_TYPE_FAILURE = 0
	OPERATION_OUTCOME_TYPE_PENDING = 1
	OPERATION_OUTCOME_TYPE_RESULT  = 2
	OPERATION_OUTCOME_TYPE_ERROR   = 3
	OPERATION_OUTCOME_TYPE_REJECT  = 4
	OPERATION_OUTCOME_TYPE_ABORT   = 8
	OPERATION_OUTCOME_TYPE_OTHER   = 22
)

const (
	REJECT_PROBLEM_UNRECOGNIZED_PDU               = 0
	REJECT_PROBLEM_MISTYPED_PDU                   = 1
	REJECT_PROBLEM_BADLY_STRUCTURED_PDU           = 2
	REJECT_PROBLEM_DUPLICATE_INVOCATION           = 10
	REJECT_PROBLEM_UNRECOGNIZED_OPERATION         = 11
	REJECT_PROBLEM_MISTYPED_ARGUMENT              = 12
	REJECT_PROBLEM_RESOURCE_LIMITATION            = 13
	REJECT_PROBLEM_RELEASE_IN_PROGRESS            = 14
	REJECT_PROBLEM_UNRECOGNIZED_INVOCATION_RESULT = 20
	REJECT_PROBLEM_RESULT_RESPONSE_UNEXPECTED     = 21
	REJECT_PROBLEM_MISTYPED_RESULT                = 22
	REJECT_PROBLEM_UNRECOGNIZED_INVOCATION_ERROR  = 30
	REJECT_PROBLEM_ERROR_RESPONSE_UNEXPECTED      = 31
	REJECT_PROBLEM_UNRECOGNIZED_ERROR             = 32
	REJECT_PROBLEM_UNEXPECTED_ERROR               = 33
	REJECT_PROBLEM_MISTYPED_PARAMETER             = 34
)

type SignatureInfo struct {
	Content   []byte // The value over which the signature was calculated
	Algorithm pkix.AlgorithmIdentifier
	Value     []byte // The value of the signature itself
}

type AttributeOrValueProblem struct {
	Problem int // Meaningless in updateError
	Type    asn1.ObjectIdentifier
	Value   asn1.RawValue // Meaningless in updateError
}

type X500OperationError struct {
	ApplicationContext asn1.ObjectIdentifier
	InvokeId           InvokeId
	Code               int
	Problem            int                       // Present in many error types
	MatchedObject      Name                      // Used by attributeError and nameError
	AbandonedOperation InvokeId                  // Used by abandoned
	Candidate          ContinuationReference     // Used by referral
	ContextPrefix      DistinguishedName         // Used by dsaReferral
	AttributeProblems  []AttributeOrValueProblem // Used by updateError and attributeError
	SecurityParameters SecurityParameters
	Performer          DistinguishedName
	AliasDereferenced  bool
	Notification       []Attribute
	Signature          SignatureInfo
}

type X500AssociateArgument struct {
	// OSI Protocol Fields
	ModeSelector                      int // SHOULD always be 1
	OSIProtocolVersion1               bool
	CallingPresentationSelector       []byte
	CalledPresentationSelector        []byte
	PresentationContextDefinitionList Context_list
	TransferSyntaxName                asn1.ObjectIdentifier
	PresentationContextIdentifier     int

	// AARQ-apdu Fields
	ACSEProtocolVersion1          bool
	ApplicationContext            asn1.ObjectIdentifier
	CalledAPTitle                 DistinguishedName
	CalledAETitle                 GeneralName
	CalledAPInvocationIdentifier  AP_invocation_identifier
	CalledAEInvocationIdentifier  AE_invocation_identifier
	CallingAPTitle                DistinguishedName
	CallingAETitle                GeneralName
	CallingAPInvocationIdentifier AP_invocation_identifier
	CallingAEInvocationIdentifier AE_invocation_identifier
	ImplementationInformation     string

	// Fields from DirectoryBindArgument
	V1          bool
	V2          bool
	Credentials Credentials
}

// Describes the result of a directory bind, using either IDM or OSI protocols,
// and covering both bind success (result) and bind error.
// To determine success, just check that ACSEResult == 0.
type X500AssociateOutcome struct {
	// OSI Protocol Fields
	ModeSelector                      int // SHOULD always be 1
	OSIProtocolVersion1               bool
	RespondingPresentationSelector    []byte
	PresentationContextDefinitionList Result_list
	TransferSyntaxName                asn1.ObjectIdentifier
	PresentationContextIdentifier     int
	ProviderReason                    Provider_reason

	// ACSE AARE-apdu and AAREerr-apdu Fields
	ACSEProtocolVersion1              bool
	ApplicationContext                asn1.ObjectIdentifier
	ACSEResult                        Associate_result                                  // 0 if successful
	AssociateSourceDiagnosticUser     Associate_source_diagnostic_acse_service_user     // Set to -1 if unset
	AssociateSourceDiagnosticProvider Associate_source_diagnostic_acse_service_provider // Set to -1 if unset

	// ACSE uses separate responding AP-title and AE-qualifier fields, because
	// it is assumed that every AE has a directory name.
	// IDM uses GeneralName. Since a GeneralName is a superset, we use that
	// instead.
	RespondingAPTitle                DistinguishedName
	RespondingAETitle                GeneralName
	RespondingAPInvocationIdentifier int
	RespondingAEInvocationIdentifier int
	ImplementationInformation        string

	// Fields specific to the IDM protocol
	AETitleError IdmBindError_aETitleError // Set to -1 if unset

	// Fields from DirectoryBindResult, directoryBindError
	V1                         bool
	V2                         bool
	Credentials                Credentials     // NULL value if unset
	PwdResponseTimeLeft        int             // -1 if unset
	PwdResponseGracesRemaining int             // -1 if unset
	PwdResponseError           int             // -1 if unset
	ServiceError               ServiceProblem  // Set to -1 if unset
	SecurityError              SecurityProblem // Set to -1 if unset
	SecurityParameters         SecurityParameters
	Signature                  SignatureInfo
}

type X500Request struct {
	PresentationContextIdentifier Presentation_context_identifier
	InvokeId                      InvokeId
	OpCode                        Code
	Argument                      asn1.RawValue
}

type X500Abort struct {
	PresentationContextIdentifierList Presentation_context_identifier_list
	PresentationContextIdentifier     Presentation_context_identifier
	AbortSource                       ABRT_source
	ProviderReason                    Abort_reason
	EventIdentifier                   Event_identifier
	UserReason                        Abort // Only used by IDM Abort
}

type X500OpOutcome struct {
	OutcomeType   int             // See the OPERATION_OUTCOME_* constants defined above.
	InvokeId      InvokeId        // This is always set for any outcome type.
	OpCode        Code            // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_RESULT
	ErrCode       Code            // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_ERROR
	Parameter     asn1.RawValue   // The result or error.
	RejectProblem asn1.Enumerated // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_REJECT
	Abort         X500Abort       // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_ABORT
}

type X500UnbindRequest struct {
	PresentationContextIdentifier Presentation_context_identifier
	Reason                        Release_request_reason
}

type X500UnbindOutcome struct {
	PresentationContextIdentifier Presentation_context_identifier
	Reason                        Release_response_reason
}

// Examples: IDMStack, ITOTStack, LPPStack (IETF RFC 1085), DIXIEStack (IETF RFC 1249)
type DirectoryProtocolStack interface {
	Bind(arg X500AssociateArgument) (response X500AssociateOutcome, err error)
	Request(req X500Request) (response X500OpOutcome, err error)
	Unbind(req X500UnbindRequest) (response X500UnbindOutcome, err error)
}

type DirectoryAccessStack interface {
	DirectoryProtocolStack
	Read(arg_data ReadArgumentData) (resp X500OpOutcome, result *ReadResult, err error)
	Compare(arg_data CompareArgumentData) (resp X500OpOutcome, result *CompareResult, err error)
	Abandon(arg_data AbandonArgumentData) (resp X500OpOutcome, result *AbandonResult, err error)
	List(arg_data ListArgumentData) (resp X500OpOutcome, result *ListResult, err error)
	Search(arg_data SearchArgumentData) (resp X500OpOutcome, result *SearchResult, err error)
	AddEntry(arg_data AddEntryArgumentData) (resp X500OpOutcome, result *AddEntryResult, err error)
	RemoveEntry(arg_data RemoveEntryArgumentData) (resp X500OpOutcome, result *RemoveEntryResult, err error)
	ModifyEntry(arg_data ModifyEntryArgumentData) (resp X500OpOutcome, result *ModifyEntryResult, err error)
	ModifyDN(arg_data ModifyDNArgumentData) (resp X500OpOutcome, result *ModifyDNResult, err error)
	ChangePassword(arg_data ChangePasswordArgumentData) (resp X500OpOutcome, result *ChangePasswordResult, err error)
	AdministerPassword(arg_data AdministerPasswordArgumentData) (resp X500OpOutcome, result *AdministerPasswordResult, err error)
}
