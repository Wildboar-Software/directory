package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION CommonArguments */
// ### ASN.1 Definition:
//
// ```asn1
// CommonArguments ::= SET {
//   serviceControls      [30]  ServiceControls    DEFAULT {},
//   securityParameters   [29]  SecurityParameters OPTIONAL,
//   requestor            [28]  DistinguishedName  OPTIONAL,
//   operationProgress    [27]  OperationProgress
//                              DEFAULT {nameResolutionPhase notStarted},
//   aliasedRDNs          [26]  INTEGER            OPTIONAL,
//   criticalExtensions   [25]  BIT STRING         OPTIONAL,
//   referenceType        [24]  ReferenceType      OPTIONAL,
//   entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
//   exclusions           [22]  Exclusions         OPTIONAL,
//   nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
//   operationContexts    [20]  ContextSelection   OPTIONAL,
//   familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION CommonArguments */ /* START_OF_SYMBOL_DEFINITION CommonArgumentsSeq */
// ### ASN.1 Definition:
//
// ```asn1
// CommonArgumentsSeq ::= SEQUENCE {
//   serviceControls      [30]  ServiceControls    DEFAULT {},
//   securityParameters   [29]  SecurityParameters OPTIONAL,
//   requestor            [28]  DistinguishedName  OPTIONAL,
//   operationProgress    [27]  OperationProgress
//                              DEFAULT {nameResolutionPhase notStarted},
//   aliasedRDNs          [26]  INTEGER            OPTIONAL,
//   criticalExtensions   [25]  BIT STRING         OPTIONAL,
//   referenceType        [24]  ReferenceType      OPTIONAL,
//   entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
//   exclusions           [22]  Exclusions         OPTIONAL,
//   nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
//   operationContexts    [20]  ContextSelection   OPTIONAL,
//   familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION CommonArgumentsSeq */ /* START_OF_SYMBOL_DEFINITION FamilyGrouping */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyGrouping  ::=  ENUMERATED {
//   entryOnly     (1),
//   compoundEntry (2),
//   strands       (3),
//   multiStrand   (4),
//   ... }
// ```
type FamilyGrouping = asn1.Enumerated

const (
	FamilyGrouping_EntryOnly     FamilyGrouping = 1 // LONG_NAMED_ENUMERATED_VALUE,
	FamilyGrouping_CompoundEntry FamilyGrouping = 2 // LONG_NAMED_ENUMERATED_VALUE,
	FamilyGrouping_Strands       FamilyGrouping = 3 // LONG_NAMED_ENUMERATED_VALUE,
	FamilyGrouping_MultiStrand   FamilyGrouping = 4 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION FamilyGrouping */ /* START_OF_SYMBOL_DEFINITION CommonResults */
// ### ASN.1 Definition:
//
// ```asn1
// CommonResults ::= SET {
//   securityParameters  [30]  SecurityParameters  OPTIONAL,
//   performer           [29]  DistinguishedName   OPTIONAL,
//   aliasDereferenced   [28]  BOOLEAN             DEFAULT FALSE,
//   notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
//                             {{SupportedAttributes}} OPTIONAL,
//   ... }
// ```
//
//
type CommonResults struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION CommonResults */ /* START_OF_SYMBOL_DEFINITION CommonResultsSeq */
// ### ASN.1 Definition:
//
// ```asn1
// CommonResultsSeq ::= SEQUENCE {
//   securityParameters  [30]  SecurityParameters OPTIONAL,
//   performer           [29]  DistinguishedName OPTIONAL,
//   aliasDereferenced   [28]  BOOLEAN DEFAULT FALSE,
//   notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
//                             {{SupportedAttributes}} OPTIONAL,
//   ... }
// ```
//
//
type CommonResultsSeq struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION CommonResultsSeq */ /* START_OF_SYMBOL_DEFINITION ServiceControls */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceControls ::= SET {
//   options              [0]  ServiceControlOptions DEFAULT {},
//   priority             [1]  INTEGER {low(0), medium(1), high(2)} DEFAULT medium,
//   timeLimit            [2]  INTEGER OPTIONAL,
//   sizeLimit            [3]  INTEGER OPTIONAL,
//   scopeOfReferral      [4]  INTEGER {dmd(0), country(1)} OPTIONAL,
//   attributeSizeLimit   [5]  INTEGER OPTIONAL,
//   manageDSAITPlaneRef  [6]  SEQUENCE {
//     dsaName                   Name,
//     agreementID               AgreementID,
//     ...} OPTIONAL,
//   serviceType          [7]  OBJECT IDENTIFIER OPTIONAL,
//   userClass            [8]  INTEGER OPTIONAL,
//   ... }
// ```
//
//
type ServiceControls struct {
	Options             ServiceControlOptions               `asn1:"optional,explicit,tag:0"`
	Priority            ServiceControls_priority            `asn1:"optional,explicit,tag:1"`
	TimeLimit           int                                 `asn1:"optional,explicit,tag:2"`
	SizeLimit           int                                 `asn1:"optional,explicit,tag:3"`
	ScopeOfReferral     ServiceControls_scopeOfReferral     `asn1:"optional,explicit,tag:4"`
	AttributeSizeLimit  int                                 `asn1:"optional,explicit,tag:5"`
	ManageDSAITPlaneRef ServiceControls_manageDSAITPlaneRef `asn1:"optional,explicit,tag:6"`
	ServiceType         asn1.ObjectIdentifier               `asn1:"optional,explicit,tag:7"`
	UserClass           int                                 `asn1:"optional,explicit,tag:8"`
}

/* END_OF_SYMBOL_DEFINITION ServiceControls */ /* START_OF_SYMBOL_DEFINITION ServiceControlOptions */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceControlOptions  ::=  BIT STRING {
//   preferChaining          (0),
//   chainingProhibited      (1),
//   localScope              (2),
//   dontUseCopy             (3),
//   dontDereferenceAliases  (4),
//   subentries              (5),
//   copyShallDo             (6),
//   partialNameResolution   (7),
//   manageDSAIT             (8),
//   noSubtypeMatch          (9),
//   noSubtypeSelection      (10),
//   countFamily             (11),
//   dontSelectFriends       (12),
//   dontMatchFriends        (13),
//   allowWriteableCopy      (14)}
// ```
type ServiceControlOptions = asn1.BitString

/* END_OF_SYMBOL_DEFINITION ServiceControlOptions */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_PreferChaining */
const ServiceControlOptions_PreferChaining int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_PreferChaining */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_ChainingProhibited */
const ServiceControlOptions_ChainingProhibited int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_ChainingProhibited */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_LocalScope */
const ServiceControlOptions_LocalScope int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_LocalScope */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_DontUseCopy */
const ServiceControlOptions_DontUseCopy int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_DontUseCopy */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_DontDereferenceAliases */
const ServiceControlOptions_DontDereferenceAliases int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_DontDereferenceAliases */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_Subentries */
const ServiceControlOptions_Subentries int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_Subentries */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_CopyShallDo */
const ServiceControlOptions_CopyShallDo int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_CopyShallDo */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_PartialNameResolution */
const ServiceControlOptions_PartialNameResolution int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_PartialNameResolution */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_ManageDSAIT */
const ServiceControlOptions_ManageDSAIT int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_ManageDSAIT */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_NoSubtypeMatch */
const ServiceControlOptions_NoSubtypeMatch int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_NoSubtypeMatch */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_NoSubtypeSelection */
const ServiceControlOptions_NoSubtypeSelection int32 = 10 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_NoSubtypeSelection */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_CountFamily */
const ServiceControlOptions_CountFamily int32 = 11 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_CountFamily */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_DontSelectFriends */
const ServiceControlOptions_DontSelectFriends int32 = 12 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_DontSelectFriends */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_DontMatchFriends */
const ServiceControlOptions_DontMatchFriends int32 = 13 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_DontMatchFriends */

/* START_OF_SYMBOL_DEFINITION ServiceControlOptions_AllowWriteableCopy */
const ServiceControlOptions_AllowWriteableCopy int32 = 14 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ServiceControlOptions_AllowWriteableCopy */ /* START_OF_SYMBOL_DEFINITION EntryInformationSelection */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformationSelection ::= SET {
//   attributes                     CHOICE {
//     allUserAttributes         [0]  NULL,
//     select                    [1]  SET OF AttributeType
//     -- empty set implies no attributes are requested -- } DEFAULT allUserAttributes:NULL,
//     infoTypes               [2]  INTEGER {
//       attributeTypesOnly        (0),
//       attributeTypesAndValues   (1)} DEFAULT attributeTypesAndValues,
//   extraAttributes                CHOICE {
//     allOperationalAttributes  [3]  NULL,
//     select                    [4]  SET SIZE (1..MAX) OF AttributeType } OPTIONAL,
//   contextSelection               ContextSelection OPTIONAL,
//   returnContexts                 BOOLEAN DEFAULT FALSE,
//   familyReturn                   FamilyReturn DEFAULT
//                                    {memberSelect contributingEntriesOnly} }
// ```
//
//
type EntryInformationSelection struct {
	Attributes       EntryInformationSelection_attributes      `asn1:"optional"`
	InfoTypes        EntryInformationSelection_infoTypes       `asn1:"optional,explicit,tag:2"`
	ExtraAttributes  EntryInformationSelection_extraAttributes `asn1:"optional"`
	ContextSelection ContextSelection                          `asn1:"optional"`
	ReturnContexts   bool                                      `asn1:"optional"`
	FamilyReturn     FamilyReturn                              `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION EntryInformationSelection */ /* START_OF_SYMBOL_DEFINITION ContextSelection */
// ### ASN.1 Definition:
//
// ```asn1
// ContextSelection  ::=  CHOICE {
//   allContexts       NULL,
//   selectedContexts  SET SIZE (1..MAX) OF TypeAndContextAssertion,
//   ... }
// ```
type ContextSelection = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ContextSelection */ /* START_OF_SYMBOL_DEFINITION TypeAndContextAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// TypeAndContextAssertion ::= SEQUENCE {
//   type               AttributeType,
//   contextAssertions  CHOICE {
//     preference         SEQUENCE OF ContextAssertion,
//     all                SET OF ContextAssertion,
//     ...},
//   ... }
// ```
//
//
type TypeAndContextAssertion struct {
	Type              AttributeType
	ContextAssertions TypeAndContextAssertion_contextAssertions
}

/* END_OF_SYMBOL_DEFINITION TypeAndContextAssertion */ /* START_OF_SYMBOL_DEFINITION FamilyReturn */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyReturn ::= SEQUENCE {
//   memberSelect   ENUMERATED {
//     contributingEntriesOnly   (1),
//     participatingEntriesOnly  (2),
//     compoundEntry             (3),
//     ...},
//   familySelect   SEQUENCE SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//   ... }
// ```
//
//
type FamilyReturn struct {
	MemberSelect FamilyReturn_memberSelect
	FamilySelect [](asn1.ObjectIdentifier) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION FamilyReturn */ /* START_OF_SYMBOL_DEFINITION EntryInformation */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformation ::= SEQUENCE {
//   name                  Name,
//   fromEntry             BOOLEAN DEFAULT TRUE,
//   information           SET SIZE (1..MAX) OF CHOICE {
//     attributeType         AttributeType,
//     attribute             Attribute{{SupportedAttributes}},
//     ...} OPTIONAL,
//   incompleteEntry  [3]  BOOLEAN DEFAULT FALSE,
//   partialName      [4]  BOOLEAN DEFAULT FALSE,
//   derivedEntry     [5]  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type EntryInformation struct {
	Name            Name
	FromEntry       bool                                  `asn1:"optional"`
	Information     [](EntryInformation_information_Item) `asn1:"optional,set"`
	IncompleteEntry bool                                  `asn1:"optional,explicit,tag:3"`
	PartialName     bool                                  `asn1:"optional,explicit,tag:4"`
	DerivedEntry    bool                                  `asn1:"optional,explicit,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION EntryInformation */ /* START_OF_SYMBOL_DEFINITION FamilyEntries */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyEntries ::= SEQUENCE {
//   family-class   OBJECT-CLASS.&id, -- structural object class value
//   familyEntries  SEQUENCE OF FamilyEntry,
//   ... }
// ```
//
//
type FamilyEntries struct {
	Family_class  asn1.ObjectIdentifier
	FamilyEntries [](FamilyEntry)
}

/* END_OF_SYMBOL_DEFINITION FamilyEntries */ /* START_OF_SYMBOL_DEFINITION FamilyEntry */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyEntry ::= SEQUENCE {
//   rdn            RelativeDistinguishedName,
//   information    SEQUENCE OF CHOICE {
//     attributeType  AttributeType,
//     attribute      Attribute{{SupportedAttributes}},
//     ...},
//   family-info    SEQUENCE SIZE (1..MAX) OF FamilyEntries OPTIONAL,
//   ... }
// ```
//
//
type FamilyEntry struct {
	Rdn         RelativeDistinguishedName
	Information [](FamilyEntry_information_Item)
	Family_info [](FamilyEntries) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION FamilyEntry */ /* START_OF_SYMBOL_DEFINITION Filter */
// ### ASN.1 Definition:
//
// ```asn1
// Filter  ::=  CHOICE {
//   item  [0]  FilterItem,
//   and   [1]  SET OF Filter,
//   or    [2]  SET OF Filter,
//   not   [3]  Filter,
//   ... }
// ```
type Filter = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Filter */ /* START_OF_SYMBOL_DEFINITION FilterItem */
// ### ASN.1 Definition:
//
// ```asn1
// FilterItem  ::=  CHOICE {
//   equality          [0]  AttributeValueAssertion,
//   substrings        [1]  SEQUENCE {
//     type                   ATTRIBUTE.&id({SupportedAttributes}),
//     strings                SEQUENCE OF CHOICE {
//       initial           [0]  ATTRIBUTE.&Type
//                               ({SupportedAttributes}{@substrings.type}),
//       any               [1]  ATTRIBUTE.&Type
//                               ({SupportedAttributes}{@substrings.type}),
//       final             [2]  ATTRIBUTE.&Type
//                               ({SupportedAttributes}{@substrings.type}),
//       control                Attribute{{SupportedAttributes}},
//                     -- Used to specify interpretation of following items
//       ... },
//     ... },
//   greaterOrEqual    [2]  AttributeValueAssertion,
//   lessOrEqual       [3]  AttributeValueAssertion,
//   present           [4]  AttributeType,
//   approximateMatch  [5]  AttributeValueAssertion,
//   extensibleMatch   [6]  MatchingRuleAssertion,
//   contextPresent    [7]  AttributeTypeAssertion,
//   ... }
// ```
type FilterItem = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION FilterItem */ /* START_OF_SYMBOL_DEFINITION MatchingRuleAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// MatchingRuleAssertion ::= SEQUENCE {
//   matchingRule  [1]  SET SIZE (1..MAX) OF MATCHING-RULE.&id,
//   type          [2]  AttributeType OPTIONAL,
//   matchValue    [3]  MATCHING-RULE.&AssertionType (CONSTRAINED BY {
//     -- matchValue shall be a value of  type specified by the &AssertionType field of
//     -- one of the MATCHING-RULE information objects identified by matchingRule -- }),
//   dnAttributes  [4]  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type MatchingRuleAssertion struct {
	MatchingRule [](asn1.ObjectIdentifier) `asn1:"explicit,tag:1,set"`
	Type         AttributeType             `asn1:"optional,explicit,tag:2"`
	MatchValue   asn1.RawValue             `asn1:"explicit,tag:3"`
	DnAttributes bool                      `asn1:"optional,explicit,tag:4"`
}

/* END_OF_SYMBOL_DEFINITION MatchingRuleAssertion */ /* START_OF_SYMBOL_DEFINITION PagedResultsRequest */
// ### ASN.1 Definition:
//
// ```asn1
// PagedResultsRequest  ::=  CHOICE {
//   newRequest         SEQUENCE {
//     pageSize           INTEGER,
//     sortKeys           SEQUENCE SIZE (1..MAX) OF SortKey OPTIONAL,
//     reverse       [1]  BOOLEAN DEFAULT FALSE,
//     unmerged      [2]  BOOLEAN DEFAULT FALSE,
//     pageNumber    [3]  INTEGER OPTIONAL,
//     ...},
//   queryReference     OCTET STRING,
//   abandonQuery  [0]  OCTET STRING,
//   ... }
// ```
type PagedResultsRequest = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PagedResultsRequest */ /* START_OF_SYMBOL_DEFINITION SortKey */
// ### ASN.1 Definition:
//
// ```asn1
// SortKey ::= SEQUENCE {
//   type          AttributeType,
//   orderingRule  MATCHING-RULE.&id OPTIONAL,
//   ... }
// ```
//
//
type SortKey struct {
	Type         AttributeType
	OrderingRule asn1.ObjectIdentifier `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION SortKey */ /* START_OF_SYMBOL_DEFINITION SecurityParameters */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityParameters ::= SET {
//   certification-path          [0]  CertificationPath OPTIONAL,
//   name                        [1]  DistinguishedName OPTIONAL,
//   time                        [2]  Time OPTIONAL,
//   random                      [3]  BIT STRING OPTIONAL,
//   target                      [4]  ProtectionRequest OPTIONAL,
//   --                          [5]  Not to be used
//   operationCode               [6]  Code OPTIONAL,
//   --                          [7]  Not to be used
//   errorProtection             [8]  ErrorProtectionRequest OPTIONAL,
//   errorCode                   [9]  Code OPTIONAL,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION SecurityParameters */ /* START_OF_SYMBOL_DEFINITION ProtectionRequest */
// ### ASN.1 Definition:
//
// ```asn1
// ProtectionRequest  ::=  INTEGER {none(0), signed(1)}
// ```
type ProtectionRequest = int64

/* END_OF_SYMBOL_DEFINITION ProtectionRequest */

/* START_OF_SYMBOL_DEFINITION ProtectionRequest_None */
const ProtectionRequest_None ProtectionRequest = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ProtectionRequest_None */

/* START_OF_SYMBOL_DEFINITION ProtectionRequest_Signed */
const ProtectionRequest_Signed ProtectionRequest = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ProtectionRequest_Signed */ /* START_OF_SYMBOL_DEFINITION Time */
// ### ASN.1 Definition:
//
// ```asn1
// Time  ::=  CHOICE {
//   utcTime          UTCTime,
//   generalizedTime  GeneralizedTime,
//   ... }
// ```
// type Time = asn1.RawValue
/* END_OF_SYMBOL_DEFINITION Time */ /* START_OF_SYMBOL_DEFINITION ErrorProtectionRequest */
// ### ASN.1 Definition:
//
// ```asn1
// ErrorProtectionRequest  ::=  INTEGER {none(0), signed(1)}
// ```
type ErrorProtectionRequest = int64

/* END_OF_SYMBOL_DEFINITION ErrorProtectionRequest */

/* START_OF_SYMBOL_DEFINITION ErrorProtectionRequest_None */
const ErrorProtectionRequest_None ErrorProtectionRequest = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ErrorProtectionRequest_None */

/* START_OF_SYMBOL_DEFINITION ErrorProtectionRequest_Signed */
const ErrorProtectionRequest_Signed ErrorProtectionRequest = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ErrorProtectionRequest_Signed */ /* START_OF_SYMBOL_DEFINITION DirectoryBindArgument */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryBindArgument ::= SET {
//   credentials  [0]  Credentials OPTIONAL,
//   versions     [1]  Versions DEFAULT {v1},
//   ... }
// ```
//
//
type DirectoryBindArgument struct {
	Credentials Credentials `asn1:"optional,explicit,tag:0"`
	Versions    Versions    `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION DirectoryBindArgument */ /* START_OF_SYMBOL_DEFINITION Credentials */
// ### ASN.1 Definition:
//
// ```asn1
// Credentials  ::=  CHOICE {
//   simple             [0]  SimpleCredentials,
//   strong             [1]  StrongCredentials,
//   externalProcedure  [2]  EXTERNAL,
//   spkm               [3]  SpkmCredentials,
//   sasl               [4]  SaslCredentials,
//   ... }
// ```
type Credentials = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Credentials */ /* START_OF_SYMBOL_DEFINITION SimpleCredentials */
// ### ASN.1 Definition:
//
// ```asn1
// SimpleCredentials ::= SEQUENCE {
//   name      [0]  DistinguishedName,
//   validity  [1]  SET {
//     time1     [0]  CHOICE {
//       utc            UTCTime,
//       gt             GeneralizedTime} OPTIONAL,
//     time2     [1]  CHOICE {
//       utc            UTCTime,
//       gt             GeneralizedTime} OPTIONAL,
//     random1   [2]  BIT STRING OPTIONAL,
//     random2   [3]  BIT STRING OPTIONAL} OPTIONAL,
//   password  [2]  CHOICE {
//     unprotected    OCTET STRING,
//     protected      HASH{OCTET STRING},
//     ...,
//     userPwd   [0]  UserPwd } OPTIONAL }
// ```
//
//
type SimpleCredentials struct {
	Name     DistinguishedName          `asn1:"explicit,tag:0"`
	Validity SimpleCredentials_validity `asn1:"optional,explicit,tag:1"`
	Password SimpleCredentials_password `asn1:"optional,explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION SimpleCredentials */ /* START_OF_SYMBOL_DEFINITION StrongCredentials */
// ### ASN.1 Definition:
//
// ```asn1
// StrongCredentials ::= SET {
//   certification-path          [0]  CertificationPath OPTIONAL,
//   bind-token                  [1]  Token,
//   name                        [2]  DistinguishedName OPTIONAL,
//   attributeCertificationPath  [3]  AttributeCertificationPath OPTIONAL,
//   ... }
// ```
//
//
type StrongCredentials struct {
	Certification_path         CertificationPath          `asn1:"optional,explicit,tag:0"`
	Bind_token                 Token                      `asn1:"explicit,tag:1"`
	Name                       DistinguishedName          `asn1:"optional,explicit,tag:2"`
	AttributeCertificationPath AttributeCertificationPath `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION StrongCredentials */ /* START_OF_SYMBOL_DEFINITION SpkmCredentials */
// ### ASN.1 Definition:
//
// ```asn1
// SpkmCredentials  ::=  CHOICE {
//   req            [0]  SPKM-REQ,
//   rep            [1]  SPKM-REP-TI,
//   ... }
// ```
type SpkmCredentials = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SpkmCredentials */ /* START_OF_SYMBOL_DEFINITION SaslCredentials */
// ### ASN.1 Definition:
//
// ```asn1
// SaslCredentials ::= SEQUENCE {
//   mechanism    [0]  DirectoryString{ub-saslMechanism},
//   credentials  [1]  OCTET STRING OPTIONAL,
//   saslAbort    [2]  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type SaslCredentials struct {
	Mechanism   DirectoryString `asn1:"explicit,tag:0"`
	Credentials []byte          `asn1:"optional,explicit,tag:1"`
	SaslAbort   bool            `asn1:"optional,explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION SaslCredentials */ /* START_OF_SYMBOL_DEFINITION Ub_saslMechanism */
// ### ASN.1 Definition:
//
// ```asn1
// ub-saslMechanism INTEGER ::= 20
// ```
//
//
// const Ub_saslMechanism int = 20

/* END_OF_SYMBOL_DEFINITION Ub_saslMechanism */ /* START_OF_SYMBOL_DEFINITION Token */
// ### ASN.1 Definition:
//
// ```asn1
// Token  ::=  SIGNED{TokenContent}
// ```
type Token = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION Token */ /* START_OF_SYMBOL_DEFINITION TokenContent */
// ### ASN.1 Definition:
//
// ```asn1
// TokenContent ::= SEQUENCE {
//   algorithm  [0]  AlgorithmIdentifier{{SupportedAlgorithms}},
//   name       [1]  DistinguishedName,
//   time       [2]  Time,
//   random     [3]  BIT STRING,
//   response   [4]  BIT STRING OPTIONAL,
//   ... }
// ```
//
//
type TokenContent struct {
	Algorithm pkix.AlgorithmIdentifier `asn1:"explicit,tag:0"`
	Name      DistinguishedName        `asn1:"explicit,tag:1"`
	Time      Time                     `asn1:"explicit,tag:2"`
	Random    asn1.BitString           `asn1:"explicit,tag:3"`
	Response  asn1.BitString           `asn1:"optional,explicit,tag:4"`
}

/* END_OF_SYMBOL_DEFINITION TokenContent */ /* START_OF_SYMBOL_DEFINITION Versions */
// ### ASN.1 Definition:
//
// ```asn1
// Versions  ::=  BIT STRING {v1(0), v2(1)}
// ```
type Versions = asn1.BitString

/* END_OF_SYMBOL_DEFINITION Versions */

/* START_OF_SYMBOL_DEFINITION Versions_V1 */
const Versions_V1 int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Versions_V1 */

/* START_OF_SYMBOL_DEFINITION Versions_V2 */
const Versions_V2 int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Versions_V2 */ /* START_OF_SYMBOL_DEFINITION DirectoryBindResult */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryBindResult ::= SET {
//   credentials       [0]  Credentials OPTIONAL,
//   versions          [1]  Versions DEFAULT {v1},
//   ...,
//   pwdResponseValue  [2]  PwdResponseValue OPTIONAL }
// ```
//
//
type DirectoryBindResult struct {
	Credentials      Credentials       `asn1:"optional,explicit,tag:0"`
	Versions         Versions          `asn1:"optional,explicit,tag:1"`
	PwdResponseValue *PwdResponseValue `asn1:"optional,explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION DirectoryBindResult */ /* START_OF_SYMBOL_DEFINITION PwdResponseValue */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponseValue ::= SEQUENCE {
//   warning CHOICE {
//     timeLeft        [0]  INTEGER (0..MAX),
//     graceRemaining  [1]  INTEGER (0..MAX),
//     ... } OPTIONAL,
//   error   ENUMERATED {
//     passwordExpired  (0),
//     changeAfterReset (1),
//     ... } OPTIONAL}
// ```
//
//
type PwdResponseValue struct {
	Warning PwdResponseValue_warning `asn1:"optional"`
	Error   *PwdResponseValue_error  `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION PwdResponseValue */ /* START_OF_SYMBOL_DEFINITION DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1 ::= SET {
//   versions              [0]  Versions DEFAULT {v1},
//   error                      CHOICE {
//     serviceError          [1]  ServiceProblem,
//     securityError         [2]  SecurityProblem,
//     ...},
//   securityParameters    [30]  SecurityParameters OPTIONAL }
// ```
//
//
type DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 struct {
	Versions           Versions `asn1:"optional,explicit,tag:0"`
	Error              DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
}

/* END_OF_SYMBOL_DEFINITION DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 */ /* START_OF_SYMBOL_DEFINITION BindKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// BindKeyInfo  ::=  ENCRYPTED{BIT STRING}
// ```
type BindKeyInfo = ENCRYPTED // DefinedType
/* END_OF_SYMBOL_DEFINITION BindKeyInfo */ /* START_OF_SYMBOL_DEFINITION ReadArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ReadArgument  ::=  OPTIONALLY-PROTECTED { ReadArgumentData }
// ```
type ReadArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ReadArgument */ /* START_OF_SYMBOL_DEFINITION ReadArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ReadArgumentData ::= SET {
//   object               [0]  Name,
//   selection            [1]  EntryInformationSelection DEFAULT {},
//   modifyRightsRequest  [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF             CommonArguments }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ReadArgumentData */ /* START_OF_SYMBOL_DEFINITION ReadResult */
// ### ASN.1 Definition:
//
// ```asn1
// ReadResult  ::=  OPTIONALLY-PROTECTED { ReadResultData }
// ```
type ReadResult = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ReadResult */ /* START_OF_SYMBOL_DEFINITION ReadResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ReadResultData ::= SET {
//   entry         [0]  EntryInformation,
//   modifyRights  [1]  ModifyRights OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonResults }
// ```
//
//
type ReadResultData struct {
	Entry              EntryInformation   `asn1:"explicit,tag:0"`
	ModifyRights       ModifyRights       `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ReadResultData */ /* START_OF_SYMBOL_DEFINITION ModifyRights */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyRights  ::=  SET OF SEQUENCE {
//   item      CHOICE {
//     entry      [0]  NULL,
//     attribute  [1]  AttributeType,
//     value      [2]  AttributeValueAssertion,
//     ...},
//   permission   [3]  BIT STRING {
//     add     (0),
//     remove  (1),
//     rename  (2),
//     move    (3)},
//   ... }
// ```
type ModifyRights = [](ModifyRights_Item) // SetOfType
/* END_OF_SYMBOL_DEFINITION ModifyRights */ /* START_OF_SYMBOL_DEFINITION CompareArgument */
// ### ASN.1 Definition:
//
// ```asn1
// CompareArgument  ::=  OPTIONALLY-PROTECTED { CompareArgumentData }
// ```
type CompareArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION CompareArgument */ /* START_OF_SYMBOL_DEFINITION CompareArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// CompareArgumentData ::= SET {
//   object       [0]  Name,
//   purported    [1]  AttributeValueAssertion,
//   ...,
//   ...,
//   COMPONENTS OF     CommonArguments }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION CompareArgumentData */ /* START_OF_SYMBOL_DEFINITION CompareResult */
// ### ASN.1 Definition:
//
// ```asn1
// CompareResult  ::=  OPTIONALLY-PROTECTED { CompareResultData }
// ```
type CompareResult = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION CompareResult */ /* START_OF_SYMBOL_DEFINITION CompareResultData */
// ### ASN.1 Definition:
//
// ```asn1
// CompareResultData ::= SET {
//   name                 Name OPTIONAL,
//   matched         [0]  BOOLEAN,
//   fromEntry       [1]  BOOLEAN DEFAULT TRUE,
//   matchedSubtype  [2]  AttributeType OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF        CommonResults }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION CompareResultData */ /* START_OF_SYMBOL_DEFINITION AbandonArgument */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonArgument  ::=
//   OPTIONALLY-PROTECTED-SEQ { AbandonArgumentData }
// ```
type AbandonArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION AbandonArgument */ /* START_OF_SYMBOL_DEFINITION AbandonArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonArgumentData ::= SEQUENCE {
//   invokeID  [0]  InvokeId,
//   ... }
// ```
//
//
type AbandonArgumentData struct {
	InvokeID InvokeId `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION AbandonArgumentData */ /* START_OF_SYMBOL_DEFINITION AbandonResult */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonResult  ::=  CHOICE {
//   null          NULL,
//   information   OPTIONALLY-PROTECTED-SEQ { AbandonResultData },
//   ... }
// ```
type AbandonResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AbandonResult */ /* START_OF_SYMBOL_DEFINITION AbandonResultData */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonResultData ::= SEQUENCE {
//   invokeID      InvokeId,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type AbandonResultData struct {
	InvokeID           InvokeId
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AbandonResultData */ /* START_OF_SYMBOL_DEFINITION ListArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ListArgument  ::=  OPTIONALLY-PROTECTED { ListArgumentData }
// ```
type ListArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ListArgument */ /* START_OF_SYMBOL_DEFINITION ListArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ListArgumentData ::= SET {
//   object        [0]  Name,
//   pagedResults  [1]  PagedResultsRequest OPTIONAL,
//   listFamily    [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments
//   }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ListArgumentData */ /* START_OF_SYMBOL_DEFINITION ListResult */
// ### ASN.1 Definition:
//
// ```asn1
// ListResult  ::=  OPTIONALLY-PROTECTED { ListResultData }
// ```
type ListResult = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ListResult */ /* START_OF_SYMBOL_DEFINITION ListResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ListResultData  ::=  CHOICE {
//   listInfo                     SET {
//     name                         Name OPTIONAL,
//     subordinates            [1]  SET OF SEQUENCE {
//       rdn                          RelativeDistinguishedName,
//       aliasEntry              [0]  BOOLEAN DEFAULT FALSE,
//       fromEntry               [1]  BOOLEAN DEFAULT TRUE,
//       ... },
//     partialOutcomeQualifier [2]  PartialOutcomeQualifier OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF                CommonResults
//     },
//   uncorrelatedListInfo    [0]  SET OF ListResult,
//   ... }
// ```
type ListResultData = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ListResultData */ /* START_OF_SYMBOL_DEFINITION PartialOutcomeQualifier */
// ### ASN.1 Definition:
//
// ```asn1
// PartialOutcomeQualifier ::= SET {
//   limitProblem                  [0]  LimitProblem OPTIONAL,
//   unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
//   unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
//   unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
//   queryReference                [4]  OCTET STRING OPTIONAL,
//   overspecFilter                [5]  Filter OPTIONAL,
//   notification                  [6]  SEQUENCE SIZE (1..MAX) OF
//                                        Attribute{{SupportedAttributes}} OPTIONAL,
//   entryCount                         CHOICE {
//     bestEstimate                  [7]  INTEGER,
//     lowEstimate                   [8]  INTEGER,
//     exact                         [9]  INTEGER,
//     ...} OPTIONAL
//   --                            [10] Not to be used -- }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION PartialOutcomeQualifier */ /* START_OF_SYMBOL_DEFINITION LimitProblem */
// ### ASN.1 Definition:
//
// ```asn1
// LimitProblem  ::=  INTEGER {
//   timeLimitExceeded           (0),
//   sizeLimitExceeded           (1),
//   administrativeLimitExceeded (2) }
// ```
type LimitProblem = int64

/* END_OF_SYMBOL_DEFINITION LimitProblem */

/* START_OF_SYMBOL_DEFINITION LimitProblem_TimeLimitExceeded */
const LimitProblem_TimeLimitExceeded LimitProblem = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION LimitProblem_TimeLimitExceeded */

/* START_OF_SYMBOL_DEFINITION LimitProblem_SizeLimitExceeded */
const LimitProblem_SizeLimitExceeded LimitProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION LimitProblem_SizeLimitExceeded */

/* START_OF_SYMBOL_DEFINITION LimitProblem_AdministrativeLimitExceeded */
const LimitProblem_AdministrativeLimitExceeded LimitProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION LimitProblem_AdministrativeLimitExceeded */ /* START_OF_SYMBOL_DEFINITION SearchArgument */
// ### ASN.1 Definition:
//
// ```asn1
// SearchArgument  ::=  OPTIONALLY-PROTECTED { SearchArgumentData }
// ```
type SearchArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION SearchArgument */ /* START_OF_SYMBOL_DEFINITION SearchArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// SearchArgumentData ::= SET {
//   baseObject            [0]  Name,
//   subset                [1]  INTEGER {
//     baseObject    (0),
//     oneLevel      (1),
//     wholeSubtree  (2)} DEFAULT baseObject,
//   filter                [2]  Filter DEFAULT and:{},
//   searchAliases         [3]  BOOLEAN DEFAULT TRUE,
//   selection             [4]  EntryInformationSelection DEFAULT {},
//   pagedResults          [5]  PagedResultsRequest OPTIONAL,
//   matchedValuesOnly     [6]  BOOLEAN DEFAULT FALSE,
//   extendedFilter        [7]  Filter OPTIONAL,
//   checkOverspecified    [8]  BOOLEAN DEFAULT FALSE,
//   relaxation            [9]  RelaxationPolicy OPTIONAL,
//   extendedArea          [10] INTEGER OPTIONAL,
//   hierarchySelections   [11] HierarchySelections DEFAULT {self},
//   searchControlOptions  [12] SearchControlOptions DEFAULT {searchAliases},
//   joinArguments         [13] SEQUENCE SIZE (1..MAX) OF JoinArgument OPTIONAL,
//   joinType              [14] ENUMERATED {
//     innerJoin      (0),
//     leftOuterJoin  (1),
//     fullOuterJoin  (2)} DEFAULT leftOuterJoin,
//   ...,
//   ...,
//   COMPONENTS OF              CommonArguments }
// ```
//
//
type SearchArgumentData struct {
	BaseObject           Name                        `asn1:"explicit,tag:0"`
	Subset               SearchArgumentData_subset   `asn1:"optional,explicit,tag:1"`
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
	JoinType             SearchArgumentData_joinType `asn1:"optional,explicit,tag:14"`
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

/* END_OF_SYMBOL_DEFINITION SearchArgumentData */ /* START_OF_SYMBOL_DEFINITION HierarchySelections */
// ### ASN.1 Definition:
//
// ```asn1
// HierarchySelections  ::=  BIT STRING {
//   self                  (0),
//   children              (1),
//   parent                (2),
//   hierarchy             (3),
//   top                   (4),
//   subtree               (5),
//   siblings              (6),
//   siblingChildren       (7),
//   siblingSubtree        (8),
//   all                   (9) }
// ```
type HierarchySelections = asn1.BitString

/* END_OF_SYMBOL_DEFINITION HierarchySelections */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Self */
const HierarchySelections_Self int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Self */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Children */
const HierarchySelections_Children int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Children */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Parent */
const HierarchySelections_Parent int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Parent */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Hierarchy */
const HierarchySelections_Hierarchy int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Hierarchy */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Top */
const HierarchySelections_Top int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Top */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Subtree */
const HierarchySelections_Subtree int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Subtree */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_Siblings */
const HierarchySelections_Siblings int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_Siblings */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_SiblingChildren */
const HierarchySelections_SiblingChildren int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_SiblingChildren */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_SiblingSubtree */
const HierarchySelections_SiblingSubtree int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_SiblingSubtree */

/* START_OF_SYMBOL_DEFINITION HierarchySelections_All */
const HierarchySelections_All int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION HierarchySelections_All */ /* START_OF_SYMBOL_DEFINITION SearchControlOptions */
// ### ASN.1 Definition:
//
// ```asn1
// SearchControlOptions  ::=  BIT STRING {
//   searchAliases         (0),
//   matchedValuesOnly     (1),
//   checkOverspecified    (2),
//   performExactly        (3),
//   includeAllAreas       (4),
//   noSystemRelaxation    (5),
//   dnAttribute           (6),
//   matchOnResidualName   (7),
//   entryCount            (8),
//   useSubset             (9),
//   separateFamilyMembers (10),
//   searchFamily          (11) }
// ```
type SearchControlOptions = asn1.BitString

/* END_OF_SYMBOL_DEFINITION SearchControlOptions */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_SearchAliases */
const SearchControlOptions_SearchAliases int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_SearchAliases */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_MatchedValuesOnly */
const SearchControlOptions_MatchedValuesOnly int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_MatchedValuesOnly */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_CheckOverspecified */
const SearchControlOptions_CheckOverspecified int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_CheckOverspecified */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_PerformExactly */
const SearchControlOptions_PerformExactly int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_PerformExactly */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_IncludeAllAreas */
const SearchControlOptions_IncludeAllAreas int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_IncludeAllAreas */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_NoSystemRelaxation */
const SearchControlOptions_NoSystemRelaxation int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_NoSystemRelaxation */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_DnAttribute */
const SearchControlOptions_DnAttribute int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_DnAttribute */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_MatchOnResidualName */
const SearchControlOptions_MatchOnResidualName int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_MatchOnResidualName */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_EntryCount */
const SearchControlOptions_EntryCount int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_EntryCount */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_UseSubset */
const SearchControlOptions_UseSubset int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_UseSubset */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_SeparateFamilyMembers */
const SearchControlOptions_SeparateFamilyMembers int32 = 10 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_SeparateFamilyMembers */

/* START_OF_SYMBOL_DEFINITION SearchControlOptions_SearchFamily */
const SearchControlOptions_SearchFamily int32 = 11 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SearchControlOptions_SearchFamily */ /* START_OF_SYMBOL_DEFINITION JoinArgument */
// ### ASN.1 Definition:
//
// ```asn1
// JoinArgument ::= SEQUENCE {
//   joinBaseObject  [0]  Name,
//   domainLocalID   [1]  DomainLocalID OPTIONAL,
//   joinSubset      [2]  ENUMERATED {
//     baseObject   (0),
//     oneLevel     (1),
//     wholeSubtree (2),
//     ... } DEFAULT baseObject,
//   joinFilter      [3]  Filter OPTIONAL,
//   joinAttributes  [4]  SEQUENCE SIZE (1..MAX) OF JoinAttPair OPTIONAL,
//   joinSelection   [5]  EntryInformationSelection,
//   ... }
// ```
//
//
type JoinArgument struct {
	JoinBaseObject Name                      `asn1:"explicit,tag:0"`
	DomainLocalID  DomainLocalID             `asn1:"optional,explicit,tag:1"`
	JoinSubset     JoinArgument_joinSubset   `asn1:"optional,explicit,tag:2"`
	JoinFilter     Filter                    `asn1:"optional,explicit,tag:3"`
	JoinAttributes [](JoinAttPair)           `asn1:"optional,explicit,tag:4"`
	JoinSelection  EntryInformationSelection `asn1:"explicit,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION JoinArgument */ /* START_OF_SYMBOL_DEFINITION DomainLocalID */
// ### ASN.1 Definition:
//
// ```asn1
// DomainLocalID  ::=  UnboundedDirectoryString
// ```
type DomainLocalID = UnboundedDirectoryString // DefinedType
/* END_OF_SYMBOL_DEFINITION DomainLocalID */ /* START_OF_SYMBOL_DEFINITION JoinAttPair */
// ### ASN.1 Definition:
//
// ```asn1
// JoinAttPair ::= SEQUENCE {
//   baseAtt      AttributeType,
//   joinAtt      AttributeType,
//   joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
//   ... }
// ```
//
//
type JoinAttPair struct {
	BaseAtt     AttributeType
	JoinAtt     AttributeType
	JoinContext [](JoinContextType) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION JoinAttPair */ /* START_OF_SYMBOL_DEFINITION JoinContextType */
// ### ASN.1 Definition:
//
// ```asn1
// JoinContextType  ::=  CONTEXT.&id({SupportedContexts})
// ```
type JoinContextType = asn1.ObjectIdentifier // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION JoinContextType */ /* START_OF_SYMBOL_DEFINITION SearchResult */
// ### ASN.1 Definition:
//
// ```asn1
// SearchResult  ::=  OPTIONALLY-PROTECTED { SearchResultData }
// ```
type SearchResult = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION SearchResult */ /* START_OF_SYMBOL_DEFINITION SearchResultData */
// ### ASN.1 Definition:
//
// ```asn1
// SearchResultData  ::=  CHOICE {
//   searchInfo                    SET {
//     name                          Name OPTIONAL,
//     entries                  [0]  SET OF EntryInformation,
//     partialOutcomeQualifier  [2]  PartialOutcomeQualifier OPTIONAL,
//     altMatching              [3]  BOOLEAN DEFAULT FALSE,
//     ...,
//     ...,
//     COMPONENTS OF                 CommonResults
//     },
//   uncorrelatedSearchInfo   [0]  SET OF SearchResult,
//   ... }
// ```
type SearchResultData = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SearchResultData */ /* START_OF_SYMBOL_DEFINITION AddEntryArgument */
// ### ASN.1 Definition:
//
// ```asn1
// AddEntryArgument  ::=  OPTIONALLY-PROTECTED { AddEntryArgumentData }
// ```
type AddEntryArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION AddEntryArgument */

// WARNING: If you encounter a bug encoding or decoding, it is probably the
// Entry field, which may need to be a `[]pkix.AttributeTypeAndValueSET`.
//
// ### ASN.1 Definition:
//
// ```asn1
//
//	AddEntryArgumentData ::= SET {
//	  object        [0]  Name,
//	  entry         [1]  SET OF Attribute{{SupportedAttributes}},
//	  targetSystem  [2]  AccessPoint OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonArguments }
//
// ```
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

/* END_OF_SYMBOL_DEFINITION AddEntryArgumentData */ /* START_OF_SYMBOL_DEFINITION AddEntryResult */
// ### ASN.1 Definition:
//
// ```asn1
// AddEntryResult  ::=  CHOICE {
//   null          NULL,
//   information   OPTIONALLY-PROTECTED-SEQ { AddEntryResultData },
//   ... }
// ```
type AddEntryResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AddEntryResult */ /* START_OF_SYMBOL_DEFINITION AddEntryResultData */
// ### ASN.1 Definition:
//
// ```asn1
// AddEntryResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type AddEntryResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AddEntryResultData */ /* START_OF_SYMBOL_DEFINITION RemoveEntryArgument */
// ### ASN.1 Definition:
//
// ```asn1
// RemoveEntryArgument  ::=  OPTIONALLY-PROTECTED { RemoveEntryArgumentData }
// ```
type RemoveEntryArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION RemoveEntryArgument */ /* START_OF_SYMBOL_DEFINITION RemoveEntryArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// RemoveEntryArgumentData ::= SET {
//   object     [0]  Name,
//   ...,
//   ...,
//   COMPONENTS OF   CommonArguments
//   }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION RemoveEntryArgumentData */ /* START_OF_SYMBOL_DEFINITION RemoveEntryResult */
// ### ASN.1 Definition:
//
// ```asn1
// RemoveEntryResult  ::=  CHOICE {
//   null          NULL,
//   information   OPTIONALLY-PROTECTED-SEQ { RemoveEntryResultData },
//   ... }
// ```
type RemoveEntryResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION RemoveEntryResult */ /* START_OF_SYMBOL_DEFINITION RemoveEntryResultData */
// ### ASN.1 Definition:
//
// ```asn1
// RemoveEntryResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type RemoveEntryResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION RemoveEntryResultData */ /* START_OF_SYMBOL_DEFINITION ModifyEntryArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyEntryArgument  ::=  OPTIONALLY-PROTECTED { ModifyEntryArgumentData }
// ```
type ModifyEntryArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ModifyEntryArgument */ /* START_OF_SYMBOL_DEFINITION ModifyEntryArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyEntryArgumentData ::= SET {
//   object     [0]  Name,
//   changes    [1]  SEQUENCE OF EntryModification,
//   selection  [2]  EntryInformationSelection OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF   CommonArguments }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ModifyEntryArgumentData */ /* START_OF_SYMBOL_DEFINITION ModifyEntryResult */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyEntryResult  ::=  CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyEntryResultData },
//   ... }
// ```
type ModifyEntryResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifyEntryResult */ /* START_OF_SYMBOL_DEFINITION ModifyEntryResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyEntryResultData ::= SEQUENCE {
//   entry    [0]  EntryInformation OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type ModifyEntryResultData struct {
	Entry              EntryInformation   `asn1:"optional,explicit,tag:0"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ModifyEntryResultData */ /* START_OF_SYMBOL_DEFINITION EntryModification */
// ### ASN.1 Definition:
//
// ```asn1
// EntryModification  ::=  CHOICE {
//   addAttribute     [0]  Attribute{{SupportedAttributes}},
//   removeAttribute  [1]  AttributeType,
//   addValues        [2]  Attribute{{SupportedAttributes}},
//   removeValues     [3]  Attribute{{SupportedAttributes}},
//   alterValues      [4]  AttributeTypeAndValue,
//   resetValue       [5]  AttributeType,
//   replaceValues    [6]  Attribute{{SupportedAttributes}},
//   ... }
// ```
type EntryModification = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EntryModification */ /* START_OF_SYMBOL_DEFINITION ModifyDNArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyDNArgument  ::=  OPTIONALLY-PROTECTED { ModifyDNArgumentData }
// ```
type ModifyDNArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION ModifyDNArgument */ /* START_OF_SYMBOL_DEFINITION ModifyDNArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyDNArgumentData ::= SET {
//   object        [0]  DistinguishedName,
//   newRDN        [1]  RelativeDistinguishedName,
//   deleteOldRDN  [2]  BOOLEAN DEFAULT FALSE,
//   newSuperior   [3]  DistinguishedName OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ModifyDNArgumentData */ /* START_OF_SYMBOL_DEFINITION ModifyDNResult */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyDNResult  ::=  CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyDNResultData },
//   ... }
// ```
type ModifyDNResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifyDNResult */ /* START_OF_SYMBOL_DEFINITION ModifyDNResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyDNResultData ::= SEQUENCE {
//   newRDN        RelativeDistinguishedName,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type ModifyDNResultData struct {
	NewRDN             RelativeDistinguishedName
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ModifyDNResultData */ /* START_OF_SYMBOL_DEFINITION ChangePasswordArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ChangePasswordArgument  ::=  OPTIONALLY-PROTECTED-SEQ { ChangePasswordArgumentData }
// ```
type ChangePasswordArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION ChangePasswordArgument */ /* START_OF_SYMBOL_DEFINITION ChangePasswordArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ChangePasswordArgumentData ::= SEQUENCE {
//   object   [0]  DistinguishedName,
//   oldPwd   [1]  UserPwd,
//   newPwd   [2]  UserPwd,
//   ... }
// ```
//
//
type ChangePasswordArgumentData struct {
	Object DistinguishedName `asn1:"explicit,tag:0"`
	OldPwd UserPwd           `asn1:"explicit,tag:1"`
	NewPwd UserPwd           `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION ChangePasswordArgumentData */ /* START_OF_SYMBOL_DEFINITION ChangePasswordResult */
// ### ASN.1 Definition:
//
// ```asn1
// ChangePasswordResult  ::=  CHOICE {
//   null        NULL,
//   information OPTIONALLY-PROTECTED-SEQ { ChangePasswordResultData },
//   ...}
// ```
type ChangePasswordResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ChangePasswordResult */ /* START_OF_SYMBOL_DEFINITION ChangePasswordResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ChangePasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type ChangePasswordResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ChangePasswordResultData */ /* START_OF_SYMBOL_DEFINITION AdministerPasswordArgument */
// ### ASN.1 Definition:
//
// ```asn1
// AdministerPasswordArgument  ::=
//   OPTIONALLY-PROTECTED-SEQ { AdministerPasswordArgumentData }
// ```
type AdministerPasswordArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION AdministerPasswordArgument */ /* START_OF_SYMBOL_DEFINITION AdministerPasswordArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// AdministerPasswordArgumentData ::= SEQUENCE {
//   object  [0]  DistinguishedName,
//   newPwd  [1]  UserPwd,
//   ... }
// ```
//
//
type AdministerPasswordArgumentData struct {
	Object DistinguishedName `asn1:"explicit,tag:0"`
	NewPwd UserPwd           `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION AdministerPasswordArgumentData */ /* START_OF_SYMBOL_DEFINITION AdministerPasswordResult */
// ### ASN.1 Definition:
//
// ```asn1
// AdministerPasswordResult  ::=  CHOICE {
//   null NULL,
//   information OPTIONALLY-PROTECTED-SEQ { AdministerPasswordResultData },
//   ...}
// ```
type AdministerPasswordResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AdministerPasswordResult */ /* START_OF_SYMBOL_DEFINITION AdministerPasswordResultData */
// ### ASN.1 Definition:
//
// ```asn1
// AdministerPasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type AdministerPasswordResultData struct {
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AdministerPasswordResultData */ /* START_OF_SYMBOL_DEFINITION LdapArgument */
// ### ASN.1 Definition:
//
// ```asn1
// LdapArgument  ::=  OPTIONALLY-PROTECTED-SEQ { LdapArgumentData }
// ```
type LdapArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION LdapArgument */ /* START_OF_SYMBOL_DEFINITION LdapArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// LdapArgumentData ::= SEQUENCE {
//   object        DistinguishedName,
//   ldapMessage   LDAPMessage,
//   linkId        LinkId  OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonArgumentsSeq }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION LdapArgumentData */ /* START_OF_SYMBOL_DEFINITION LinkId */
// ### ASN.1 Definition:
//
// ```asn1
// LinkId  ::=  INTEGER
// ```
type LinkId = int64

/* END_OF_SYMBOL_DEFINITION LinkId */ /* START_OF_SYMBOL_DEFINITION LdapResult */
// ### ASN.1 Definition:
//
// ```asn1
// LdapResult  ::=  OPTIONALLY-PROTECTED-SEQ { LdapResultData }
// ```
type LdapResult = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION LdapResult */ /* START_OF_SYMBOL_DEFINITION LdapResultData */
// ### ASN.1 Definition:
//
// ```asn1
// LdapResultData ::= SEQUENCE {
//   ldapMessages   SEQUENCE SIZE (1..MAX) OF LDAPMessage OPTIONAL,
//   returnToClient BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type LdapResultData struct {
	LdapMessages       [](asn1.RawValue)  `asn1:"optional"`
	ReturnToClient     bool               `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION LdapResultData */ /* START_OF_SYMBOL_DEFINITION LinkedArgument */
// ### ASN.1 Definition:
//
// ```asn1
// LinkedArgument  ::=  OPTIONALLY-PROTECTED-SEQ { LinkedArgumentData }
// ```
type LinkedArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION LinkedArgument */ /* START_OF_SYMBOL_DEFINITION LinkedArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// LinkedArgumentData ::= SEQUENCE {
//   object         DistinguishedName,
//   ldapMessage    LDAPMessage,
//   linkId         LinkId,
//   returnToClient BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF  CommonArgumentsSeq }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION LinkedArgumentData */ /* START_OF_SYMBOL_DEFINITION LinkedResult */
// ### ASN.1 Definition:
//
// ```asn1
// LinkedResult  ::=  NULL
// ```
type LinkedResult = asn1.RawValue // NullType
/* END_OF_SYMBOL_DEFINITION LinkedResult */ /* START_OF_SYMBOL_DEFINITION AbandonedData */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonedData ::= SET {
//     problem       AbandonedProblem OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF CommonResults }
// ```
//
//
type AbandonedData struct {
	Problem            AbandonedProblem   `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AbandonedData */ /* START_OF_SYMBOL_DEFINITION AbandonedProblem */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonedProblem   ::=  ENUMERATED {
//   pagingAbandoned (0) }
// ```
type AbandonedProblem = asn1.Enumerated

const (
	AbandonedProblem_PagingAbandoned AbandonedProblem = 0 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AbandonedProblem */ /* START_OF_SYMBOL_DEFINITION AbandonFailedData */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonFailedData ::= SET {
//   problem    [0]  AbandonProblem,
//   operation  [1]  InvokeId,
//   ...,
//   ...,
//   COMPONENTS OF   CommonResults }
// ```
//
//
type AbandonFailedData struct {
	Problem            AbandonProblem     `asn1:"explicit,tag:0"`
	Operation          InvokeId           `asn1:"explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AbandonFailedData */ /* START_OF_SYMBOL_DEFINITION AbandonProblem */
// ### ASN.1 Definition:
//
// ```asn1
// AbandonProblem  ::=  INTEGER {
//   noSuchOperation (1),
//   tooLate         (2),
//   cannotAbandon   (3) }
// ```
type AbandonProblem = int64

/* END_OF_SYMBOL_DEFINITION AbandonProblem */

/* START_OF_SYMBOL_DEFINITION AbandonProblem_NoSuchOperation */
const AbandonProblem_NoSuchOperation AbandonProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AbandonProblem_NoSuchOperation */

/* START_OF_SYMBOL_DEFINITION AbandonProblem_TooLate */
const AbandonProblem_TooLate AbandonProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AbandonProblem_TooLate */

/* START_OF_SYMBOL_DEFINITION AbandonProblem_CannotAbandon */
const AbandonProblem_CannotAbandon AbandonProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AbandonProblem_CannotAbandon */ /* START_OF_SYMBOL_DEFINITION AttributeErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeErrorData ::= SET {
//   object   [0]  Name,
//   problems [1]  SET OF SEQUENCE {
//     problem  [0]  AttributeProblem,
//     type     [1]  AttributeType,
//     value    [2]  AttributeValue OPTIONAL,
//     ...},
//   ...,
//   ...,
//   COMPONENTS OF CommonResults }
// ```
//
//
type AttributeErrorData struct {
	Object             Name                                 `asn1:"explicit,tag:0"`
	Problems           [](AttributeErrorData_problems_Item) `asn1:"explicit,tag:1,set"`
	SecurityParameters SecurityParameters                   `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName                    `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                                 `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)                        `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION AttributeErrorData */ /* START_OF_SYMBOL_DEFINITION AttributeProblem */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeProblem  ::=  INTEGER {
//   noSuchAttributeOrValue        (1),
//   invalidAttributeSyntax        (2),
//   undefinedAttributeType        (3),
//   inappropriateMatching         (4),
//   constraintViolation           (5),
//   attributeOrValueAlreadyExists (6),
//   contextViolation              (7) }
// ```
type AttributeProblem = int64

/* END_OF_SYMBOL_DEFINITION AttributeProblem */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_NoSuchAttributeOrValue */
const AttributeProblem_NoSuchAttributeOrValue AttributeProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_NoSuchAttributeOrValue */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_InvalidAttributeSyntax */
const AttributeProblem_InvalidAttributeSyntax AttributeProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_InvalidAttributeSyntax */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_UndefinedAttributeType */
const AttributeProblem_UndefinedAttributeType AttributeProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_UndefinedAttributeType */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_InappropriateMatching */
const AttributeProblem_InappropriateMatching AttributeProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_InappropriateMatching */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_ConstraintViolation */
const AttributeProblem_ConstraintViolation AttributeProblem = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_ConstraintViolation */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_AttributeOrValueAlreadyExists */
const AttributeProblem_AttributeOrValueAlreadyExists AttributeProblem = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_AttributeOrValueAlreadyExists */

/* START_OF_SYMBOL_DEFINITION AttributeProblem_ContextViolation */
const AttributeProblem_ContextViolation AttributeProblem = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttributeProblem_ContextViolation */ /* START_OF_SYMBOL_DEFINITION NameErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// NameErrorData ::= SET {
//   problem  [0]  NameProblem,
//   matched  [1]  Name,
//   ...,
//   ...,
//   COMPONENTS OF CommonResults }
// ```
//
//
type NameErrorData struct {
	Problem            NameProblem        `asn1:"explicit,tag:0"`
	Matched            Name               `asn1:"explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION NameErrorData */ /* START_OF_SYMBOL_DEFINITION NameProblem */
// ### ASN.1 Definition:
//
// ```asn1
// NameProblem  ::=  INTEGER {
//   noSuchObject              (1),
//   aliasProblem              (2),
//   invalidAttributeSyntax    (3),
//   aliasDereferencingProblem (4)
//   -- not to be used         (5)-- }
// ```
type NameProblem = int64

/* END_OF_SYMBOL_DEFINITION NameProblem */

/* START_OF_SYMBOL_DEFINITION NameProblem_NoSuchObject */
const NameProblem_NoSuchObject NameProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION NameProblem_NoSuchObject */

/* START_OF_SYMBOL_DEFINITION NameProblem_AliasProblem */
const NameProblem_AliasProblem NameProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION NameProblem_AliasProblem */

/* START_OF_SYMBOL_DEFINITION NameProblem_InvalidAttributeSyntax */
const NameProblem_InvalidAttributeSyntax NameProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION NameProblem_InvalidAttributeSyntax */

/* START_OF_SYMBOL_DEFINITION NameProblem_AliasDereferencingProblem */
const NameProblem_AliasDereferencingProblem NameProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION NameProblem_AliasDereferencingProblem */ /* START_OF_SYMBOL_DEFINITION ReferralData */
// ### ASN.1 Definition:
//
// ```asn1
// ReferralData ::= SET {
//   candidate  [0] ContinuationReference,
//   ...,
//   ...,
//   COMPONENTS OF  CommonResults }
// ```
//
//
type ReferralData struct {
	Candidate          ContinuationReference `asn1:"explicit,tag:0"`
	SecurityParameters SecurityParameters    `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName     `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                  `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)         `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ReferralData */ /* START_OF_SYMBOL_DEFINITION SecurityErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityErrorData ::= SET {
//   problem      [0]  SecurityProblem,
//   spkmInfo     [1]  SPKM-ERROR OPTIONAL,
//   encPwdInfo   [2]  EncPwdInfo OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResults }
// ```
//
//
type SecurityErrorData struct {
	Problem            SecurityProblem    `asn1:"explicit,tag:0"`
	SpkmInfo           SPKM_ERROR         `asn1:"optional,explicit,tag:1"`
	EncPwdInfo         EncPwdInfo         `asn1:"optional,explicit,tag:2"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION SecurityErrorData */ /* START_OF_SYMBOL_DEFINITION SecurityProblem */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityProblem  ::=  INTEGER {
//   inappropriateAuthentication     (1),
//   invalidCredentials              (2),
//   insufficientAccessRights        (3),
//   invalidSignature                (4),
//   protectionRequired              (5),
//   noInformation                   (6),
//   blockedCredentials              (7),
//   -- invalidQOPMatch              (8), obsolete
//   spkmError                       (9),
//   unsupportedAuthenticationMethod (10),
//   passwordExpired                 (11),
//   inappropriateAlgorithms         (12) }
// ```
type SecurityProblem = int64

/* END_OF_SYMBOL_DEFINITION SecurityProblem */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_InappropriateAuthentication */
const SecurityProblem_InappropriateAuthentication SecurityProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_InappropriateAuthentication */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_InvalidCredentials */
const SecurityProblem_InvalidCredentials SecurityProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_InvalidCredentials */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_InsufficientAccessRights */
const SecurityProblem_InsufficientAccessRights SecurityProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_InsufficientAccessRights */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_InvalidSignature */
const SecurityProblem_InvalidSignature SecurityProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_InvalidSignature */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_ProtectionRequired */
const SecurityProblem_ProtectionRequired SecurityProblem = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_ProtectionRequired */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_NoInformation */
const SecurityProblem_NoInformation SecurityProblem = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_NoInformation */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_BlockedCredentials */
const SecurityProblem_BlockedCredentials SecurityProblem = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_BlockedCredentials */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_SpkmError */
const SecurityProblem_SpkmError SecurityProblem = 9 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_SpkmError */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_UnsupportedAuthenticationMethod */
const SecurityProblem_UnsupportedAuthenticationMethod SecurityProblem = 10 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_UnsupportedAuthenticationMethod */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_PasswordExpired */
const SecurityProblem_PasswordExpired SecurityProblem = 11 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_PasswordExpired */

/* START_OF_SYMBOL_DEFINITION SecurityProblem_InappropriateAlgorithms */
const SecurityProblem_InappropriateAlgorithms SecurityProblem = 12 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityProblem_InappropriateAlgorithms */ /* START_OF_SYMBOL_DEFINITION EncPwdInfo */
// ### ASN.1 Definition:
//
// ```asn1
// EncPwdInfo ::= SEQUENCE {
//   algorithms     [0]  SEQUENCE OF AlgorithmIdentifier
//                         {{SupportedAlgorithms}} OPTIONAL,
//   pwdQualityRule [1]  SEQUENCE OF AttributeTypeAndValue OPTIONAL,
//   ... }
// ```
//
//
type EncPwdInfo struct {
	Algorithms     [](pkix.AlgorithmIdentifier)   `asn1:"optional,explicit,tag:0"`
	PwdQualityRule [](pkix.AttributeTypeAndValue) `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION EncPwdInfo */ /* START_OF_SYMBOL_DEFINITION ServiceErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceErrorData ::= SET {
//   problem   [0]  ServiceProblem,
//   ...,
//   ...,
//   COMPONENTS OF  CommonResults }
// ```
//
//
type ServiceErrorData struct {
	Problem            ServiceProblem     `asn1:"explicit,tag:0"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ServiceErrorData */ /* START_OF_SYMBOL_DEFINITION ServiceProblem */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceProblem  ::=  INTEGER {
//   busy                         (1),
//   unavailable                  (2),
//   unwillingToPerform           (3),
//   chainingRequired             (4),
//   unableToProceed              (5),
//   invalidReference             (6),
//   timeLimitExceeded            (7),
//   administrativeLimitExceeded  (8),
//   loopDetected                 (9),
//   unavailableCriticalExtension (10),
//   outOfScope                   (11),
//   ditError                     (12),
//   invalidQueryReference        (13),
//   requestedServiceNotAvailable (14),
//   unsupportedMatchingUse       (15),
//   ambiguousKeyAttributes       (16),
//   saslBindInProgress           (17),
//   notSupportedByLDAP           (18) }
// ```
type ServiceProblem = int64

/* END_OF_SYMBOL_DEFINITION ServiceProblem */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_Busy */
const ServiceProblem_Busy ServiceProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_Busy */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_Unavailable */
const ServiceProblem_Unavailable ServiceProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_Unavailable */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_UnwillingToPerform */
const ServiceProblem_UnwillingToPerform ServiceProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_UnwillingToPerform */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_ChainingRequired */
const ServiceProblem_ChainingRequired ServiceProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_ChainingRequired */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_UnableToProceed */
const ServiceProblem_UnableToProceed ServiceProblem = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_UnableToProceed */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_InvalidReference */
const ServiceProblem_InvalidReference ServiceProblem = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_InvalidReference */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_TimeLimitExceeded */
const ServiceProblem_TimeLimitExceeded ServiceProblem = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_TimeLimitExceeded */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_AdministrativeLimitExceeded */
const ServiceProblem_AdministrativeLimitExceeded ServiceProblem = 8 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_AdministrativeLimitExceeded */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_LoopDetected */
const ServiceProblem_LoopDetected ServiceProblem = 9 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_LoopDetected */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_UnavailableCriticalExtension */
const ServiceProblem_UnavailableCriticalExtension ServiceProblem = 10 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_UnavailableCriticalExtension */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_OutOfScope */
const ServiceProblem_OutOfScope ServiceProblem = 11 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_OutOfScope */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_DitError */
const ServiceProblem_DitError ServiceProblem = 12 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_DitError */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_InvalidQueryReference */
const ServiceProblem_InvalidQueryReference ServiceProblem = 13 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_InvalidQueryReference */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_RequestedServiceNotAvailable */
const ServiceProblem_RequestedServiceNotAvailable ServiceProblem = 14 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_RequestedServiceNotAvailable */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_UnsupportedMatchingUse */
const ServiceProblem_UnsupportedMatchingUse ServiceProblem = 15 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_UnsupportedMatchingUse */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_AmbiguousKeyAttributes */
const ServiceProblem_AmbiguousKeyAttributes ServiceProblem = 16 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_AmbiguousKeyAttributes */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_SaslBindInProgress */
const ServiceProblem_SaslBindInProgress ServiceProblem = 17 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_SaslBindInProgress */

/* START_OF_SYMBOL_DEFINITION ServiceProblem_NotSupportedByLDAP */
const ServiceProblem_NotSupportedByLDAP ServiceProblem = 18 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceProblem_NotSupportedByLDAP */ /* START_OF_SYMBOL_DEFINITION UpdateErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateErrorData ::= SET {
//   problem        [0]  UpdateProblem,
//   attributeInfo  [1]  SET SIZE (1..MAX) OF CHOICE {
//     attributeType       AttributeType,
//     attribute           Attribute{{SupportedAttributes}},
//     ... } OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF       CommonResults }
// ```
//
//
type UpdateErrorData struct {
	Problem            UpdateProblem                          `asn1:"explicit,tag:0"`
	AttributeInfo      [](UpdateErrorData_attributeInfo_Item) `asn1:"optional,explicit,tag:1,set"`
	SecurityParameters SecurityParameters                     `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName                      `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                                   `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)                          `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION UpdateErrorData */ /* START_OF_SYMBOL_DEFINITION UpdateProblem */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateProblem  ::=  INTEGER {
//   namingViolation                   (1),
//   objectClassViolation              (2),
//   notAllowedOnNonLeaf               (3),
//   notAllowedOnRDN                   (4),
//   entryAlreadyExists                (5),
//   affectsMultipleDSAs               (6),
//   objectClassModificationProhibited (7),
//   noSuchSuperior                    (8),
//   notAncestor                       (9),
//   parentNotAncestor                 (10),
//   hierarchyRuleViolation            (11),
//   familyRuleViolation               (12),
//   insufficientPasswordQuality       (13),
//   passwordInHistory                 (14),
//   noPasswordSlot                    (15) }
// ```
type UpdateProblem = int64

/* END_OF_SYMBOL_DEFINITION UpdateProblem */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NamingViolation */
const UpdateProblem_NamingViolation UpdateProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NamingViolation */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_ObjectClassViolation */
const UpdateProblem_ObjectClassViolation UpdateProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_ObjectClassViolation */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NotAllowedOnNonLeaf */
const UpdateProblem_NotAllowedOnNonLeaf UpdateProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NotAllowedOnNonLeaf */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NotAllowedOnRDN */
const UpdateProblem_NotAllowedOnRDN UpdateProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NotAllowedOnRDN */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_EntryAlreadyExists */
const UpdateProblem_EntryAlreadyExists UpdateProblem = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_EntryAlreadyExists */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_AffectsMultipleDSAs */
const UpdateProblem_AffectsMultipleDSAs UpdateProblem = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_AffectsMultipleDSAs */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_ObjectClassModificationProhibited */
const UpdateProblem_ObjectClassModificationProhibited UpdateProblem = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_ObjectClassModificationProhibited */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NoSuchSuperior */
const UpdateProblem_NoSuchSuperior UpdateProblem = 8 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NoSuchSuperior */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NotAncestor */
const UpdateProblem_NotAncestor UpdateProblem = 9 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NotAncestor */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_ParentNotAncestor */
const UpdateProblem_ParentNotAncestor UpdateProblem = 10 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_ParentNotAncestor */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_HierarchyRuleViolation */
const UpdateProblem_HierarchyRuleViolation UpdateProblem = 11 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_HierarchyRuleViolation */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_FamilyRuleViolation */
const UpdateProblem_FamilyRuleViolation UpdateProblem = 12 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_FamilyRuleViolation */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_InsufficientPasswordQuality */
const UpdateProblem_InsufficientPasswordQuality UpdateProblem = 13 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_InsufficientPasswordQuality */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_PasswordInHistory */
const UpdateProblem_PasswordInHistory UpdateProblem = 14 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_PasswordInHistory */

/* START_OF_SYMBOL_DEFINITION UpdateProblem_NoPasswordSlot */
const UpdateProblem_NoPasswordSlot UpdateProblem = 15 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION UpdateProblem_NoPasswordSlot */ /* START_OF_SYMBOL_DEFINITION Id_at_family_information */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-family-information OBJECT IDENTIFIER ::= {id-at 64}
// ```
//
//
var Id_at_family_information asn1.ObjectIdentifier = []int{2, 5, 4, 64} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_family_information */ /* START_OF_SYMBOL_DEFINITION ServiceControls_priority */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceControls-priority ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type ServiceControls_priority = int64

/* END_OF_SYMBOL_DEFINITION ServiceControls_priority */

/* START_OF_SYMBOL_DEFINITION ServiceControls_priority_Low */
const ServiceControls_priority_Low ServiceControls_priority = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceControls_priority_Low */

/* START_OF_SYMBOL_DEFINITION ServiceControls_priority_Medium */
const ServiceControls_priority_Medium ServiceControls_priority = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceControls_priority_Medium */

/* START_OF_SYMBOL_DEFINITION ServiceControls_priority_High */
const ServiceControls_priority_High ServiceControls_priority = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceControls_priority_High */ /* START_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceControls-scopeOfReferral ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type ServiceControls_scopeOfReferral = int64

/* END_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral */

/* START_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral_Dmd */
const ServiceControls_scopeOfReferral_Dmd ServiceControls_scopeOfReferral = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral_Dmd */

/* START_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral_Country */
const ServiceControls_scopeOfReferral_Country ServiceControls_scopeOfReferral = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ServiceControls_scopeOfReferral_Country */ /* START_OF_SYMBOL_DEFINITION ServiceControls_manageDSAITPlaneRef */
// ### ASN.1 Definition:
//
// ```asn1
// ServiceControls-manageDSAITPlaneRef ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ServiceControls_manageDSAITPlaneRef struct {
	DsaName     Name
	AgreementID AgreementID
}

/* END_OF_SYMBOL_DEFINITION ServiceControls_manageDSAITPlaneRef */ /* START_OF_SYMBOL_DEFINITION EntryInformationSelection_attributes */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformationSelection-attributes ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EntryInformationSelection_attributes = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EntryInformationSelection_attributes */ /* START_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformationSelection-infoTypes ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type EntryInformationSelection_infoTypes = int64

/* END_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes */

/* START_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes_AttributeTypesOnly */
const EntryInformationSelection_infoTypes_AttributeTypesOnly EntryInformationSelection_infoTypes = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes_AttributeTypesOnly */

/* START_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes_AttributeTypesAndValues */
const EntryInformationSelection_infoTypes_AttributeTypesAndValues EntryInformationSelection_infoTypes = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION EntryInformationSelection_infoTypes_AttributeTypesAndValues */ /* START_OF_SYMBOL_DEFINITION EntryInformationSelection_extraAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformationSelection-extraAttributes ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EntryInformationSelection_extraAttributes = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EntryInformationSelection_extraAttributes */ /* START_OF_SYMBOL_DEFINITION TypeAndContextAssertion_contextAssertions */
// ### ASN.1 Definition:
//
// ```asn1
// TypeAndContextAssertion-contextAssertions ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type TypeAndContextAssertion_contextAssertions = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TypeAndContextAssertion_contextAssertions */ /* START_OF_SYMBOL_DEFINITION FamilyReturn_memberSelect */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyReturn-memberSelect ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type FamilyReturn_memberSelect = asn1.Enumerated

const (
	FamilyReturn_memberSelect_ContributingEntriesOnly  FamilyReturn_memberSelect = 1 // LONG_NAMED_ENUMERATED_VALUE,
	FamilyReturn_memberSelect_ParticipatingEntriesOnly FamilyReturn_memberSelect = 2 // LONG_NAMED_ENUMERATED_VALUE,
	FamilyReturn_memberSelect_CompoundEntry            FamilyReturn_memberSelect = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION FamilyReturn_memberSelect */ /* START_OF_SYMBOL_DEFINITION EntryInformation_information_Item */
// ### ASN.1 Definition:
//
// ```asn1
// EntryInformation-information-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EntryInformation_information_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EntryInformation_information_Item */ /* START_OF_SYMBOL_DEFINITION FamilyEntry_information_Item */
// ### ASN.1 Definition:
//
// ```asn1
// FamilyEntry-information-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type FamilyEntry_information_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION FamilyEntry_information_Item */ /* START_OF_SYMBOL_DEFINITION FilterItem_substrings_strings_Item */
// ### ASN.1 Definition:
//
// ```asn1
// FilterItem-substrings-strings-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type FilterItem_substrings_strings_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION FilterItem_substrings_strings_Item */ /* START_OF_SYMBOL_DEFINITION FilterItem_substrings */
// ### ASN.1 Definition:
//
// ```asn1
// FilterItem-substrings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type FilterItem_substrings struct {
	Type    asn1.ObjectIdentifier
	Strings [](FilterItem_substrings_strings_Item)
}

/* END_OF_SYMBOL_DEFINITION FilterItem_substrings */ /* START_OF_SYMBOL_DEFINITION PagedResultsRequest_newRequest */
// ### ASN.1 Definition:
//
// ```asn1
// PagedResultsRequest-newRequest ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type PagedResultsRequest_newRequest struct {
	PageSize   int
	SortKeys   [](SortKey) `asn1:"optional"`
	Reverse    bool        `asn1:"optional,explicit,tag:1"`
	Unmerged   bool        `asn1:"optional,explicit,tag:2"`
	PageNumber int         `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION PagedResultsRequest_newRequest */ /* START_OF_SYMBOL_DEFINITION SimpleCredentials_validity_time1 */
// ### ASN.1 Definition:
//
// ```asn1
// SimpleCredentials-validity-time1 ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type SimpleCredentials_validity_time1 = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SimpleCredentials_validity_time1 */ /* START_OF_SYMBOL_DEFINITION SimpleCredentials_validity_time2 */
// ### ASN.1 Definition:
//
// ```asn1
// SimpleCredentials-validity-time2 ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type SimpleCredentials_validity_time2 = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SimpleCredentials_validity_time2 */ /* START_OF_SYMBOL_DEFINITION SimpleCredentials_validity */
// ### ASN.1 Definition:
//
// ```asn1
// SimpleCredentials-validity ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type SimpleCredentials_validity struct {
	Time1   SimpleCredentials_validity_time1 `asn1:"optional,explicit,tag:0"`
	Time2   SimpleCredentials_validity_time2 `asn1:"optional,explicit,tag:1"`
	Random1 asn1.BitString                   `asn1:"optional,explicit,tag:2"`
	Random2 asn1.BitString                   `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION SimpleCredentials_validity */ /* START_OF_SYMBOL_DEFINITION SimpleCredentials_password */
// ### ASN.1 Definition:
//
// ```asn1
// SimpleCredentials-password ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type SimpleCredentials_password = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SimpleCredentials_password */ /* START_OF_SYMBOL_DEFINITION PwdResponseValue_warning */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponseValue-warning ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type PwdResponseValue_warning = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PwdResponseValue_warning */ /* START_OF_SYMBOL_DEFINITION PwdResponseValue_error */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponseValue-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type PwdResponseValue_error = asn1.Enumerated

const (
	PwdResponseValue_error_PasswordExpired  PwdResponseValue_error = 0 // LONG_NAMED_ENUMERATED_VALUE,
	PwdResponseValue_error_ChangeAfterReset PwdResponseValue_error = 1 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION PwdResponseValue_error */ /* START_OF_SYMBOL_DEFINITION DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1-error ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1_error */ /* START_OF_SYMBOL_DEFINITION ModifyRights_Item_item */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyRights-Item-item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ModifyRights_Item_item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_item */ /* START_OF_SYMBOL_DEFINITION ModifyRights_Item_permission */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyRights-Item-permission ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type ModifyRights_Item_permission = asn1.BitString

/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_permission */

/* START_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Add */
const ModifyRights_Item_permission_Add int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Add */

/* START_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Remove */
const ModifyRights_Item_permission_Remove int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Remove */

/* START_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Rename */
const ModifyRights_Item_permission_Rename int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Rename */

/* START_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Move */
const ModifyRights_Item_permission_Move int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ModifyRights_Item_permission_Move */ /* START_OF_SYMBOL_DEFINITION ModifyRights_Item */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyRights-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ModifyRights_Item struct {
	Item       ModifyRights_Item_item
	Permission ModifyRights_Item_permission `asn1:"explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION ModifyRights_Item */ /* START_OF_SYMBOL_DEFINITION ListResultData_listInfo_subordinates_Item */
// ### ASN.1 Definition:
//
// ```asn1
// ListResultData-listInfo-subordinates-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ListResultData_listInfo_subordinates_Item struct {
	Rdn        pkix.RelativeDistinguishedNameSET
	AliasEntry bool `asn1:"optional,explicit,tag:0"`
	FromEntry  bool `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION ListResultData_listInfo_subordinates_Item */ /* START_OF_SYMBOL_DEFINITION ListResultData_listInfo */
// ### ASN.1 Definition:
//
// ```asn1
// ListResultData-listInfo ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ListResultData_listInfo struct {
	Name                    Name                                          `asn1:"optional"`
	Subordinates            [](ListResultData_listInfo_subordinates_Item) `asn1:"explicit,tag:1,set"`
	PartialOutcomeQualifier PartialOutcomeQualifier                       `asn1:"optional,explicit,tag:2"`
	SecurityParameters      SecurityParameters                            `asn1:"optional,explicit,tag:30"`
	Performer               DistinguishedName                             `asn1:"optional,explicit,tag:29"`
	AliasDereferenced       bool                                          `asn1:"optional,explicit,tag:28"`
	Notification            [](Attribute)                                 `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ListResultData_listInfo */ /* START_OF_SYMBOL_DEFINITION PartialOutcomeQualifier_entryCount */
// ### ASN.1 Definition:
//
// ```asn1
// PartialOutcomeQualifier-entryCount ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type PartialOutcomeQualifier_entryCount = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PartialOutcomeQualifier_entryCount */ /* START_OF_SYMBOL_DEFINITION SearchArgumentData_subset */
// ### ASN.1 Definition:
//
// ```asn1
// SearchArgumentData-subset ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type SearchArgumentData_subset = int64

/* END_OF_SYMBOL_DEFINITION SearchArgumentData_subset */

/* START_OF_SYMBOL_DEFINITION SearchArgumentData_subset_BaseObject */
const SearchArgumentData_subset_BaseObject SearchArgumentData_subset = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SearchArgumentData_subset_BaseObject */

/* START_OF_SYMBOL_DEFINITION SearchArgumentData_subset_OneLevel */
const SearchArgumentData_subset_OneLevel SearchArgumentData_subset = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SearchArgumentData_subset_OneLevel */

/* START_OF_SYMBOL_DEFINITION SearchArgumentData_subset_WholeSubtree */
const SearchArgumentData_subset_WholeSubtree SearchArgumentData_subset = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SearchArgumentData_subset_WholeSubtree */ /* START_OF_SYMBOL_DEFINITION SearchArgumentData_joinType */
// ### ASN.1 Definition:
//
// ```asn1
// SearchArgumentData-joinType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type SearchArgumentData_joinType = asn1.Enumerated

const (
	SearchArgumentData_joinType_InnerJoin     SearchArgumentData_joinType = 0 // LONG_NAMED_ENUMERATED_VALUE,
	SearchArgumentData_joinType_LeftOuterJoin SearchArgumentData_joinType = 1 // LONG_NAMED_ENUMERATED_VALUE,
	SearchArgumentData_joinType_FullOuterJoin SearchArgumentData_joinType = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION SearchArgumentData_joinType */ /* START_OF_SYMBOL_DEFINITION JoinArgument_joinSubset */
// ### ASN.1 Definition:
//
// ```asn1
// JoinArgument-joinSubset ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type JoinArgument_joinSubset = asn1.Enumerated

const (
	JoinArgument_joinSubset_BaseObject   JoinArgument_joinSubset = 0 // LONG_NAMED_ENUMERATED_VALUE,
	JoinArgument_joinSubset_OneLevel     JoinArgument_joinSubset = 1 // LONG_NAMED_ENUMERATED_VALUE,
	JoinArgument_joinSubset_WholeSubtree JoinArgument_joinSubset = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION JoinArgument_joinSubset */ /* START_OF_SYMBOL_DEFINITION SearchResultData_searchInfo */
// ### ASN.1 Definition:
//
// ```asn1
// SearchResultData-searchInfo ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION SearchResultData_searchInfo */ /* START_OF_SYMBOL_DEFINITION AttributeErrorData_problems_Item */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeErrorData-problems-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type AttributeErrorData_problems_Item struct {
	Problem AttributeProblem `asn1:"explicit,tag:0"`
	Type    AttributeType    `asn1:"explicit,tag:1"`
	Value   AttributeValue   `asn1:"optional,explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION AttributeErrorData_problems_Item */ /* START_OF_SYMBOL_DEFINITION UpdateErrorData_attributeInfo_Item */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateErrorData-attributeInfo-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type UpdateErrorData_attributeInfo_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UpdateErrorData_attributeInfo_Item */
