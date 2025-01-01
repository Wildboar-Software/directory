package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION DsaReferralData */
// ### ASN.1 Definition:
//
// ```asn1
// DsaReferralData ::= SET {
//   reference      [0]  ContinuationReference,
//   contextPrefix  [1]  DistinguishedName OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF       CommonResults }
// ```
//
//
type DsaReferralData struct {
	Reference          ContinuationReference `asn1:"explicit,tag:0"`
	ContextPrefix      DistinguishedName     `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters    `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName     `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                  `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)         `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION DsaReferralData */ /* START_OF_SYMBOL_DEFINITION ChainingArguments */
// ### ASN.1 Definition:
//
// ```asn1
// ChainingArguments ::= SET {
//   originator                 [0]  DistinguishedName OPTIONAL,
//   targetObject               [1]  DistinguishedName OPTIONAL,
//   operationProgress          [2]  OperationProgress
//                                DEFAULT {nameResolutionPhase notStarted},
//   traceInformation           [3]  TraceInformation,
//   aliasDereferenced          [4]  BOOLEAN DEFAULT FALSE,
//   aliasedRDNs                [5]  INTEGER OPTIONAL,
//   returnCrossRefs            [6]  BOOLEAN DEFAULT FALSE,
//   referenceType              [7]  ReferenceType DEFAULT superior,
//   info                       [8]  DomainInfo OPTIONAL,
//   timeLimit                  [9]  Time OPTIONAL,
//   securityParameters         [10] SecurityParameters DEFAULT {},
//   entryOnly                  [11] BOOLEAN DEFAULT FALSE,
//   uniqueIdentifier           [12] UniqueIdentifier OPTIONAL,
//   authenticationLevel        [13] AuthenticationLevel OPTIONAL,
//   exclusions                 [14] Exclusions OPTIONAL,
//   excludeShadows             [15] BOOLEAN DEFAULT FALSE,
//   nameResolveOnMaster        [16] BOOLEAN DEFAULT FALSE,
//   operationIdentifier        [17] INTEGER OPTIONAL,
//   searchRuleId               [18] SearchRuleId OPTIONAL,
//   chainedRelaxation          [19] MRMapping OPTIONAL,
//   relatedEntry               [20] INTEGER OPTIONAL,
//   dspPaging                  [21] BOOLEAN DEFAULT FALSE,
//   --                         [22] Not to be used
//   --                         [23] Not to be used
//   excludeWriteableCopies     [24] BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type ChainingArguments struct {
	Originator             DistinguishedName   `asn1:"optional,explicit,tag:0"`
	TargetObject           DistinguishedName   `asn1:"optional,explicit,tag:1"`
	OperationProgress      OperationProgress   `asn1:"optional,explicit,tag:2"`
	TraceInformation       TraceInformation    `asn1:"explicit,tag:3"`
	AliasDereferenced      bool                `asn1:"optional,explicit,tag:4"`
	AliasedRDNs            int                 `asn1:"optional,explicit,tag:5"`
	ReturnCrossRefs        bool                `asn1:"optional,explicit,tag:6"`
	ReferenceType          ReferenceType       `asn1:"optional,explicit,tag:7"`
	Info                   DomainInfo          `asn1:"optional,explicit,tag:8"`
	TimeLimit              Time                `asn1:"optional,explicit,tag:9"`
	SecurityParameters     SecurityParameters  `asn1:"optional,explicit,tag:10"`
	EntryOnly              bool                `asn1:"optional,explicit,tag:11"`
	UniqueIdentifier       UniqueIdentifier    `asn1:"optional,explicit,tag:12"`
	AuthenticationLevel    AuthenticationLevel `asn1:"optional,explicit,tag:13"`
	Exclusions             Exclusions          `asn1:"optional,explicit,tag:14"`
	ExcludeShadows         bool                `asn1:"optional,explicit,tag:15"`
	NameResolveOnMaster    bool                `asn1:"optional,explicit,tag:16"`
	OperationIdentifier    int                 `asn1:"optional,explicit,tag:17"`
	SearchRuleId           SearchRuleId        `asn1:"optional,explicit,tag:18"`
	ChainedRelaxation      MRMapping           `asn1:"optional,explicit,tag:19"`
	RelatedEntry           int                 `asn1:"optional,explicit,tag:20"`
	DspPaging              bool                `asn1:"optional,explicit,tag:21"`
	ExcludeWriteableCopies bool                `asn1:"optional,explicit,tag:24"`
}

/* END_OF_SYMBOL_DEFINITION ChainingArguments */ /* START_OF_SYMBOL_DEFINITION Time */
// ### ASN.1 Definition:
//
// ```asn1
// Time  ::=  CHOICE {
//   utcTime          UTCTime,
//   generalizedTime  GeneralizedTime,
//   ... }
// ```
type Time = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Time */ /* START_OF_SYMBOL_DEFINITION DomainInfo */
// ### ASN.1 Definition:
//
// ```asn1
// DomainInfo  ::=  ABSTRACT-SYNTAX.&Type
// ```
type DomainInfo = asn1.RawValue // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION DomainInfo */ /* START_OF_SYMBOL_DEFINITION ChainingResults */
// ### ASN.1 Definition:
//
// ```asn1
// ChainingResults ::= SET {
//   info                [0]  DomainInfo OPTIONAL,
//   crossReferences     [1]  SEQUENCE SIZE (1..MAX) OF CrossReference OPTIONAL,
//   securityParameters  [2]  SecurityParameters DEFAULT {},
//   alreadySearched     [3]  Exclusions OPTIONAL,
//   ... }
// ```
//
//
type ChainingResults struct {
	Info               DomainInfo         `asn1:"optional,explicit,tag:0"`
	CrossReferences    [](CrossReference) `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:2"`
	AlreadySearched    Exclusions         `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION ChainingResults */ /* START_OF_SYMBOL_DEFINITION CrossReference */
// ### ASN.1 Definition:
//
// ```asn1
// CrossReference ::= SET {
//   contextPrefix  [0]  DistinguishedName,
//   accessPoint    [1]  AccessPointInformation,
//   ... }
// ```
//
//
type CrossReference struct {
	ContextPrefix DistinguishedName      `asn1:"explicit,tag:0"`
	AccessPoint   AccessPointInformation `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION CrossReference */ /* START_OF_SYMBOL_DEFINITION OperationProgress */
// ### ASN.1 Definition:
//
// ```asn1
// OperationProgress ::= SET {
//   nameResolutionPhase  [0]  ENUMERATED {
//     notStarted  (1),
//     proceeding  (2),
//     completed   (3),
//     ... },
//   nextRDNToBeResolved  [1]  INTEGER OPTIONAL,
//   ... }
// ```
//
//
type OperationProgress struct {
	NameResolutionPhase OperationProgress_nameResolutionPhase `asn1:"explicit,tag:0"`
	NextRDNToBeResolved int                                   `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION OperationProgress */ /* START_OF_SYMBOL_DEFINITION TraceInformation */
// ### ASN.1 Definition:
//
// ```asn1
// TraceInformation  ::=  SEQUENCE OF TraceItem
// ```
type TraceInformation = [](TraceItem) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION TraceInformation */ /* START_OF_SYMBOL_DEFINITION TraceItem */
// ### ASN.1 Definition:
//
// ```asn1
// TraceItem ::= SET {
//   dsa                [0]  Name,
//   targetObject       [1]  Name OPTIONAL,
//   operationProgress  [2]  OperationProgress,
//   ... }
// ```
//
//
type TraceItem struct {
	Dsa               Name              `asn1:"explicit,tag:0"`
	TargetObject      Name              `asn1:"optional,explicit,tag:1"`
	OperationProgress OperationProgress `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION TraceItem */ /* START_OF_SYMBOL_DEFINITION ReferenceType */
// ### ASN.1 Definition:
//
// ```asn1
// ReferenceType  ::=  ENUMERATED {
//   superior               (1),
//   subordinate            (2),
//   cross                  (3),
//   nonSpecificSubordinate (4),
//   supplier               (5),
//   master                 (6),
//   immediateSuperior      (7),
//   self                   (8),
//   ditBridge              (9),
//   ... }
// ```
type ReferenceType = asn1.Enumerated

const (
	ReferenceType_Superior               ReferenceType = 1 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_Subordinate            ReferenceType = 2 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_Cross                  ReferenceType = 3 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_NonSpecificSubordinate ReferenceType = 4 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_Supplier               ReferenceType = 5 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_Master                 ReferenceType = 6 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_ImmediateSuperior      ReferenceType = 7 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_Self                   ReferenceType = 8 // LONG_NAMED_ENUMERATED_VALUE,
	ReferenceType_DitBridge              ReferenceType = 9 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION ReferenceType */ /* START_OF_SYMBOL_DEFINITION AccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// AccessPoint ::= SET {
//   ae-title             [0]  Name,
//   address              [1]  PresentationAddress,
//   protocolInformation  [2]  SET SIZE (1..MAX) OF ProtocolInformation OPTIONAL,
//   --                   [6]  Not to be used
//   ... }
// ```
//
//
type AccessPoint struct {
	Ae_title            Name                    `asn1:"explicit,tag:0"`
	Address             PresentationAddress     `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation) `asn1:"optional,explicit,tag:2,set"`
}

/* END_OF_SYMBOL_DEFINITION AccessPoint */ /* START_OF_SYMBOL_DEFINITION MasterOrShadowAccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// MasterOrShadowAccessPoint ::= SET {
//   COMPONENTS OF          AccessPoint,
//   category          [3]  ENUMERATED {
//     master            (0),
//     shadow            (1),
//     writeableCopy     (2),
//     ... } DEFAULT master,
//   chainingRequired  [5]  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type MasterOrShadowAccessPoint struct {
	Ae_title            Name                               `asn1:"explicit,tag:0"`
	Address             PresentationAddress                `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation)            `asn1:"optional,explicit,tag:2,set"`
	Category            MasterOrShadowAccessPoint_category `asn1:"optional,explicit,tag:3"`
	ChainingRequired    bool                               `asn1:"optional,explicit,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION MasterOrShadowAccessPoint */ /* START_OF_SYMBOL_DEFINITION MasterAndShadowAccessPoints */
// ### ASN.1 Definition:
//
// ```asn1
// MasterAndShadowAccessPoints  ::=  SET SIZE (1..MAX) OF MasterOrShadowAccessPoint
// ```
type MasterAndShadowAccessPoints = [](MasterOrShadowAccessPoint) // SetOfType
/* END_OF_SYMBOL_DEFINITION MasterAndShadowAccessPoints */ /* START_OF_SYMBOL_DEFINITION AccessPointInformation */
// ### ASN.1 Definition:
//
// ```asn1
// AccessPointInformation ::= SET {
//   COMPONENTS OF          MasterOrShadowAccessPoint,
//   additionalPoints  [4]  MasterAndShadowAccessPoints OPTIONAL,
//   ... }
// ```
//
//
type AccessPointInformation struct {
	Ae_title            Name                               `asn1:"explicit,tag:0"`
	Address             PresentationAddress                `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation)            `asn1:"optional,explicit,tag:2,set"`
	Category            MasterOrShadowAccessPoint_category `asn1:"optional,explicit,tag:3"`
	ChainingRequired    bool                               `asn1:"optional,explicit,tag:5"`
	AdditionalPoints    MasterAndShadowAccessPoints        `asn1:"optional,explicit,tag:4"`
}

/* END_OF_SYMBOL_DEFINITION AccessPointInformation */ /* START_OF_SYMBOL_DEFINITION DitBridgeKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// DitBridgeKnowledge ::= SEQUENCE {
//   domainLocalID  UnboundedDirectoryString OPTIONAL,
//   accessPoints   MasterAndShadowAccessPoints,
//   ... }
// ```
//
//
type DitBridgeKnowledge struct {
	DomainLocalID UnboundedDirectoryString `asn1:"optional"`
	AccessPoints  MasterAndShadowAccessPoints
}

/* END_OF_SYMBOL_DEFINITION DitBridgeKnowledge */ /* START_OF_SYMBOL_DEFINITION Exclusions */
// ### ASN.1 Definition:
//
// ```asn1
// Exclusions  ::=  SET SIZE (1..MAX) OF RDNSequence
// ```
type Exclusions = [](pkix.RDNSequence) // SetOfType
/* END_OF_SYMBOL_DEFINITION Exclusions */ /* START_OF_SYMBOL_DEFINITION ContinuationReference */
// ### ASN.1 Definition:
//
// ```asn1
// ContinuationReference ::= SET {
//   targetObject         [0]  Name,
//   aliasedRDNs          [1]  INTEGER OPTIONAL, -- only present in first edition systems
//   operationProgress    [2]  OperationProgress,
//   rdnsResolved         [3]  INTEGER OPTIONAL,
//   referenceType        [4]  ReferenceType,
//   accessPoints         [5]  SET OF AccessPointInformation,
//   entryOnly            [6]  BOOLEAN DEFAULT FALSE,
//   exclusions           [7]  Exclusions OPTIONAL,
//   returnToDUA          [8]  BOOLEAN DEFAULT FALSE,
//   nameResolveOnMaster  [9]  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type ContinuationReference struct {
	TargetObject        Name                       `asn1:"explicit,tag:0"`
	AliasedRDNs         int                        `asn1:"optional,explicit,tag:1"`
	OperationProgress   OperationProgress          `asn1:"explicit,tag:2"`
	RdnsResolved        int                        `asn1:"optional,explicit,tag:3"`
	ReferenceType       ReferenceType              `asn1:"explicit,tag:4"`
	AccessPoints        [](AccessPointInformation) `asn1:"explicit,tag:5,set"`
	EntryOnly           bool                       `asn1:"optional,explicit,tag:6"`
	Exclusions          Exclusions                 `asn1:"optional,explicit,tag:7"`
	ReturnToDUA         bool                       `asn1:"optional,explicit,tag:8"`
	NameResolveOnMaster bool                       `asn1:"optional,explicit,tag:9"`
}

/* END_OF_SYMBOL_DEFINITION ContinuationReference */ /* START_OF_SYMBOL_DEFINITION DSABindArgument */
// ### ASN.1 Definition:
//
// ```asn1
// DSABindArgument ::= SET  {
//   credentials  [0]  DSACredentials OPTIONAL,
//   versions     [1]  Versions DEFAULT {v1},
//   ... }
// ```
//
//
type DSABindArgument struct {
	Credentials DSACredentials `asn1:"optional,explicit,tag:0"`
	Versions    Versions       `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION DSABindArgument */ /* START_OF_SYMBOL_DEFINITION DSACredentials */
// ### ASN.1 Definition:
//
// ```asn1
// DSACredentials   ::=   CHOICE  {
//   simple             [0]  SimpleCredentials,
//   strong             [1]  StrongCredentials,
//   externalProcedure  [2]  EXTERNAL,
//   spkm               [3]  SpkmCredentials,
//   ... }
// ```
type DSACredentials = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DSACredentials */ /* START_OF_SYMBOL_DEFINITION DSABindResult */
// ### ASN.1 Definition:
//
// ```asn1
// DSABindResult   ::=   DSABindArgument
// ```
type DSABindResult = DSABindArgument // DefinedType
/* END_OF_SYMBOL_DEFINITION DSABindResult */ /* START_OF_SYMBOL_DEFINITION Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 */
// ### ASN.1 Definition:
//
// ```asn1
// Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1 {OPERATION:operation} ::= SET {
//     chainedArgument      ChainingArguments,
//     argument        [0]  operation.&ArgumentType }
// ```
//
//
type Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 struct {
	ChainedArgument ChainingArguments
	Argument        asn1.RawValue `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 */ /* START_OF_SYMBOL_DEFINITION Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 */
// ### ASN.1 Definition:
//
// ```asn1
// Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1 {OPERATION:operation} ::= SET {
//     chainedResult        ChainingResults,
//     result          [0]  operation.&ResultType }
// ```
//
//
type Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 struct {
	ChainedResult ChainingResults
	Result        asn1.RawValue `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 */ /* START_OF_SYMBOL_DEFINITION OperationProgress_nameResolutionPhase */
// ### ASN.1 Definition:
//
// ```asn1
// OperationProgress-nameResolutionPhase ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type OperationProgress_nameResolutionPhase = asn1.Enumerated

const (
	OperationProgress_nameResolutionPhase_NotStarted OperationProgress_nameResolutionPhase = 1 // LONG_NAMED_ENUMERATED_VALUE,
	OperationProgress_nameResolutionPhase_Proceeding OperationProgress_nameResolutionPhase = 2 // LONG_NAMED_ENUMERATED_VALUE,
	OperationProgress_nameResolutionPhase_Completed  OperationProgress_nameResolutionPhase = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION OperationProgress_nameResolutionPhase */ /* START_OF_SYMBOL_DEFINITION MasterOrShadowAccessPoint_category */
// ### ASN.1 Definition:
//
// ```asn1
// MasterOrShadowAccessPoint-category ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type MasterOrShadowAccessPoint_category = asn1.Enumerated

const (
	MasterOrShadowAccessPoint_category_Master        MasterOrShadowAccessPoint_category = 0 // LONG_NAMED_ENUMERATED_VALUE,
	MasterOrShadowAccessPoint_category_Shadow        MasterOrShadowAccessPoint_category = 1 // LONG_NAMED_ENUMERATED_VALUE,
	MasterOrShadowAccessPoint_category_WriteableCopy MasterOrShadowAccessPoint_category = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION MasterOrShadowAccessPoint_category */
