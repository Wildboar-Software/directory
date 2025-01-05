package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	CommonArguments ::= SET {
//	  serviceControls      [30]  ServiceControls    DEFAULT {},
//	  securityParameters   [29]  SecurityParameters OPTIONAL,
//	  requestor            [28]  DistinguishedName  OPTIONAL,
//	  operationProgress    [27]  OperationProgress
//	                             DEFAULT {nameResolutionPhase notStarted},
//	  aliasedRDNs          [26]  INTEGER            OPTIONAL,
//	  criticalExtensions   [25]  BIT STRING         OPTIONAL,
//	  referenceType        [24]  ReferenceType      OPTIONAL,
//	  entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
//	  exclusions           [22]  Exclusions         OPTIONAL,
//	  nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
//	  operationContexts    [20]  ContextSelection   OPTIONAL,
//	  familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
//	  ... }
type CommonArguments struct {
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	CommonArgumentsSeq ::= SEQUENCE {
//	  serviceControls      [30]  ServiceControls    DEFAULT {},
//	  securityParameters   [29]  SecurityParameters OPTIONAL,
//	  requestor            [28]  DistinguishedName  OPTIONAL,
//	  operationProgress    [27]  OperationProgress
//	                             DEFAULT {nameResolutionPhase notStarted},
//	  aliasedRDNs          [26]  INTEGER            OPTIONAL,
//	  criticalExtensions   [25]  BIT STRING         OPTIONAL,
//	  referenceType        [24]  ReferenceType      OPTIONAL,
//	  entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
//	  exclusions           [22]  Exclusions         OPTIONAL,
//	  nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
//	  operationContexts    [20]  ContextSelection   OPTIONAL,
//	  familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
//	  ... }
type CommonArgumentsSeq struct {
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	FamilyGrouping ::= ENUMERATED {
//	  entryOnly     (1),
//	  compoundEntry (2),
//	  strands       (3),
//	  multiStrand   (4),
//	  ... }
type FamilyGrouping = asn1.Enumerated

const (
	FamilyGrouping_EntryOnly     FamilyGrouping = 1
	FamilyGrouping_CompoundEntry FamilyGrouping = 2
	FamilyGrouping_Strands       FamilyGrouping = 3
	FamilyGrouping_MultiStrand   FamilyGrouping = 4
)

// # ASN.1 Definition:
//
//	CommonResults ::= SET {
//	  securityParameters  [30]  SecurityParameters  OPTIONAL,
//	  performer           [29]  DistinguishedName   OPTIONAL,
//	  aliasDereferenced   [28]  BOOLEAN             DEFAULT FALSE,
//	  notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
//	                            {{SupportedAttributes}} OPTIONAL,
//	  ... }
type CommonResults struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	CommonResultsSeq ::= SEQUENCE {
//	  securityParameters  [30]  SecurityParameters OPTIONAL,
//	  performer           [29]  DistinguishedName OPTIONAL,
//	  aliasDereferenced   [28]  BOOLEAN DEFAULT FALSE,
//	  notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
//	                            {{SupportedAttributes}} OPTIONAL,
//	  ... }
type CommonResultsSeq struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ServiceControls ::= SET {
//	  options              [0]  ServiceControlOptions DEFAULT {},
//	  priority             [1]  INTEGER {low(0), medium(1), high(2)} DEFAULT medium,
//	  timeLimit            [2]  INTEGER OPTIONAL,
//	  sizeLimit            [3]  INTEGER OPTIONAL,
//	  scopeOfReferral      [4]  INTEGER {dmd(0), country(1)} OPTIONAL,
//	  attributeSizeLimit   [5]  INTEGER OPTIONAL,
//	  manageDSAITPlaneRef  [6]  SEQUENCE {
//	    dsaName                   Name,
//	    agreementID               AgreementID,
//	    ...} OPTIONAL,
//	  serviceType          [7]  OBJECT IDENTIFIER OPTIONAL,
//	  userClass            [8]  INTEGER OPTIONAL,
//	  ... }
type ServiceControls struct {
	Options             ServiceControlOptions               `asn1:"optional,explicit,tag:0"`
	Priority            ServiceControls_priority            `asn1:"optional,explicit,tag:1,default:1"`
	TimeLimit           int                                 `asn1:"optional,explicit,tag:2"`
	SizeLimit           int                                 `asn1:"optional,explicit,tag:3"`
	ScopeOfReferral     ServiceControls_scopeOfReferral     `asn1:"optional,explicit,tag:4"`
	AttributeSizeLimit  int                                 `asn1:"optional,explicit,tag:5"`
	ManageDSAITPlaneRef ServiceControls_manageDSAITPlaneRef `asn1:"optional,explicit,tag:6"`
	ServiceType         asn1.ObjectIdentifier               `asn1:"optional,explicit,tag:7"`
	UserClass           int                                 `asn1:"optional,explicit,tag:8"`
}

// # ASN.1 Definition:
//
//	ServiceControlOptions ::= BIT STRING {
//	  preferChaining          (0),
//	  chainingProhibited      (1),
//	  localScope              (2),
//	  dontUseCopy             (3),
//	  dontDereferenceAliases  (4),
//	  subentries              (5),
//	  copyShallDo             (6),
//	  partialNameResolution   (7),
//	  manageDSAIT             (8),
//	  noSubtypeMatch          (9),
//	  noSubtypeSelection      (10),
//	  countFamily             (11),
//	  dontSelectFriends       (12),
//	  dontMatchFriends        (13),
//	  allowWriteableCopy      (14)}
type ServiceControlOptions = asn1.BitString

const ServiceControlOptions_PreferChaining int32 = 0

const ServiceControlOptions_ChainingProhibited int32 = 1

const ServiceControlOptions_LocalScope int32 = 2

const ServiceControlOptions_DontUseCopy int32 = 3

const ServiceControlOptions_DontDereferenceAliases int32 = 4

const ServiceControlOptions_Subentries int32 = 5

const ServiceControlOptions_CopyShallDo int32 = 6

const ServiceControlOptions_PartialNameResolution int32 = 7

const ServiceControlOptions_ManageDSAIT int32 = 8

const ServiceControlOptions_NoSubtypeMatch int32 = 9

const ServiceControlOptions_NoSubtypeSelection int32 = 10

const ServiceControlOptions_CountFamily int32 = 11

const ServiceControlOptions_DontSelectFriends int32 = 12

const ServiceControlOptions_DontMatchFriends int32 = 13

const ServiceControlOptions_AllowWriteableCopy int32 = 14

// # ASN.1 Definition:
//
//	EntryInformationSelection ::= SET {
//	  attributes                     CHOICE {
//	    allUserAttributes         [0]  NULL,
//	    select                    [1]  SET OF AttributeType
//	    -- empty set implies no attributes are requested -- } DEFAULT allUserAttributes:NULL,
//	    infoTypes               [2]  INTEGER {
//	      attributeTypesOnly        (0),
//	      attributeTypesAndValues   (1)} DEFAULT attributeTypesAndValues,
//	  extraAttributes                CHOICE {
//	    allOperationalAttributes  [3]  NULL,
//	    select                    [4]  SET SIZE (1..MAX) OF AttributeType } OPTIONAL,
//	  contextSelection               ContextSelection OPTIONAL,
//	  returnContexts                 BOOLEAN DEFAULT FALSE,
//	  familyReturn                   FamilyReturn DEFAULT
//	                                   {memberSelect contributingEntriesOnly} }
type EntryInformationSelection struct {
	Attributes       EntryInformationSelection_attributes      `asn1:"optional"`
	InfoTypes        EntryInformationSelection_infoTypes       `asn1:"optional,explicit,tag:2"`
	ExtraAttributes  EntryInformationSelection_extraAttributes `asn1:"optional"`
	ContextSelection ContextSelection                          `asn1:"optional"`
	ReturnContexts   bool                                      `asn1:"optional"`
	FamilyReturn     FamilyReturn                              `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ContextSelection ::= CHOICE {
//	  allContexts       NULL,
//	  selectedContexts  SET SIZE (1..MAX) OF TypeAndContextAssertion,
//	  ... }
type ContextSelection = asn1.RawValue

// # ASN.1 Definition:
//
//	TypeAndContextAssertion ::= SEQUENCE {
//	  type               AttributeType,
//	  contextAssertions  CHOICE {
//	    preference         SEQUENCE OF ContextAssertion,
//	    all                SET OF ContextAssertion,
//	    ...},
//	  ... }
type TypeAndContextAssertion struct {
	Type              AttributeType
	ContextAssertions TypeAndContextAssertion_contextAssertions
}

// # ASN.1 Definition:
//
//	FamilyReturn ::= SEQUENCE {
//	  memberSelect   ENUMERATED {
//	    contributingEntriesOnly   (1),
//	    participatingEntriesOnly  (2),
//	    compoundEntry             (3),
//	    ...},
//	  familySelect   SEQUENCE SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//	  ... }
type FamilyReturn struct {
	MemberSelect FamilyReturn_memberSelect
	FamilySelect [](asn1.ObjectIdentifier) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	EntryInformation ::= SEQUENCE {
//	  name                  Name,
//	  fromEntry             BOOLEAN DEFAULT TRUE,
//	  information           SET SIZE (1..MAX) OF CHOICE {
//	    attributeType         AttributeType,
//	    attribute             Attribute{{SupportedAttributes}},
//	    ...} OPTIONAL,
//	  incompleteEntry  [3]  BOOLEAN DEFAULT FALSE,
//	  partialName      [4]  BOOLEAN DEFAULT FALSE,
//	  derivedEntry     [5]  BOOLEAN DEFAULT FALSE,
//	  ... }
type EntryInformation struct {
	Name            Name
	FromEntry       bool                                  `asn1:"optional"`
	Information     [](EntryInformation_information_Item) `asn1:"optional,set"`
	IncompleteEntry bool                                  `asn1:"optional,explicit,tag:3"`
	PartialName     bool                                  `asn1:"optional,explicit,tag:4"`
	DerivedEntry    bool                                  `asn1:"optional,explicit,tag:5"`
}

// # ASN.1 Definition:
//
//	FamilyEntries ::= SEQUENCE {
//	  family-class   OBJECT-CLASS.&id, -- structural object class value
//	  familyEntries  SEQUENCE OF FamilyEntry,
//	  ... }
type FamilyEntries struct {
	Family_class  asn1.ObjectIdentifier
	FamilyEntries [](FamilyEntry)
}

// # ASN.1 Definition:
//
//	FamilyEntry ::= SEQUENCE {
//	  rdn            RelativeDistinguishedName,
//	  information    SEQUENCE OF CHOICE {
//	    attributeType  AttributeType,
//	    attribute      Attribute{{SupportedAttributes}},
//	    ...},
//	  family-info    SEQUENCE SIZE (1..MAX) OF FamilyEntries OPTIONAL,
//	  ... }
type FamilyEntry struct {
	Rdn         RelativeDistinguishedName
	Information [](FamilyEntry_information_Item)
	Family_info [](FamilyEntries) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Filter ::= CHOICE {
//	  item  [0]  FilterItem,
//	  and   [1]  SET OF Filter,
//	  or    [2]  SET OF Filter,
//	  not   [3]  Filter,
//	  ... }
type Filter = asn1.RawValue

// # ASN.1 Definition:
//
//	FilterItem ::= CHOICE {
//	  equality          [0]  AttributeValueAssertion,
//	  substrings        [1]  SEQUENCE {
//	    type                   ATTRIBUTE.&id({SupportedAttributes}),
//	    strings                SEQUENCE OF CHOICE {
//	      initial           [0]  ATTRIBUTE.&Type
//	                              ({SupportedAttributes}{@substrings.type}),
//	      any               [1]  ATTRIBUTE.&Type
//	                              ({SupportedAttributes}{@substrings.type}),
//	      final             [2]  ATTRIBUTE.&Type
//	                              ({SupportedAttributes}{@substrings.type}),
//	      control                Attribute{{SupportedAttributes}},
//	                    -- Used to specify interpretation of following items
//	      ... },
//	    ... },
//	  greaterOrEqual    [2]  AttributeValueAssertion,
//	  lessOrEqual       [3]  AttributeValueAssertion,
//	  present           [4]  AttributeType,
//	  approximateMatch  [5]  AttributeValueAssertion,
//	  extensibleMatch   [6]  MatchingRuleAssertion,
//	  contextPresent    [7]  AttributeTypeAssertion,
//	  ... }
type FilterItem = asn1.RawValue

// # ASN.1 Definition:
//
//	MatchingRuleAssertion ::= SEQUENCE {
//	  matchingRule  [1]  SET SIZE (1..MAX) OF MATCHING-RULE.&id,
//	  type          [2]  AttributeType OPTIONAL,
//	  matchValue    [3]  MATCHING-RULE.&AssertionType (CONSTRAINED BY {
//	    -- matchValue shall be a value of  type specified by the &AssertionType field of
//	    -- one of the MATCHING-RULE information objects identified by matchingRule -- }),
//	  dnAttributes  [4]  BOOLEAN DEFAULT FALSE,
//	  ... }
type MatchingRuleAssertion struct {
	MatchingRule [](asn1.ObjectIdentifier) `asn1:"explicit,tag:1,set"`
	Type         AttributeType             `asn1:"optional,explicit,tag:2"`
	MatchValue   asn1.RawValue             `asn1:"explicit,tag:3"`
	DnAttributes bool                      `asn1:"optional,explicit,tag:4"`
}

// # ASN.1 Definition:
//
//	PagedResultsRequest ::= CHOICE {
//	  newRequest         SEQUENCE {
//	    pageSize           INTEGER,
//	    sortKeys           SEQUENCE SIZE (1..MAX) OF SortKey OPTIONAL,
//	    reverse       [1]  BOOLEAN DEFAULT FALSE,
//	    unmerged      [2]  BOOLEAN DEFAULT FALSE,
//	    pageNumber    [3]  INTEGER OPTIONAL,
//	    ...},
//	  queryReference     OCTET STRING,
//	  abandonQuery  [0]  OCTET STRING,
//	  ... }
type PagedResultsRequest = asn1.RawValue

// # ASN.1 Definition:
//
//	SortKey ::= SEQUENCE {
//	  type          AttributeType,
//	  orderingRule  MATCHING-RULE.&id OPTIONAL,
//	  ... }
type SortKey struct {
	Type         AttributeType
	OrderingRule asn1.ObjectIdentifier `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	SecurityParameters ::= SET {
//	  certification-path          [0]  CertificationPath OPTIONAL,
//	  name                        [1]  DistinguishedName OPTIONAL,
//	  time                        [2]  Time OPTIONAL,
//	  random                      [3]  BIT STRING OPTIONAL,
//	  target                      [4]  ProtectionRequest OPTIONAL,
//	  --                          [5]  Not to be used
//	  operationCode               [6]  Code OPTIONAL,
//	  --                          [7]  Not to be used
//	  errorProtection             [8]  ErrorProtectionRequest OPTIONAL,
//	  errorCode                   [9]  Code OPTIONAL,
//	  ... }
type SecurityParameters struct {
	Certification_path CertificationPath      `asn1:"optional,explicit,tag:0"`
	Name               DistinguishedName      `asn1:"optional,explicit,tag:1"`
	Time               Time                   `asn1:"optional,explicit,tag:2"`
	Random             asn1.BitString         `asn1:"optional,explicit,tag:3"`
	Target             ProtectionRequest      `asn1:"optional,explicit,tag:4"`
	OperationCode      Code                   `asn1:"optional,explicit,tag:6"`
	ErrorProtection    ErrorProtectionRequest `asn1:"optional,explicit,tag:8"`
	ErrorCode          Code                   `asn1:"optional,explicit,tag:9"`
}

// # ASN.1 Definition:
//
//	ProtectionRequest ::= INTEGER {none(0), signed(1)}
type ProtectionRequest = int64

const ProtectionRequest_None ProtectionRequest = 0

const ProtectionRequest_Signed ProtectionRequest = 1

// # ASN.1 Definition:
//
//	Time ::= CHOICE {
//	  utcTime          UTCTime,
//	  generalizedTime  GeneralizedTime,
//	  ... }
//
// type Time = asn1.RawValue
// # ASN.1 Definition:
//
//	ErrorProtectionRequest ::= INTEGER {none(0), signed(1)}
type ErrorProtectionRequest = int64

const ErrorProtectionRequest_None ErrorProtectionRequest = 0

const ErrorProtectionRequest_Signed ErrorProtectionRequest = 1

// # ASN.1 Definition:
//
//	DirectoryBindArgument ::= SET {
//	  credentials  [0]  Credentials OPTIONAL,
//	  versions     [1]  Versions DEFAULT {v1},
//	  ... }
type DirectoryBindArgument struct {
	Credentials Credentials `asn1:"optional,explicit,tag:0"`
	Versions    Versions    `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	Credentials ::= CHOICE {
//	  simple             [0]  SimpleCredentials,
//	  strong             [1]  StrongCredentials,
//	  externalProcedure  [2]  EXTERNAL,
//	  spkm               [3]  SpkmCredentials,
//	  sasl               [4]  SaslCredentials,
//	  ... }
type Credentials = asn1.RawValue

// # ASN.1 Definition:
//
//	SimpleCredentials ::= SEQUENCE {
//	  name      [0]  DistinguishedName,
//	  validity  [1]  SET {
//	    time1     [0]  CHOICE {
//	      utc            UTCTime,
//	      gt             GeneralizedTime} OPTIONAL,
//	    time2     [1]  CHOICE {
//	      utc            UTCTime,
//	      gt             GeneralizedTime} OPTIONAL,
//	    random1   [2]  BIT STRING OPTIONAL,
//	    random2   [3]  BIT STRING OPTIONAL} OPTIONAL,
//	  password  [2]  CHOICE {
//	    unprotected    OCTET STRING,
//	    protected      HASH{OCTET STRING},
//	    ...,
//	    userPwd   [0]  UserPwd } OPTIONAL }
type SimpleCredentials struct {
	Name     DistinguishedName          `asn1:"explicit,tag:0"`
	Validity SimpleCredentials_validity `asn1:"optional,explicit,tag:1"`
	Password SimpleCredentials_password `asn1:"optional,explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	StrongCredentials ::= SET {
//	  certification-path          [0]  CertificationPath OPTIONAL,
//	  bind-token                  [1]  Token,
//	  name                        [2]  DistinguishedName OPTIONAL,
//	  attributeCertificationPath  [3]  AttributeCertificationPath OPTIONAL,
//	  ... }
type StrongCredentials struct {
	Certification_path         CertificationPath          `asn1:"optional,explicit,tag:0"`
	Bind_token                 Token                      `asn1:"explicit,tag:1"`
	Name                       DistinguishedName          `asn1:"optional,explicit,tag:2"`
	AttributeCertificationPath AttributeCertificationPath `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	SpkmCredentials ::= CHOICE {
//	  req            [0]  SPKM-REQ,
//	  rep            [1]  SPKM-REP-TI,
//	  ... }
type SpkmCredentials = asn1.RawValue

// # ASN.1 Definition:
//
//	SaslCredentials ::= SEQUENCE {
//	  mechanism    [0]  DirectoryString{ub-saslMechanism},
//	  credentials  [1]  OCTET STRING OPTIONAL,
//	  saslAbort    [2]  BOOLEAN DEFAULT FALSE,
//	  ... }
type SaslCredentials struct {
	Mechanism   DirectoryString `asn1:"explicit,tag:0"`
	Credentials []byte          `asn1:"optional,explicit,tag:1"`
	SaslAbort   bool            `asn1:"optional,explicit,tag:2"`
}

// # ASN.1 Definition:
//
//   ub-saslMechanism INTEGER ::= 20
//
//
// const Ub_saslMechanism int = 20

// # ASN.1 Definition:
//
//	Token ::= SIGNED{TokenContent}
type Token = SIGNED

// # ASN.1 Definition:
//
//	TokenContent ::= SEQUENCE {
//	  algorithm  [0]  AlgorithmIdentifier{{SupportedAlgorithms}},
//	  name       [1]  DistinguishedName,
//	  time       [2]  Time,
//	  random     [3]  BIT STRING,
//	  response   [4]  BIT STRING OPTIONAL,
//	  ... }
type TokenContent struct {
	Algorithm pkix.AlgorithmIdentifier `asn1:"explicit,tag:0"`
	Name      DistinguishedName        `asn1:"explicit,tag:1"`
	Time      Time                     `asn1:"explicit,tag:2"`
	Random    asn1.BitString           `asn1:"explicit,tag:3"`
	Response  asn1.BitString           `asn1:"optional,explicit,tag:4"`
}

// # ASN.1 Definition:
//
//	Versions ::= BIT STRING {v1(0), v2(1)}
type Versions = asn1.BitString

const Versions_V1 int32 = 0

const Versions_V2 int32 = 1

// # ASN.1 Definition:
//
//	DirectoryBindResult ::= SET {
//	  credentials       [0]  Credentials OPTIONAL,
//	  versions          [1]  Versions DEFAULT {v1},
//	  ...,
//	  pwdResponseValue  [2]  PwdResponseValue OPTIONAL }
type DirectoryBindResult struct {
	Credentials      Credentials       `asn1:"optional,explicit,tag:0"`
	Versions         Versions          `asn1:"optional,explicit,tag:1"`
	PwdResponseValue *PwdResponseValue `asn1:"optional,explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	PwdResponseValue ::= SEQUENCE {
//	  warning CHOICE {
//	    timeLeft        [0]  INTEGER (0..MAX),
//	    graceRemaining  [1]  INTEGER (0..MAX),
//	    ... } OPTIONAL,
//	  error   ENUMERATED {
//	    passwordExpired  (0),
//	    changeAfterReset (1),
//	    ... } OPTIONAL}
type PwdResponseValue struct {
	Warning PwdResponseValue_warning `asn1:"optional"`
	Error   *PwdResponseValue_error  `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1 ::= SET {
//	  versions              [0]  Versions DEFAULT {v1},
//	  error                      CHOICE {
//	    serviceError          [1]  ServiceProblem,
//	    securityError         [2]  SecurityProblem,
//	    ...},
//	  securityParameters    [30]  SecurityParameters OPTIONAL }
type DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 struct {
	Versions           Versions `asn1:"optional,explicit,tag:0"`
	Error              DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
}

// # ASN.1 Definition:
//
//	BindKeyInfo ::= ENCRYPTED{BIT STRING}
type BindKeyInfo = ENCRYPTED

// # ASN.1 Definition:
//
//	ReadArgument ::= OPTIONALLY-PROTECTED { ReadArgumentData }
type ReadArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ReadArgumentData ::= SET {
//	  object               [0]  Name,
//	  selection            [1]  EntryInformationSelection DEFAULT {},
//	  modifyRightsRequest  [2]  BOOLEAN DEFAULT FALSE,
//	  ...,
//	  ...,
//	  COMPONENTS OF             CommonArguments }
type ReadArgumentData struct {
	Object              Name                      `asn1:"explicit,tag:0"`
	Selection           EntryInformationSelection `asn1:"optional,explicit,tag:1"`
	ModifyRightsRequest bool                      `asn1:"optional,explicit,tag:2"`
	ServiceControls     ServiceControls           `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters        `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName         `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress         `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                       `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString            `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType             `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool                      `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions                `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool                      `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection          `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping            `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	ReadResult ::= OPTIONALLY-PROTECTED { ReadResultData }
type ReadResult = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ReadResultData ::= SET {
//	  entry         [0]  EntryInformation,
//	  modifyRights  [1]  ModifyRights OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonResults }
type ReadResultData struct {
	Entry              EntryInformation   `asn1:"explicit,tag:0"`
	ModifyRights       ModifyRights       `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ModifyRights ::= SET OF SEQUENCE {
//	  item      CHOICE {
//	    entry      [0]  NULL,
//	    attribute  [1]  AttributeType,
//	    value      [2]  AttributeValueAssertion,
//	    ...},
//	  permission   [3]  BIT STRING {
//	    add     (0),
//	    remove  (1),
//	    rename  (2),
//	    move    (3)},
//	  ... }
type ModifyRights = [](ModifyRights_Item)

// # ASN.1 Definition:
//
//	CompareArgument ::= OPTIONALLY-PROTECTED { CompareArgumentData }
type CompareArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	CompareArgumentData ::= SET {
//	  object       [0]  Name,
//	  purported    [1]  AttributeValueAssertion,
//	  ...,
//	  ...,
//	  COMPONENTS OF     CommonArguments }
type CompareArgumentData struct {
	Object              Name                    `asn1:"explicit,tag:0"`
	Purported           AttributeValueAssertion `asn1:"explicit,tag:1"`
	ServiceControls     ServiceControls         `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters      `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName       `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress       `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                     `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString          `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType           `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool                    `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions              `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool                    `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection        `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping          `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	CompareResult ::= OPTIONALLY-PROTECTED { CompareResultData }
type CompareResult = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	CompareResultData ::= SET {
//	  name                 Name OPTIONAL,
//	  matched         [0]  BOOLEAN,
//	  fromEntry       [1]  BOOLEAN DEFAULT TRUE,
//	  matchedSubtype  [2]  AttributeType OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF        CommonResults }
type CompareResultData struct {
	Name               Name               `asn1:"optional"`
	Matched            bool               `asn1:"explicit,tag:0"`
	FromEntry          bool               `asn1:"optional,explicit,tag:1"`
	MatchedSubtype     AttributeType      `asn1:"optional,explicit,tag:2"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AbandonArgument ::= OPTIONALLY-PROTECTED-SEQ { AbandonArgumentData }
type AbandonArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	AbandonArgumentData ::= SEQUENCE {
//	  invokeID  [0]  InvokeId,
//	  ... }
type AbandonArgumentData struct {
	InvokeID InvokeId `asn1:"explicit,tag:0"`
}

// # ASN.1 Definition:
//
//	AbandonResult ::= CHOICE {
//	  null          NULL,
//	  information   OPTIONALLY-PROTECTED-SEQ { AbandonResultData },
//	  ... }
type AbandonResult = asn1.RawValue

// # ASN.1 Definition:
//
//	AbandonResultData ::= SEQUENCE {
//	  invokeID      InvokeId,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type AbandonResultData struct {
	InvokeID           InvokeId
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ListArgument ::= OPTIONALLY-PROTECTED { ListArgumentData }
type ListArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ListArgumentData ::= SET {
//	  object        [0]  Name,
//	  pagedResults  [1]  PagedResultsRequest OPTIONAL,
//	  listFamily    [2]  BOOLEAN DEFAULT FALSE,
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonArguments
//	  }
type ListArgumentData struct {
	Object              Name                `asn1:"explicit,tag:0"`
	PagedResults        PagedResultsRequest `asn1:"optional,explicit,tag:1"`
	ListFamily          bool                `asn1:"optional,explicit,tag:2"`
	ServiceControls     ServiceControls     `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters  `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName   `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress   `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                 `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString      `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType       `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool                `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions          `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool                `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection    `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping      `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	ListResult ::= OPTIONALLY-PROTECTED { ListResultData }
type ListResult = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ListResultData ::= CHOICE {
//	  listInfo                     SET {
//	    name                         Name OPTIONAL,
//	    subordinates            [1]  SET OF SEQUENCE {
//	      rdn                          RelativeDistinguishedName,
//	      aliasEntry              [0]  BOOLEAN DEFAULT FALSE,
//	      fromEntry               [1]  BOOLEAN DEFAULT TRUE,
//	      ... },
//	    partialOutcomeQualifier [2]  PartialOutcomeQualifier OPTIONAL,
//	    ...,
//	    ...,
//	    COMPONENTS OF                CommonResults
//	    },
//	  uncorrelatedListInfo    [0]  SET OF ListResult,
//	  ... }
type ListResultData = asn1.RawValue

// # ASN.1 Definition:
//
//	PartialOutcomeQualifier ::= SET {
//	  limitProblem                  [0]  LimitProblem OPTIONAL,
//	  unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
//	  unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
//	  unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
//	  queryReference                [4]  OCTET STRING OPTIONAL,
//	  overspecFilter                [5]  Filter OPTIONAL,
//	  notification                  [6]  SEQUENCE SIZE (1..MAX) OF
//	                                       Attribute{{SupportedAttributes}} OPTIONAL,
//	  entryCount                         CHOICE {
//	    bestEstimate                  [7]  INTEGER,
//	    lowEstimate                   [8]  INTEGER,
//	    exact                         [9]  INTEGER,
//	    ...} OPTIONAL
//	  --                            [10] Not to be used -- }
type PartialOutcomeQualifier struct {
	LimitProblem                  LimitProblem                       `asn1:"optional,explicit,tag:0"`
	Unexplored                    [](ContinuationReference)          `asn1:"optional,explicit,tag:1,set"`
	UnavailableCriticalExtensions bool                               `asn1:"optional,explicit,tag:2"`
	UnknownErrors                 [](asn1.RawValue)                  `asn1:"optional,explicit,tag:3,set"`
	QueryReference                []byte                             `asn1:"optional,explicit,tag:4"`
	OverspecFilter                Filter                             `asn1:"optional,explicit,tag:5"`
	Notification                  [](Attribute)                      `asn1:"optional,explicit,tag:6"`
	EntryCount                    PartialOutcomeQualifier_entryCount `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	LimitProblem ::= INTEGER {
//	  timeLimitExceeded           (0),
//	  sizeLimitExceeded           (1),
//	  administrativeLimitExceeded (2) }
type LimitProblem = int64

const LimitProblem_TimeLimitExceeded LimitProblem = 0

const LimitProblem_SizeLimitExceeded LimitProblem = 1

const LimitProblem_AdministrativeLimitExceeded LimitProblem = 2

// # ASN.1 Definition:
//
//	SearchArgument ::= OPTIONALLY-PROTECTED { SearchArgumentData }
type SearchArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	SearchArgumentData ::= SET {
//	  baseObject            [0]  Name,
//	  subset                [1]  INTEGER {
//	    baseObject    (0),
//	    oneLevel      (1),
//	    wholeSubtree  (2)} DEFAULT baseObject,
//	  filter                [2]  Filter DEFAULT and:{},
//	  searchAliases         [3]  BOOLEAN DEFAULT TRUE,
//	  selection             [4]  EntryInformationSelection DEFAULT {},
//	  pagedResults          [5]  PagedResultsRequest OPTIONAL,
//	  matchedValuesOnly     [6]  BOOLEAN DEFAULT FALSE,
//	  extendedFilter        [7]  Filter OPTIONAL,
//	  checkOverspecified    [8]  BOOLEAN DEFAULT FALSE,
//	  relaxation            [9]  RelaxationPolicy OPTIONAL,
//	  extendedArea          [10] INTEGER OPTIONAL,
//	  hierarchySelections   [11] HierarchySelections DEFAULT {self},
//	  searchControlOptions  [12] SearchControlOptions DEFAULT {searchAliases},
//	  joinArguments         [13] SEQUENCE SIZE (1..MAX) OF JoinArgument OPTIONAL,
//	  joinType              [14] ENUMERATED {
//	    innerJoin      (0),
//	    leftOuterJoin  (1),
//	    fullOuterJoin  (2)} DEFAULT leftOuterJoin,
//	  ...,
//	  ...,
//	  COMPONENTS OF              CommonArguments }
type SearchArgumentData struct {
	BaseObject           Name                        `asn1:"explicit,tag:0"`
	Subset               SearchArgumentData_subset   `asn1:"optional,explicit,tag:1,default:0"`
	Filter               Filter                      `asn1:"optional,explicit,tag:2"`
	SearchAliases        bool                        `asn1:"optional,explicit,tag:3"`
	Selection            EntryInformationSelection   `asn1:"optional,explicit,tag:4"`
	PagedResults         PagedResultsRequest         `asn1:"optional,explicit,tag:5"`
	MatchedValuesOnly    bool                        `asn1:"optional,explicit,tag:6"`
	ExtendedFilter       Filter                      `asn1:"optional,explicit,tag:7"`
	CheckOverspecified   bool                        `asn1:"optional,explicit,tag:8"`
	Relaxation           RelaxationPolicy            `asn1:"optional,explicit,tag:9"`
	ExtendedArea         int                         `asn1:"optional,explicit,tag:10"`
	HierarchySelections  HierarchySelections         `asn1:"optional,explicit,tag:11"`
	SearchControlOptions SearchControlOptions        `asn1:"optional,explicit,tag:12"`
	JoinArguments        [](JoinArgument)            `asn1:"optional,explicit,tag:13"`
	JoinType             SearchArgumentData_joinType `asn1:"optional,explicit,tag:14,default:1"`
	ServiceControls      ServiceControls             `asn1:"optional,explicit,tag:30"`
	SecurityParameters   SecurityParameters          `asn1:"optional,explicit,tag:29"`
	Requestor            DistinguishedName           `asn1:"optional,explicit,tag:28"`
	OperationProgress    OperationProgress           `asn1:"optional,explicit,tag:27"`
	AliasedRDNs          int                         `asn1:"optional,explicit,tag:26"`
	CriticalExtensions   asn1.BitString              `asn1:"optional,explicit,tag:25"`
	ReferenceType        ReferenceType               `asn1:"optional,explicit,tag:24"`
	EntryOnly            bool                        `asn1:"optional,explicit,tag:23"`
	Exclusions           Exclusions                  `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster  bool                        `asn1:"optional,explicit,tag:21"`
	OperationContexts    ContextSelection            `asn1:"optional,explicit,tag:20"`
	FamilyGrouping       FamilyGrouping              `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	HierarchySelections ::= BIT STRING {
//	  self                  (0),
//	  children              (1),
//	  parent                (2),
//	  hierarchy             (3),
//	  top                   (4),
//	  subtree               (5),
//	  siblings              (6),
//	  siblingChildren       (7),
//	  siblingSubtree        (8),
//	  all                   (9) }
type HierarchySelections = asn1.BitString

const HierarchySelections_Self int32 = 0

const HierarchySelections_Children int32 = 1

const HierarchySelections_Parent int32 = 2

const HierarchySelections_Hierarchy int32 = 3

const HierarchySelections_Top int32 = 4

const HierarchySelections_Subtree int32 = 5

const HierarchySelections_Siblings int32 = 6

const HierarchySelections_SiblingChildren int32 = 7

const HierarchySelections_SiblingSubtree int32 = 8

const HierarchySelections_All int32 = 9

// # ASN.1 Definition:
//
//	SearchControlOptions ::= BIT STRING {
//	  searchAliases         (0),
//	  matchedValuesOnly     (1),
//	  checkOverspecified    (2),
//	  performExactly        (3),
//	  includeAllAreas       (4),
//	  noSystemRelaxation    (5),
//	  dnAttribute           (6),
//	  matchOnResidualName   (7),
//	  entryCount            (8),
//	  useSubset             (9),
//	  separateFamilyMembers (10),
//	  searchFamily          (11) }
type SearchControlOptions = asn1.BitString

const SearchControlOptions_SearchAliases int32 = 0

const SearchControlOptions_MatchedValuesOnly int32 = 1

const SearchControlOptions_CheckOverspecified int32 = 2

const SearchControlOptions_PerformExactly int32 = 3

const SearchControlOptions_IncludeAllAreas int32 = 4

const SearchControlOptions_NoSystemRelaxation int32 = 5

const SearchControlOptions_DnAttribute int32 = 6

const SearchControlOptions_MatchOnResidualName int32 = 7

const SearchControlOptions_EntryCount int32 = 8

const SearchControlOptions_UseSubset int32 = 9

const SearchControlOptions_SeparateFamilyMembers int32 = 10

const SearchControlOptions_SearchFamily int32 = 11

// # ASN.1 Definition:
//
//	JoinArgument ::= SEQUENCE {
//	  joinBaseObject  [0]  Name,
//	  domainLocalID   [1]  DomainLocalID OPTIONAL,
//	  joinSubset      [2]  ENUMERATED {
//	    baseObject   (0),
//	    oneLevel     (1),
//	    wholeSubtree (2),
//	    ... } DEFAULT baseObject,
//	  joinFilter      [3]  Filter OPTIONAL,
//	  joinAttributes  [4]  SEQUENCE SIZE (1..MAX) OF JoinAttPair OPTIONAL,
//	  joinSelection   [5]  EntryInformationSelection,
//	  ... }
type JoinArgument struct {
	JoinBaseObject Name                      `asn1:"explicit,tag:0"`
	DomainLocalID  DomainLocalID             `asn1:"optional,explicit,tag:1"`
	JoinSubset     JoinArgument_joinSubset   `asn1:"optional,explicit,tag:2,default:0"`
	JoinFilter     Filter                    `asn1:"optional,explicit,tag:3"`
	JoinAttributes [](JoinAttPair)           `asn1:"optional,explicit,tag:4"`
	JoinSelection  EntryInformationSelection `asn1:"explicit,tag:5"`
}

// # ASN.1 Definition:
//
//	DomainLocalID ::= UnboundedDirectoryString
type DomainLocalID = UnboundedDirectoryString

// # ASN.1 Definition:
//
//	JoinAttPair ::= SEQUENCE {
//	  baseAtt      AttributeType,
//	  joinAtt      AttributeType,
//	  joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
//	  ... }
type JoinAttPair struct {
	BaseAtt     AttributeType
	JoinAtt     AttributeType
	JoinContext [](JoinContextType) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	JoinContextType ::= CONTEXT.&id({SupportedContexts})
type JoinContextType = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	SearchResult ::= OPTIONALLY-PROTECTED { SearchResultData }
type SearchResult = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	SearchResultData ::= CHOICE {
//	  searchInfo                    SET {
//	    name                          Name OPTIONAL,
//	    entries                  [0]  SET OF EntryInformation,
//	    partialOutcomeQualifier  [2]  PartialOutcomeQualifier OPTIONAL,
//	    altMatching              [3]  BOOLEAN DEFAULT FALSE,
//	    ...,
//	    ...,
//	    COMPONENTS OF                 CommonResults
//	    },
//	  uncorrelatedSearchInfo   [0]  SET OF SearchResult,
//	  ... }
type SearchResultData = asn1.RawValue

// # ASN.1 Definition:
//
//	AddEntryArgument ::= OPTIONALLY-PROTECTED { AddEntryArgumentData }
type AddEntryArgument = OPTIONALLY_PROTECTED

// WARNING: If you encounter a bug encoding or decoding, it is probably the
// Entry field, which may need to be a `[]pkix.AttributeTypeAndValueSET`.
//
// # ASN.1 Definition:
//
//	AddEntryArgumentData ::= SET {
//	  object        [0]  Name,
//	  entry         [1]  SET OF Attribute{{SupportedAttributes}},
//	  targetSystem  [2]  AccessPoint OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonArguments }
type AddEntryArgumentData struct {
	Object              Name               `asn1:"explicit,tag:0"`
	Entry               [](Attribute)      `asn1:"explicit,tag:1,set"`
	TargetSystem        AccessPoint        `asn1:"optional,explicit,tag:2"`
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	AddEntryResult ::= CHOICE {
//	  null          NULL,
//	  information   OPTIONALLY-PROTECTED-SEQ { AddEntryResultData },
//	  ... }
type AddEntryResult = asn1.RawValue

// # ASN.1 Definition:
//
//	AddEntryResultData ::= SEQUENCE {
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type AddEntryResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	RemoveEntryArgument ::= OPTIONALLY-PROTECTED { RemoveEntryArgumentData }
type RemoveEntryArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	RemoveEntryArgumentData ::= SET {
//	  object     [0]  Name,
//	  ...,
//	  ...,
//	  COMPONENTS OF   CommonArguments
//	  }
type RemoveEntryArgumentData struct {
	Object              Name               `asn1:"explicit,tag:0"`
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	RemoveEntryResult ::= CHOICE {
//	  null          NULL,
//	  information   OPTIONALLY-PROTECTED-SEQ { RemoveEntryResultData },
//	  ... }
type RemoveEntryResult = asn1.RawValue

// # ASN.1 Definition:
//
//	RemoveEntryResultData ::= SEQUENCE {
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type RemoveEntryResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ModifyEntryArgument ::= OPTIONALLY-PROTECTED { ModifyEntryArgumentData }
type ModifyEntryArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ModifyEntryArgumentData ::= SET {
//	  object     [0]  Name,
//	  changes    [1]  SEQUENCE OF EntryModification,
//	  selection  [2]  EntryInformationSelection OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF   CommonArguments }
type ModifyEntryArgumentData struct {
	Object              Name                      `asn1:"explicit,tag:0"`
	Changes             [](EntryModification)     `asn1:"explicit,tag:1"`
	Selection           EntryInformationSelection `asn1:"optional,explicit,tag:2"`
	ServiceControls     ServiceControls           `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters        `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName         `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress         `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                       `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString            `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType             `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool                      `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions                `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool                      `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection          `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping            `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	ModifyEntryResult ::= CHOICE {
//	  null         NULL,
//	  information  OPTIONALLY-PROTECTED-SEQ { ModifyEntryResultData },
//	  ... }
type ModifyEntryResult = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyEntryResultData ::= SEQUENCE {
//	  entry    [0]  EntryInformation OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type ModifyEntryResultData struct {
	Entry              EntryInformation   `asn1:"optional,explicit,tag:0"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	EntryModification ::= CHOICE {
//	  addAttribute     [0]  Attribute{{SupportedAttributes}},
//	  removeAttribute  [1]  AttributeType,
//	  addValues        [2]  Attribute{{SupportedAttributes}},
//	  removeValues     [3]  Attribute{{SupportedAttributes}},
//	  alterValues      [4]  AttributeTypeAndValue,
//	  resetValue       [5]  AttributeType,
//	  replaceValues    [6]  Attribute{{SupportedAttributes}},
//	  ... }
type EntryModification = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyDNArgument ::= OPTIONALLY-PROTECTED { ModifyDNArgumentData }
type ModifyDNArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	ModifyDNArgumentData ::= SET {
//	  object        [0]  DistinguishedName,
//	  newRDN        [1]  RelativeDistinguishedName,
//	  deleteOldRDN  [2]  BOOLEAN DEFAULT FALSE,
//	  newSuperior   [3]  DistinguishedName OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonArguments }
type ModifyDNArgumentData struct {
	Object              DistinguishedName         `asn1:"explicit,tag:0"`
	NewRDN              RelativeDistinguishedName `asn1:"explicit,tag:1"`
	DeleteOldRDN        bool                      `asn1:"optional,explicit,tag:2"`
	NewSuperior         DistinguishedName         `asn1:"optional,explicit,tag:3"`
	ServiceControls     ServiceControls           `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters        `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName         `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress         `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                       `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString            `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType             `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool                      `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions                `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool                      `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection          `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping            `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	ModifyDNResult ::= CHOICE {
//	  null         NULL,
//	  information  OPTIONALLY-PROTECTED-SEQ { ModifyDNResultData },
//	  ... }
type ModifyDNResult = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyDNResultData ::= SEQUENCE {
//	  newRDN        RelativeDistinguishedName,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type ModifyDNResultData struct {
	NewRDN             RelativeDistinguishedName
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ChangePasswordArgument ::= OPTIONALLY-PROTECTED-SEQ { ChangePasswordArgumentData }
type ChangePasswordArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	ChangePasswordArgumentData ::= SEQUENCE {
//	  object   [0]  DistinguishedName,
//	  oldPwd   [1]  UserPwd,
//	  newPwd   [2]  UserPwd,
//	  ... }
type ChangePasswordArgumentData struct {
	Object DistinguishedName `asn1:"explicit,tag:0"`
	OldPwd UserPwd           `asn1:"explicit,tag:1"`
	NewPwd UserPwd           `asn1:"explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	ChangePasswordResult ::= CHOICE {
//	  null        NULL,
//	  information OPTIONALLY-PROTECTED-SEQ { ChangePasswordResultData },
//	  ...}
type ChangePasswordResult = asn1.RawValue

// # ASN.1 Definition:
//
//	ChangePasswordResultData ::= SEQUENCE {
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type ChangePasswordResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AdministerPasswordArgument ::= OPTIONALLY-PROTECTED-SEQ { AdministerPasswordArgumentData }
type AdministerPasswordArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	AdministerPasswordArgumentData ::= SEQUENCE {
//	  object  [0]  DistinguishedName,
//	  newPwd  [1]  UserPwd,
//	  ... }
type AdministerPasswordArgumentData struct {
	Object DistinguishedName `asn1:"explicit,tag:0"`
	NewPwd UserPwd           `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	AdministerPasswordResult ::= CHOICE {
//	  null NULL,
//	  information OPTIONALLY-PROTECTED-SEQ { AdministerPasswordResultData },
//	  ...}
type AdministerPasswordResult = asn1.RawValue

// # ASN.1 Definition:
//
//	AdministerPasswordResultData ::= SEQUENCE {
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type AdministerPasswordResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	LdapArgument ::= OPTIONALLY-PROTECTED-SEQ { LdapArgumentData }
type LdapArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	LdapArgumentData ::= SEQUENCE {
//	  object        DistinguishedName,
//	  ldapMessage   LDAPMessage,
//	  linkId        LinkId  OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonArgumentsSeq }
type LdapArgumentData struct {
	Object              DistinguishedName
	LdapMessage         asn1.RawValue
	LinkId              LinkId             `asn1:"optional"`
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	LinkId ::= INTEGER
type LinkId = int64

// # ASN.1 Definition:
//
//	LdapResult ::= OPTIONALLY-PROTECTED-SEQ { LdapResultData }
type LdapResult = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	LdapResultData ::= SEQUENCE {
//	  ldapMessages   SEQUENCE SIZE (1..MAX) OF LDAPMessage OPTIONAL,
//	  returnToClient BOOLEAN DEFAULT FALSE,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type LdapResultData struct {
	LdapMessages       [](asn1.RawValue)  `asn1:"optional"`
	ReturnToClient     bool               `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	LinkedArgument ::= OPTIONALLY-PROTECTED-SEQ { LinkedArgumentData }
type LinkedArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	LinkedArgumentData ::= SEQUENCE {
//	  object         DistinguishedName,
//	  ldapMessage    LDAPMessage,
//	  linkId         LinkId,
//	  returnToClient BOOLEAN DEFAULT FALSE,
//	  ...,
//	  ...,
//	  COMPONENTS OF  CommonArgumentsSeq }
type LinkedArgumentData struct {
	Object              DistinguishedName
	LdapMessage         asn1.RawValue
	LinkId              LinkId
	ReturnToClient      bool               `asn1:"optional"`
	ServiceControls     ServiceControls    `asn1:"optional,explicit,tag:30"`
	SecurityParameters  SecurityParameters `asn1:"optional,explicit,tag:29"`
	Requestor           DistinguishedName  `asn1:"optional,explicit,tag:28"`
	OperationProgress   OperationProgress  `asn1:"optional,explicit,tag:27"`
	AliasedRDNs         int                `asn1:"optional,explicit,tag:26"`
	CriticalExtensions  asn1.BitString     `asn1:"optional,explicit,tag:25"`
	ReferenceType       ReferenceType      `asn1:"optional,explicit,tag:24"`
	EntryOnly           bool               `asn1:"optional,explicit,tag:23"`
	Exclusions          Exclusions         `asn1:"optional,explicit,tag:22"`
	NameResolveOnMaster bool               `asn1:"optional,explicit,tag:21"`
	OperationContexts   ContextSelection   `asn1:"optional,explicit,tag:20"`
	FamilyGrouping      FamilyGrouping     `asn1:"optional,explicit,tag:19"`
}

// # ASN.1 Definition:
//
//	LinkedResult ::= NULL
type LinkedResult = asn1.RawValue

// # ASN.1 Definition:
//
//	AbandonedData ::= SET {
//	    problem       AbandonedProblem OPTIONAL,
//	    ...,
//	    ...,
//	    COMPONENTS OF CommonResults }
type AbandonedData struct {
	Problem            AbandonedProblem   `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AbandonedProblem  ::= ENUMERATED {
//	  pagingAbandoned (0) }
type AbandonedProblem = asn1.Enumerated

const (
	AbandonedProblem_PagingAbandoned AbandonedProblem = 0
)

// # ASN.1 Definition:
//
//	AbandonFailedData ::= SET {
//	  problem    [0]  AbandonProblem,
//	  operation  [1]  InvokeId,
//	  ...,
//	  ...,
//	  COMPONENTS OF   CommonResults }
type AbandonFailedData struct {
	Problem            AbandonProblem     `asn1:"explicit,tag:0"`
	Operation          InvokeId           `asn1:"explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AbandonProblem ::= INTEGER {
//	  noSuchOperation (1),
//	  tooLate         (2),
//	  cannotAbandon   (3) }
type AbandonProblem = int64

const AbandonProblem_NoSuchOperation AbandonProblem = 1

const AbandonProblem_TooLate AbandonProblem = 2

const AbandonProblem_CannotAbandon AbandonProblem = 3

// # ASN.1 Definition:
//
//	AttributeErrorData ::= SET {
//	  object   [0]  Name,
//	  problems [1]  SET OF SEQUENCE {
//	    problem  [0]  AttributeProblem,
//	    type     [1]  AttributeType,
//	    value    [2]  AttributeValue OPTIONAL,
//	    ...},
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResults }
type AttributeErrorData struct {
	Object             Name                                 `asn1:"explicit,tag:0"`
	Problems           [](AttributeErrorData_problems_Item) `asn1:"explicit,tag:1,set"`
	SecurityParameters SecurityParameters                   `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName                    `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                                 `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)                        `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AttributeProblem ::= INTEGER {
//	  noSuchAttributeOrValue        (1),
//	  invalidAttributeSyntax        (2),
//	  undefinedAttributeType        (3),
//	  inappropriateMatching         (4),
//	  constraintViolation           (5),
//	  attributeOrValueAlreadyExists (6),
//	  contextViolation              (7) }
type AttributeProblem = int64

const AttributeProblem_NoSuchAttributeOrValue AttributeProblem = 1

const AttributeProblem_InvalidAttributeSyntax AttributeProblem = 2

const AttributeProblem_UndefinedAttributeType AttributeProblem = 3

const AttributeProblem_InappropriateMatching AttributeProblem = 4

const AttributeProblem_ConstraintViolation AttributeProblem = 5

const AttributeProblem_AttributeOrValueAlreadyExists AttributeProblem = 6

const AttributeProblem_ContextViolation AttributeProblem = 7

// # ASN.1 Definition:
//
//	NameErrorData ::= SET {
//	  problem  [0]  NameProblem,
//	  matched  [1]  Name,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResults }
type NameErrorData struct {
	Problem            NameProblem        `asn1:"explicit,tag:0"`
	Matched            Name               `asn1:"explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	NameProblem ::= INTEGER {
//	  noSuchObject              (1),
//	  aliasProblem              (2),
//	  invalidAttributeSyntax    (3),
//	  aliasDereferencingProblem (4)
//	  -- not to be used         (5)-- }
type NameProblem = int64

const NameProblem_NoSuchObject NameProblem = 1

const NameProblem_AliasProblem NameProblem = 2

const NameProblem_InvalidAttributeSyntax NameProblem = 3

const NameProblem_AliasDereferencingProblem NameProblem = 4

// # ASN.1 Definition:
//
//	ReferralData ::= SET {
//	  candidate  [0] ContinuationReference,
//	  ...,
//	  ...,
//	  COMPONENTS OF  CommonResults }
type ReferralData struct {
	Candidate          ContinuationReference `asn1:"explicit,tag:0"`
	SecurityParameters SecurityParameters    `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName     `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                  `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)         `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	SecurityErrorData ::= SET {
//	  problem      [0]  SecurityProblem,
//	  spkmInfo     [1]  SPKM-ERROR OPTIONAL,
//	  encPwdInfo   [2]  EncPwdInfo OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResults }
type SecurityErrorData struct {
	Problem            SecurityProblem    `asn1:"explicit,tag:0"`
	SpkmInfo           SPKM_ERROR         `asn1:"optional,explicit,tag:1"`
	EncPwdInfo         EncPwdInfo         `asn1:"optional,explicit,tag:2"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	SecurityProblem ::= INTEGER {
//	  inappropriateAuthentication     (1),
//	  invalidCredentials              (2),
//	  insufficientAccessRights        (3),
//	  invalidSignature                (4),
//	  protectionRequired              (5),
//	  noInformation                   (6),
//	  blockedCredentials              (7),
//	  -- invalidQOPMatch              (8), obsolete
//	  spkmError                       (9),
//	  unsupportedAuthenticationMethod (10),
//	  passwordExpired                 (11),
//	  inappropriateAlgorithms         (12) }
type SecurityProblem = int64

const SecurityProblem_InappropriateAuthentication SecurityProblem = 1

const SecurityProblem_InvalidCredentials SecurityProblem = 2

const SecurityProblem_InsufficientAccessRights SecurityProblem = 3

const SecurityProblem_InvalidSignature SecurityProblem = 4

const SecurityProblem_ProtectionRequired SecurityProblem = 5

const SecurityProblem_NoInformation SecurityProblem = 6

const SecurityProblem_BlockedCredentials SecurityProblem = 7

const SecurityProblem_SpkmError SecurityProblem = 9

const SecurityProblem_UnsupportedAuthenticationMethod SecurityProblem = 10

const SecurityProblem_PasswordExpired SecurityProblem = 11

const SecurityProblem_InappropriateAlgorithms SecurityProblem = 12

// # ASN.1 Definition:
//
//	EncPwdInfo ::= SEQUENCE {
//	  algorithms     [0]  SEQUENCE OF AlgorithmIdentifier
//	                        {{SupportedAlgorithms}} OPTIONAL,
//	  pwdQualityRule [1]  SEQUENCE OF AttributeTypeAndValue OPTIONAL,
//	  ... }
type EncPwdInfo struct {
	Algorithms     [](pkix.AlgorithmIdentifier)   `asn1:"optional,explicit,tag:0"`
	PwdQualityRule [](pkix.AttributeTypeAndValue) `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	ServiceErrorData ::= SET {
//	  problem   [0]  ServiceProblem,
//	  ...,
//	  ...,
//	  COMPONENTS OF  CommonResults }
type ServiceErrorData struct {
	Problem            ServiceProblem     `asn1:"explicit,tag:0"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ServiceProblem ::= INTEGER {
//	  busy                         (1),
//	  unavailable                  (2),
//	  unwillingToPerform           (3),
//	  chainingRequired             (4),
//	  unableToProceed              (5),
//	  invalidReference             (6),
//	  timeLimitExceeded            (7),
//	  administrativeLimitExceeded  (8),
//	  loopDetected                 (9),
//	  unavailableCriticalExtension (10),
//	  outOfScope                   (11),
//	  ditError                     (12),
//	  invalidQueryReference        (13),
//	  requestedServiceNotAvailable (14),
//	  unsupportedMatchingUse       (15),
//	  ambiguousKeyAttributes       (16),
//	  saslBindInProgress           (17),
//	  notSupportedByLDAP           (18) }
type ServiceProblem = int64

const ServiceProblem_Busy ServiceProblem = 1

const ServiceProblem_Unavailable ServiceProblem = 2

const ServiceProblem_UnwillingToPerform ServiceProblem = 3

const ServiceProblem_ChainingRequired ServiceProblem = 4

const ServiceProblem_UnableToProceed ServiceProblem = 5

const ServiceProblem_InvalidReference ServiceProblem = 6

const ServiceProblem_TimeLimitExceeded ServiceProblem = 7

const ServiceProblem_AdministrativeLimitExceeded ServiceProblem = 8

const ServiceProblem_LoopDetected ServiceProblem = 9

const ServiceProblem_UnavailableCriticalExtension ServiceProblem = 10

const ServiceProblem_OutOfScope ServiceProblem = 11

const ServiceProblem_DitError ServiceProblem = 12

const ServiceProblem_InvalidQueryReference ServiceProblem = 13

const ServiceProblem_RequestedServiceNotAvailable ServiceProblem = 14

const ServiceProblem_UnsupportedMatchingUse ServiceProblem = 15

const ServiceProblem_AmbiguousKeyAttributes ServiceProblem = 16

const ServiceProblem_SaslBindInProgress ServiceProblem = 17

const ServiceProblem_NotSupportedByLDAP ServiceProblem = 18

// # ASN.1 Definition:
//
//	UpdateErrorData ::= SET {
//	  problem        [0]  UpdateProblem,
//	  attributeInfo  [1]  SET SIZE (1..MAX) OF CHOICE {
//	    attributeType       AttributeType,
//	    attribute           Attribute{{SupportedAttributes}},
//	    ... } OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF       CommonResults }
type UpdateErrorData struct {
	Problem            UpdateProblem                          `asn1:"explicit,tag:0"`
	AttributeInfo      [](UpdateErrorData_attributeInfo_Item) `asn1:"optional,explicit,tag:1,set"`
	SecurityParameters SecurityParameters                     `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName                      `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                                   `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)                          `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	UpdateProblem ::= INTEGER {
//	  namingViolation                   (1),
//	  objectClassViolation              (2),
//	  notAllowedOnNonLeaf               (3),
//	  notAllowedOnRDN                   (4),
//	  entryAlreadyExists                (5),
//	  affectsMultipleDSAs               (6),
//	  objectClassModificationProhibited (7),
//	  noSuchSuperior                    (8),
//	  notAncestor                       (9),
//	  parentNotAncestor                 (10),
//	  hierarchyRuleViolation            (11),
//	  familyRuleViolation               (12),
//	  insufficientPasswordQuality       (13),
//	  passwordInHistory                 (14),
//	  noPasswordSlot                    (15) }
type UpdateProblem = int64

const UpdateProblem_NamingViolation UpdateProblem = 1

const UpdateProblem_ObjectClassViolation UpdateProblem = 2

const UpdateProblem_NotAllowedOnNonLeaf UpdateProblem = 3

const UpdateProblem_NotAllowedOnRDN UpdateProblem = 4

const UpdateProblem_EntryAlreadyExists UpdateProblem = 5

const UpdateProblem_AffectsMultipleDSAs UpdateProblem = 6

const UpdateProblem_ObjectClassModificationProhibited UpdateProblem = 7

const UpdateProblem_NoSuchSuperior UpdateProblem = 8

const UpdateProblem_NotAncestor UpdateProblem = 9

const UpdateProblem_ParentNotAncestor UpdateProblem = 10

const UpdateProblem_HierarchyRuleViolation UpdateProblem = 11

const UpdateProblem_FamilyRuleViolation UpdateProblem = 12

const UpdateProblem_InsufficientPasswordQuality UpdateProblem = 13

const UpdateProblem_PasswordInHistory UpdateProblem = 14

const UpdateProblem_NoPasswordSlot UpdateProblem = 15

// # ASN.1 Definition:
//
//	id-at-family-information OBJECT IDENTIFIER ::= {id-at 64}
var Id_at_family_information asn1.ObjectIdentifier = []int{2, 5, 4, 64}

// # ASN.1 Definition:
//
// ServiceControls-priority ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type ServiceControls_priority = int64

const ServiceControls_priority_Low ServiceControls_priority = 0

const ServiceControls_priority_Medium ServiceControls_priority = 1

const ServiceControls_priority_High ServiceControls_priority = 2

// # ASN.1 Definition:
//
//	ServiceControls-scopeOfReferral ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type ServiceControls_scopeOfReferral = int64

const ServiceControls_scopeOfReferral_Dmd ServiceControls_scopeOfReferral = 0

const ServiceControls_scopeOfReferral_Country ServiceControls_scopeOfReferral = 1

// # ASN.1 Definition:
//
//	ServiceControls-manageDSAITPlaneRef ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ServiceControls_manageDSAITPlaneRef struct {
	DsaName     Name
	AgreementID AgreementID
}

// # ASN.1 Definition:
//
//	EntryInformationSelection-attributes ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EntryInformationSelection_attributes = asn1.RawValue

// # ASN.1 Definition:
//
//	EntryInformationSelection-infoTypes ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type EntryInformationSelection_infoTypes = int64

const EntryInformationSelection_infoTypes_AttributeTypesOnly EntryInformationSelection_infoTypes = 0

const EntryInformationSelection_infoTypes_AttributeTypesAndValues EntryInformationSelection_infoTypes = 1

// # ASN.1 Definition:
//
//	EntryInformationSelection-extraAttributes ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EntryInformationSelection_extraAttributes = asn1.RawValue

// # ASN.1 Definition:
//
//	TypeAndContextAssertion-contextAssertions ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type TypeAndContextAssertion_contextAssertions = asn1.RawValue

// # ASN.1 Definition:
//
//	FamilyReturn-memberSelect ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type FamilyReturn_memberSelect = asn1.Enumerated

const (
	FamilyReturn_memberSelect_ContributingEntriesOnly  FamilyReturn_memberSelect = 1
	FamilyReturn_memberSelect_ParticipatingEntriesOnly FamilyReturn_memberSelect = 2
	FamilyReturn_memberSelect_CompoundEntry            FamilyReturn_memberSelect = 3
)

// # ASN.1 Definition:
//
//	EntryInformation-information-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EntryInformation_information_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	FamilyEntry-information-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type FamilyEntry_information_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	FilterItem-substrings-strings-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type FilterItem_substrings_strings_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	FilterItem-substrings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type FilterItem_substrings struct {
	Type    asn1.ObjectIdentifier
	Strings [](FilterItem_substrings_strings_Item)
}

// # ASN.1 Definition:
//
//	PagedResultsRequest-newRequest ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type PagedResultsRequest_newRequest struct {
	PageSize   int
	SortKeys   [](SortKey) `asn1:"optional"`
	Reverse    bool        `asn1:"optional,explicit,tag:1"`
	Unmerged   bool        `asn1:"optional,explicit,tag:2"`
	PageNumber int         `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	SimpleCredentials-validity-time1 ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type SimpleCredentials_validity_time1 = asn1.RawValue

// # ASN.1 Definition:
//
//	SimpleCredentials-validity-time2 ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type SimpleCredentials_validity_time2 = asn1.RawValue

// # ASN.1 Definition:
//
//	SimpleCredentials-validity ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type SimpleCredentials_validity struct {
	Time1   SimpleCredentials_validity_time1 `asn1:"optional,explicit,tag:0"`
	Time2   SimpleCredentials_validity_time2 `asn1:"optional,explicit,tag:1"`
	Random1 asn1.BitString                   `asn1:"optional,explicit,tag:2"`
	Random2 asn1.BitString                   `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	SimpleCredentials-password ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type SimpleCredentials_password = asn1.RawValue

// # ASN.1 Definition:
//
//	PwdResponseValue-warning ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type PwdResponseValue_warning = asn1.RawValue

// # ASN.1 Definition:
//
//	PwdResponseValue-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type PwdResponseValue_error = asn1.Enumerated

const (
	PwdResponseValue_error_PasswordExpired  PwdResponseValue_error = 0
	PwdResponseValue_error_ChangeAfterReset PwdResponseValue_error = 1
)

// # ASN.1 Definition:
//
//	DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1-error ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyRights-Item-item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ModifyRights_Item_item = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyRights-Item-permission ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type ModifyRights_Item_permission = asn1.BitString

const ModifyRights_Item_permission_Add int32 = 0

const ModifyRights_Item_permission_Remove int32 = 1

const ModifyRights_Item_permission_Rename int32 = 2

const ModifyRights_Item_permission_Move int32 = 3

// # ASN.1 Definition:
//
//	ModifyRights-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ModifyRights_Item struct {
	Item       ModifyRights_Item_item
	Permission ModifyRights_Item_permission `asn1:"explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	ListResultData-listInfo-subordinates-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ListResultData_listInfo_subordinates_Item struct {
	Rdn        pkix.RelativeDistinguishedNameSET
	AliasEntry bool `asn1:"optional,explicit,tag:0"`
	FromEntry  bool `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	ListResultData-listInfo ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ListResultData_listInfo struct {
	Name                    Name                                          `asn1:"optional"`
	Subordinates            [](ListResultData_listInfo_subordinates_Item) `asn1:"explicit,tag:1,set"`
	PartialOutcomeQualifier PartialOutcomeQualifier                       `asn1:"optional,explicit,tag:2"`
	SecurityParameters      SecurityParameters                            `asn1:"optional,explicit,tag:30"`
	Performer               DistinguishedName                             `asn1:"optional,explicit,tag:29"`
	AliasDereferenced       bool                                          `asn1:"optional,explicit,tag:28"`
	Notification            [](Attribute)                                 `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	PartialOutcomeQualifier-entryCount ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type PartialOutcomeQualifier_entryCount = asn1.RawValue

// # ASN.1 Definition:
//
//	SearchArgumentData-subset ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type SearchArgumentData_subset = int64

const SearchArgumentData_subset_BaseObject SearchArgumentData_subset = 0

const SearchArgumentData_subset_OneLevel SearchArgumentData_subset = 1

const SearchArgumentData_subset_WholeSubtree SearchArgumentData_subset = 2

// # ASN.1 Definition:
//
//	SearchArgumentData-joinType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type SearchArgumentData_joinType = asn1.Enumerated

const (
	SearchArgumentData_joinType_InnerJoin     SearchArgumentData_joinType = 0
	SearchArgumentData_joinType_LeftOuterJoin SearchArgumentData_joinType = 1
	SearchArgumentData_joinType_FullOuterJoin SearchArgumentData_joinType = 2
)

// # ASN.1 Definition:
//
//	JoinArgument-joinSubset ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type JoinArgument_joinSubset = asn1.Enumerated

const (
	JoinArgument_joinSubset_BaseObject   JoinArgument_joinSubset = 0
	JoinArgument_joinSubset_OneLevel     JoinArgument_joinSubset = 1
	JoinArgument_joinSubset_WholeSubtree JoinArgument_joinSubset = 2
)

// # ASN.1 Definition:
//
//	SearchResultData-searchInfo ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type SearchResultData_searchInfo struct {
	Name                    Name                    `asn1:"optional"`
	Entries                 [](EntryInformation)    `asn1:"explicit,tag:0,set"`
	PartialOutcomeQualifier PartialOutcomeQualifier `asn1:"optional,explicit,tag:2"`
	AltMatching             bool                    `asn1:"optional,explicit,tag:3"`
	SecurityParameters      SecurityParameters      `asn1:"optional,explicit,tag:30"`
	Performer               DistinguishedName       `asn1:"optional,explicit,tag:29"`
	AliasDereferenced       bool                    `asn1:"optional,explicit,tag:28"`
	Notification            [](Attribute)           `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	AttributeErrorData-problems-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AttributeErrorData_problems_Item struct {
	Problem AttributeProblem `asn1:"explicit,tag:0"`
	Type    AttributeType    `asn1:"explicit,tag:1"`
	Value   AttributeValue   `asn1:"optional,explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	UpdateErrorData-attributeInfo-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type UpdateErrorData_attributeInfo_Item = asn1.RawValue
