package x500_go

import (
	"context"
	"crypto/x509"
	"encoding/asn1"
	"math/big"
	"time"
)

type OutcomeType = int

const (
	OP_OUTCOME_FAILURE OutcomeType = 0
	OP_OUTCOME_RESULT  OutcomeType = 1
	OP_OUTCOME_ERROR   OutcomeType = 2
	OP_OUTCOME_REJECT  OutcomeType = 3
	OP_OUTCOME_ABORT   OutcomeType = 4
)

type RejectProblem = asn1.Enumerated

const (
	REJECT_PROBLEM_UNRECOGNIZED_PDU               RejectProblem = 0
	REJECT_PROBLEM_MISTYPED_PDU                   RejectProblem = 1
	REJECT_PROBLEM_BADLY_STRUCTURED_PDU           RejectProblem = 2
	REJECT_PROBLEM_DUPLICATE_INVOCATION           RejectProblem = 10
	REJECT_PROBLEM_UNRECOGNIZED_OPERATION         RejectProblem = 11
	REJECT_PROBLEM_MISTYPED_ARGUMENT              RejectProblem = 12
	REJECT_PROBLEM_RESOURCE_LIMITATION            RejectProblem = 13
	REJECT_PROBLEM_RELEASE_IN_PROGRESS            RejectProblem = 14
	REJECT_PROBLEM_UNRECOGNIZED_INVOCATION_RESULT RejectProblem = 20
	REJECT_PROBLEM_RESULT_RESPONSE_UNEXPECTED     RejectProblem = 21
	REJECT_PROBLEM_MISTYPED_RESULT                RejectProblem = 22
	REJECT_PROBLEM_UNRECOGNIZED_INVOCATION_ERROR  RejectProblem = 30
	REJECT_PROBLEM_ERROR_RESPONSE_UNEXPECTED      RejectProblem = 31
	REJECT_PROBLEM_UNRECOGNIZED_ERROR             RejectProblem = 32
	REJECT_PROBLEM_UNEXPECTED_ERROR               RejectProblem = 33
	REJECT_PROBLEM_MISTYPED_PARAMETER             RejectProblem = 34
)

type AttributeOrValueProblem struct {
	Problem int // Meaningless in updateError
	Type    asn1.ObjectIdentifier
	Value   asn1.RawValue // Meaningless in updateError
}

// TODO: Use this?
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
}

// The parameters of an X.500 directory bind, as well as those of the underlying
// Remote Operation Service Element (ROSE) and Association Control Service
// Element (ACSE), which are unused if not applicable to the underlying
// operation transport.
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
	Credentials *Credentials
}

// Describes the result of a directory bind, using either IDM or OSI protocols,
// and covering both bind success (result), bind error, and abort.
// (Reject is not a valid outcome for a bind operation.)
// To determine success, just check that OutcomeType == OPERATION_OUTCOME_TYPE_RESULT.
type X500AssociateOutcome struct {
	OutcomeType OutcomeType
	err         error         // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_FAILURE
	Parameter   asn1.RawValue // Only set if OutcomeType != OPERATION_OUTCOME_TYPE_ABORT
	Abort       X500Abort     // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_ABORT

	// OSI Protocol Fields
	ModeSelector                      int // SHOULD always be 1
	OSIProtocolVersion1               bool
	RespondingPresentationSelector    *big.Int
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
}

// A Remote Operation Service Element (ROSE) request
type X500Request struct {
	PresentationContextIdentifier Presentation_context_identifier
	InvokeId                      InvokeId
	OpCode                        Code
	Argument                      asn1.RawValue
}

// A Remote Operation Service Element (ROSE) abort
type X500Abort struct {
	PresentationContextIdentifierList Presentation_context_identifier_list
	PresentationContextIdentifier     Presentation_context_identifier
	AbortSource                       ABRT_source
	ProviderReason                    Abort_reason
	EventIdentifier                   Event_identifier
	UserReason                        Abort // Only used by IDM Abort
}

// A Remote Operation Service Element (ROSE) outcome: a generalization over
// results, errors, rejections, aborts, etc. In other words, a union of all
// possible outcomes to a ROSE operation other than a failure happening at the
// lower layers, such as a TCP socket closure.
type X500OpOutcome struct {
	OutcomeType   OutcomeType
	InvokeId      InvokeId      // This is always set for any outcome type.
	OpCode        Code          // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_RESULT
	ErrCode       Code          // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_ERROR
	Parameter     asn1.RawValue // The result or error.
	RejectProblem RejectProblem // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_REJECT
	Abort         X500Abort     // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_ABORT
	err           error         // Only set if OutcomeType == OPERATION_OUTCOME_TYPE_FAILURE
}

// TODO: Rename to generalize over ROSE instead of X.500
// A Remote Operation Service Element (ROSE) unbind request
type X500UnbindRequest struct {
	PresentationContextIdentifier Presentation_context_identifier
	Reason                        Release_request_reason
}

// A Remote Operation Service Element (ROSE) unbind outcome
type X500UnbindOutcome struct {
	PresentationContextIdentifier Presentation_context_identifier
	Reason                        Release_response_reason
}

// An Internet Directly-Mapped `startTLS` message outcome, which may be a
// `tlsResponse` message or an error.
type StartTLSOutcome struct {
	err      error
	response TLSResponse
}

// Remote Operation Service Element (ROSE) per ITU-T Recommendation X.880.
//
// For now, this is only implemented via the Internet Directly-Mapped (IDM)
// protocol defined in
// [ITU-T Recommendation X.519 (2019)](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.519),
// but in the future, this may be implemented via
// [ISO Transport over TCP (ITOT)](https://www.rfc-editor.org/rfc/rfc1006),
// [Lightweight Presentation Protocol](https://www.rfc-editor.org/rfc/rfc1085),
// [DIXIE](https://www.rfc-editor.org/rfc/rfc1249), and others.
type RemoteOperationServiceElement interface {

	// Perform the Remote Operation Service Element (ROSE) Bind operation
	Bind(ctx context.Context, arg X500AssociateArgument) (response X500AssociateOutcome, err error)

	// Issue a Remote Operation Service Element (ROSE) request
	Request(ctx context.Context, req X500Request) (response X500OpOutcome, err error)

	// Unbind via the Remote Operation Service Element (ROSE)
	Unbind(ctx context.Context, req X500UnbindRequest) (response X500UnbindOutcome, err error)

	// Close the network layers / transport layers that facilitate the
	// Remote Operation Service Element (ROSE), such as by closing a TCP socket.
	// This is a separate operation from unbinding so that the underlying
	// transport may be re-used for a new session.
	CloseTransport() (err error)
}

type DirectoryAccessClient interface {
	RemoteOperationServiceElement

	// DAP Operations

	// Perform the `read` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	Read(ctx context.Context, arg_data ReadArgumentData) (response X500OpOutcome, result *ReadResultData, err error)

	// Perform the `compare` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	Compare(ctx context.Context, arg_data CompareArgumentData) (resp X500OpOutcome, result *CompareResultData, err error)

	// Perform the `abandon` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	Abandon(ctx context.Context, arg_data AbandonArgumentData) (resp X500OpOutcome, result *AbandonResultData, err error)

	// Perform the `list` Directory Access Protocol (DAP) operation. The `info` returned may be `nil`.
	List(ctx context.Context, arg_data ListArgumentData) (resp X500OpOutcome, info *ListResultData_listInfo, err error)

	// Perform the `search` Directory Access Protocol (DAP) operation. The `info` returned may be `nil`.
	Search(ctx context.Context, arg_data SearchArgumentData) (resp X500OpOutcome, info *SearchResultData_searchInfo, err error)

	// Perform the `addEntry` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	AddEntry(ctx context.Context, arg_data AddEntryArgumentData) (resp X500OpOutcome, result *AddEntryResultData, err error)

	// Perform the `removeEntry` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	RemoveEntry(ctx context.Context, arg_data RemoveEntryArgumentData) (resp X500OpOutcome, result *RemoveEntryResultData, err error)

	// Perform the `modifyEntry` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	ModifyEntry(ctx context.Context, arg_data ModifyEntryArgumentData) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Perform the `modifyDN` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	ModifyDN(ctx context.Context, arg_data ModifyDNArgumentData) (resp X500OpOutcome, result *ModifyDNResultData, err error)

	// Perform the `changePassword` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	ChangePassword(ctx context.Context, arg_data ChangePasswordArgumentData) (resp X500OpOutcome, result *ChangePasswordResultData, err error)

	// Perform the `administerPassword` Directory Access Protocol (DAP) operation. The `result` returned may be `nil`.
	AdministerPassword(ctx context.Context, arg_data AdministerPasswordArgumentData) (resp X500OpOutcome, result *AdministerPasswordResultData, err error)

	// Higher-Level DAP API

	// Bind using simple authentication: your distinguished name and password
	BindSimply(ctx context.Context, dn DN, password string) (resp X500AssociateOutcome, err error)

	// Bind by signing a token with your configured signing key.
	// An error will be returned if no signing key or no signing cert is configured.
	// The `requesterDN` is _your_ DN. The `recipientDN` is the application entity
	// title of the DSA.
	BindStrongly(ctx context.Context, requesterdn DN, recipientdn DN, acPath *AttributeCertificationPath) (resp X500AssociateOutcome, err error)

	// Bind using the `PLAIN` Simple Authentication and Security Layer (SASL) Mechanism
	BindPlainly(ctx context.Context, username string, password string) (resp X500AssociateOutcome, err error)

	// Read selected user attributes from an entry named by a distinguished name.
	// `result` may be `nil`
	ReadSimple(ctx context.Context, dn DN, userAttributes []asn1.ObjectIdentifier) (response X500OpOutcome, result *ReadResultData, err error)

	// Remove an entry named by the distinguished name `dn` using the
	// `removeEntry` X.500 Directory Access Protocol (DAP) operation.
	RemoveEntryByDN(ctx context.Context, dn DN) (resp X500OpOutcome, result *RemoveEntryResultData, err error)

	// Abandon an X.500 Directory operation by its invoke ID.
	AbandonById(ctx context.Context, invokeId int) (resp X500OpOutcome, result *AbandonResultData, err error)

	// List up to `limit` subordinates underneath the entry named by the
	// distinguished name `dn`.
	ListByDN(ctx context.Context, dn DN, limit int) (resp X500OpOutcome, info *ListResultData_listInfo, err error)

	// Add a new entry having distinguished name `dn` and composed of attributes
	// `attrs`. If you need to use the `targetSystem` field to add an entry in
	// another DSA and establish a hierarchical operational binding, you will
	// need to use the lower-level [AddEntry] method.
	AddEntrySimple(ctx context.Context, dn DN, attrs []Attribute) (resp X500OpOutcome, result *AddEntryResultData, err error)

	// Invoke the `changePassword` operation on the entry named by distinguished
	// name `dn` using unencrypted values `old` and `new` for `oldPwd` and
	// `newPwd` respectively.
	ChangePasswordSimple(ctx context.Context, dn DN, old string, new string) (resp X500OpOutcome, result *ChangePasswordResultData, err error)

	// Invoke the `administerPassword` operation on the entry named by
	// distinguished name `dn` using the unencrypted value `new` for `newPwd`.
	AdministerPasswordSimple(ctx context.Context, dn DN, new string) (resp X500OpOutcome, result *AdministerPasswordResultData, err error)
}

type DN = DistinguishedName

type Subschema struct {
	AttributeTypes   *[]AttributeTypeDescription
	ObjectClasses    *[]ObjectClassDescription
	NameForms        *[]NameFormDescription
	StructureRules   *[]DITStructureRuleDescription
	ContentRules     *[]DITContentRuleDescription
	Friendships      *[]FriendsDescription
	MatchingRules    *[]MatchingRuleDescription
	MatchingRuleUses *[]MatchingRuleUseDescription
	SyntaxNames      *[]LdapSyntaxDescription
	ContextUses      *[]DITContextUseDescription
	ContextTypes     *[]ContextDescription
}

type DSAInfo struct {
	VendorName              string
	VendorVersion           string
	FullVendorVersion       string
	MyAccessPoint           AccessPoint
	SuperiorKnowledge       []AccessPoint
	DITBridgeKnowledge      []DitBridgeKnowledge
	SubschemaSubentry       DistinguishedName
	SupportedControls       asn1.ObjectIdentifier
	SupportedExtensions     asn1.ObjectIdentifier
	SupportedFeatures       asn1.ObjectIdentifier
	SupportedLDAPVersion    int
	DynamicSubtrees         []DistinguishedName
	AltServers              []string
	SupportedSASLMechanisms []string
	NamingContexts          []DistinguishedName

	// A catch-all, which includes all attributes (user and operational)
	RootDSEAttributes []Attribute
}

// This type describes an entry of object classes person, residentialPerson,
// organizationalPerson, inetOrgPerson, and pilotPerson
type CreatePersonOptions struct {
	commonName            string
	givenName             string
	initials              string
	surname               string
	description           []string
	telephoneNumber       []string
	faxNumber             []string
	userPassword          string
	manager               []DN
	secretary             []DN
	seeAlso               []DN
	localityName          []string
	stateOrProvinceName   string
	streetAddress         string
	postalAddress         []string
	postalCode            string
	poBox                 string
	businessCategory      []string
	carLicense            []string
	departmentNumber      []string
	displayName           string
	employeeNumber        string
	employeeType          []string
	preferredLanguage     string
	homeTelephoneNumber   string
	homePostalAddress     []string
	mail                  []string
	labeledURI            []string
	mobileTelephoneNumber []string
	organizationName      []string
	roomNumber            []string
	uid                   []string
	userCertificate       []x509.Certificate
	uniqueIdentifier      []asn1.BitString
	title                 []string
	personalTitle         []string
}

type CreateAccountOptions struct {
	description            []string
	seeAlso                []DN
	localityName           []string
	organizationName       []string
	organizationalUnitName []string
	host                   []string
}

type CreateDocumentOptions struct {
	commonName             []string
	description            []string
	seeAlso                []DN
	localityName           []string
	organizationName       []string
	organizationalUnitName []string
	documentTitle          []string
	documentVersion        []string
	documentAuthor         []DN
	documentLocation       []string
	documentPublisher      []string
}

type CreateDocumentSeriesOptions struct {
	description            []string
	seeAlso                []DN
	telephoneNumber        []string
	localityName           []string
	organizationName       []string
	organizationalUnitName []string
}

type CreateDomainOptions struct {
	associatedName             []DN
	organizationName           []string
	description                []string
	businessCategory           []string
	seeAlso                    []DN
	searchGuide                []Guide
	userPassword               []string
	localityName               []string
	stateOrProvinceName        []string
	postalAddress              []string
	postalCode                 string
	physicalDeliveryOfficeName string
	postOfficeBox              string
	streetAddress              string
	fax                        []string
	telephoneNumber            []string
}

type CreateOrganizationOptions struct {
	description                []string
	businessCategory           []string
	seeAlso                    []DN
	searchGuide                []Guide
	userPassword               string
	stateOrProvinceName        string
	localityName               string
	streetAddress              string
	postalCode                 string
	physicalDeliveryOfficeName string
	postOfficeBox              string
	postalAddress              []string
	telephoneNumber            []string
	faxNumber                  []string
}

type PasswordPolicyOptions struct {
	// TODO:
}

type CRLOptions struct {
	crl       []x509.RevocationList // attributeCertificateRevocationList
	endEntity []x509.RevocationList // eeAttrCertificateRevocationList
	authority []x509.RevocationList // attributeAuthorityRevocationList
}

// ISO Tag = ISO/IEC 15693
type BecomeISOTagInfoOptions struct {
	tagOid      asn1.ObjectIdentifier
	tagAfi      byte // Each is one-byte
	contentUrl  []string
	uii         asn1.BitString
	uiiInUrn    string
	tagLocation *UtmCoordinates
}

type BecomeISOTagTypeOptions struct {
	tagOid    asn1.ObjectIdentifier
	tagAfi    byte
	uiiFormat *UiiFormat
}

type BecomeEPCTaginfoOptions struct {
	epc         asn1.BitString
	epcInUrn    string
	contentUrl  []string
	tagLocation *UtmCoordinates
}

type BecomePosixAccountOptions struct {
	commonName    []string
	uid           string
	uidNumber     int
	gidNumber     int
	homeDirectory string
	userPassword  string
	loginShell    string
	gecos         string
	description   []string
}

type BecomeShadowAccount struct {
	userPassword     string
	shadowLastChange int
	shadowMin        int
	shadowMax        int
	shadowWarning    int
	shadowInactive   int
	shadowExpire     int
	shadowFlag       int
	description      []string
}

type BecomeNaturalPersonOptions struct {
	emailAddress         []string
	unstructuredName     []string
	unstructuredAddress  []string
	dateOfBirth          time.Time
	placeOfBirth         string
	gender               string
	countryOfCitizenship []string
	countryOfResidence   []string
	pseudonym            []string
	serialNumber         []string
}

type SchemaAwareDirectoryAccessClient interface {
	// Create Specific Entries

	CreateSubentry(ctx context.Context, superior DN, name string, subtreeSpec []SubtreeSpecification) (resp X500OpOutcome, result *AddEntryResultData, err error)
	// If name is not "", the friendlyCountry object class is used.
	CreatePerson(ctx context.Context, superior DN, cn, surname string, opts *CreatePersonOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOrgPerson(ctx context.Context, superior DN, cn, surname string, opts *CreatePersonOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateResPerson(ctx context.Context, dn DN, cn, surname string, opts *CreatePersonOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateInetOrgPerson(ctx context.Context, dn DN, cn, surname string, opts *CreatePersonOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreatePilotPerson(ctx context.Context, dn DN, cn, surname string, opts *CreatePersonOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateCountry(ctx context.Context, superior DN, iso2Code, desc, name string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateStateOrProvince(ctx context.Context, superior DN, name, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateLocality(ctx context.Context, superior DN, name, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOrganization(ctx context.Context, superior DN, name string, opts *CreateOrganizationOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOrgUnit(ctx context.Context, superior DN, name string, opts *CreateOrganizationOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOrgRole(ctx context.Context, superior DN, name, desc string, members []DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateProcess(ctx context.Context, superior DN, name, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateAppEntity(ctx context.Context, superior DN, name string, addr PresentationAddress, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDSA(ctx context.Context, superior DN, name string, addr PresentationAddress, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDevice(ctx context.Context, superior DN, name, serial, desc string, owner DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDMD(ctx context.Context, superior DN, name, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOIDRoot(ctx context.Context, superior DN, arc1, arc2, arc3 int, aliasedEntry DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateOIDArc(ctx context.Context, superior DN, arc int, aliasedEntry DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateGroupOfUrlsEntry(ctx context.Context, superior DN, name, desc, org string, members []string, owner DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateAliasEntry(ctx context.Context, dn, aliasedEntry DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateCRLDPEntry(ctx context.Context, superior DN, name string, crl, eepk, authority, delta *x509.RevocationList) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDomain(ctx context.Context, superior DN, dc string, opts *CreateDomainOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateAccount(ctx context.Context, superior DN, uid string, opts *CreateAccountOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDocument(ctx context.Context, superior DN, docid string, opts *CreateDocumentOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateDocumentSeries(ctx context.Context, superior DN, name string, opts *CreateDocumentSeriesOptions) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateRoom(ctx context.Context, superior DN, name, number, desc, phone string, seeAlso []DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreatePosixGroup(ctx context.Context, superior DN, gid int, name, desc, userpwd string, members []string) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateIPService(ctx context.Context, superior DN, name, transport string, port int, manager DN) (resp X500OpOutcome, result *AddEntryResultData, err error)
	CreateIPNetwork(ctx context.Context, superior DN, name, ip, netmask, loc, desc string) (resp X500OpOutcome, result *AddEntryResultData, err error)

	// Add Specific Auxiliary Object Classes

	BecomePasswordAdminSubentry(ctx context.Context, dn DN, pwdAttribute AttributeType, opts *PasswordPolicyOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeSubschemaSubentry(ctx context.Context, dn DN, schema *Subschema) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeServiceAdminSubentry(ctx context.Context, dn DN, searchRules []SearchRuleDescription) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeContextAssertionDefaultSubentry(ctx context.Context, dn DN, cads []TypeAndContextAssertion) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePMIUser(ctx context.Context, dn DN, ac *AttributeCertificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePMIAA(ctx context.Context, dn DN, aaCert *AttributeCertificate, crls *CRLOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePMISOA(ctx context.Context, dn DN, adc *AttributeCertificate, crls *CRLOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeAttCertCRLDistPoint(ctx context.Context, dn DN, crls *CRLOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePKIUser(ctx context.Context, dn DN, userCert *x509.Certificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePKICA(ctx context.Context, dn DN, cacert *x509.Certificate, opts *CRLOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePMIDelegationPath(ctx context.Context, dn DN, path []AttCertPath) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePrivilegePolicy(ctx context.Context, dn DN, policies []PolicySyntax) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeProtectedPrivilegePolicy(ctx context.Context, dn DN, policies []AttributeCertificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeDeltaCRL(ctx context.Context, dn DN, deltaCRLs []x509.RevocationList) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeCPCPS(ctx context.Context, dn DN, statements []InfoSyntax, policies []PolicySyntax) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePKICertPath(ctx context.Context, dn DN, paths []PkiPath) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeStrongAuthenticationUser(ctx context.Context, dn DN, usercerts []x509.Certificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeUserSecurityInfo(ctx context.Context, dn DN, supportedAlgs []SupportedAlgorithm) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeUserPwdClass(ctx context.Context, dn DN, pwd UserPwd) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeCertificationAuthority(ctx context.Context, dn DN, cert x509.Certificate, crls *CRLOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeISOTagInfo(ctx context.Context, dn DN, opts *BecomeISOTagInfoOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeISOTagType(ctx context.Context, dn DN, opts *BecomeISOTagTypeOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeEPCTagInfo(ctx context.Context, dn DN, opts *BecomeEPCTaginfoOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeEPCTagType(ctx context.Context, dn DN, format UiiFormat) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomePosixAccount(ctx context.Context, dn DN, opts *BecomePosixAccountOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeShadowAccount(ctx context.Context, dn DN, opts *BecomeShadowAccount) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeIEEE802Device(ctx context.Context, dn DN, macAddress string) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeIPHost(ctx context.Context, dn DN, cn, ip, desc, loc string, manager DN) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	BecomeNaturalPerson(ctx context.Context, dn DN, opts *BecomeNaturalPersonOptions) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Methods for Viewing Schema

	GetSubschema(ctx context.Context, dn DN) (resp X500OpOutcome, result *Subschema, err error)
	ListAttributeTypes(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]AttributeTypeDescription, err error)
	ListObjectClasses(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]ObjectClassDescription, err error)
	ListNameForms(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]NameFormDescription, err error)
	ListStructureRules(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]DITStructureRuleDescription, err error)
	ListContentRules(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]DITContentRuleDescription, err error)
	ListFriendships(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]FriendsDescription, err error)
	ListMatchingRules(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]MatchingRuleDescription, err error)
	ListMatchingRuleUses(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]MatchingRuleUseDescription, err error)
	ListSyntaxNames(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]LdapSyntaxDescription, err error)
	ListContextUses(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]DITContextUseDescription, err error)
	ListSearchRules(ctx context.Context, dn DN) (resp X500OpOutcome, result *[]SearchRuleDescription, err error)
	ListSubentries(ctx context.Context, dn DN) (resp X500OpOutcome, result *ListResultData, err error)

	// Group Management

	GroupAdd(ctx context.Context, group, member DN, uid *asn1.BitString) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	GroupRemove(ctx context.Context, group, member DN, uid *asn1.BitString) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	GroupCheckMember(ctx context.Context, group, member DN, uid *asn1.BitString) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// PKI and PMI Management

	AddPublicKeyCertificate(ctx context.Context, dn DN, cert x509.Certificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	AddAttributeCertificate(ctx context.Context, dn DN, acert AttributeCertificate) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Administrative Role Management

	AddAdministrativeRole(ctx context.Context, dn DN, role asn1.ObjectIdentifier) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	RemoveAdministrativeRole(ctx context.Context, dn DN, role asn1.ObjectIdentifier) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Entry Modifications

	AddAttribute(ctx context.Context, dn DN, attr Attribute) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	RemoveAttribute(ctx context.Context, dn DN, attr AttributeType) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	AddValues(ctx context.Context, dn DN, values Attribute) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	RemoveValues(ctx context.Context, dn DN, values Attribute) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	AlterValues(ctx context.Context, dn DN, attrtype AttributeType, addend int) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	ResetValue(ctx context.Context, dn DN, attr AttributeType) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	ReplaceValues(ctx context.Context, dn DN, attr Attribute) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Specific Modification Types

	AddCollectiveExclusions(ctx context.Context, dn DN, attr AttributeType) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	SetAliasedEntryName(ctx context.Context, src, dest DN) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	AddPermission(ctx context.Context, dn DN, operation, object string) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	AddHierarchicalParent(ctx context.Context, dn, parent DistinguishedName) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// General Entry Modifications

	AddObjectClass(ctx context.Context, dn DN, oc asn1.ObjectIdentifier) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	RemoveObjectClass(ctx context.Context, dn DN, oc asn1.ObjectIdentifier) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Operational Attribute Modifications
	SetCreateTimestamp(ctx context.Context, dn DN, ts time.Time) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	SetModifyTimestamp(ctx context.Context, dn DN, ts time.Time) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	SetCreatorsName(ctx context.Context, dn, creator DN) (resp X500OpOutcome, result *ModifyEntryResultData, err error)
	SetModifiersName(ctx context.Context, dn, modifier DN) (resp X500OpOutcome, result *ModifyEntryResultData, err error)

	// Miscellaneous Utilities
	GetDSAinfo(ctx context.Context) (info DSAInfo, err error)
}

// Other functions
// CreateACIThatForbids(user DN, )
func CreateSubtreeSpecification(base DN, spex []asn1.RawValue, min, max int, filter *Refinement) SubtreeSpecification {
	// TODO:
}

func CreatePresentationAddressFromURL(url string) PresentationAddress {

}
