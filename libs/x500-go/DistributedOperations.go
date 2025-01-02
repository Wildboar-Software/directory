package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	DsaReferralData ::= SET {
//	  reference      [0]  ContinuationReference,
//	  contextPrefix  [1]  DistinguishedName OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF       CommonResults }
type DsaReferralData struct {
	Reference          ContinuationReference `asn1:"explicit,tag:0"`
	ContextPrefix      DistinguishedName     `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters    `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName     `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                  `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)         `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ChainingArguments ::= SET {
//	  originator                 [0]  DistinguishedName OPTIONAL,
//	  targetObject               [1]  DistinguishedName OPTIONAL,
//	  operationProgress          [2]  OperationProgress
//	                               DEFAULT {nameResolutionPhase notStarted},
//	  traceInformation           [3]  TraceInformation,
//	  aliasDereferenced          [4]  BOOLEAN DEFAULT FALSE,
//	  aliasedRDNs                [5]  INTEGER OPTIONAL,
//	  returnCrossRefs            [6]  BOOLEAN DEFAULT FALSE,
//	  referenceType              [7]  ReferenceType DEFAULT superior,
//	  info                       [8]  DomainInfo OPTIONAL,
//	  timeLimit                  [9]  Time OPTIONAL,
//	  securityParameters         [10] SecurityParameters DEFAULT {},
//	  entryOnly                  [11] BOOLEAN DEFAULT FALSE,
//	  uniqueIdentifier           [12] UniqueIdentifier OPTIONAL,
//	  authenticationLevel        [13] AuthenticationLevel OPTIONAL,
//	  exclusions                 [14] Exclusions OPTIONAL,
//	  excludeShadows             [15] BOOLEAN DEFAULT FALSE,
//	  nameResolveOnMaster        [16] BOOLEAN DEFAULT FALSE,
//	  operationIdentifier        [17] INTEGER OPTIONAL,
//	  searchRuleId               [18] SearchRuleId OPTIONAL,
//	  chainedRelaxation          [19] MRMapping OPTIONAL,
//	  relatedEntry               [20] INTEGER OPTIONAL,
//	  dspPaging                  [21] BOOLEAN DEFAULT FALSE,
//	  --                         [22] Not to be used
//	  --                         [23] Not to be used
//	  excludeWriteableCopies     [24] BOOLEAN DEFAULT FALSE,
//	  ... }
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

// # ASN.1 Definition:
//
//	Time  ::=  CHOICE {
//	  utcTime          UTCTime,
//	  generalizedTime  GeneralizedTime,
//	  ... }
type Time = asn1.RawValue

// # ASN.1 Definition:
//
// DomainInfo  ::=  ABSTRACT-SYNTAX.&Type
type DomainInfo = asn1.RawValue // ObjectClassFieldType
// # ASN.1 Definition:
//
//	ChainingResults ::= SET {
//	  info                [0]  DomainInfo OPTIONAL,
//	  crossReferences     [1]  SEQUENCE SIZE (1..MAX) OF CrossReference OPTIONAL,
//	  securityParameters  [2]  SecurityParameters DEFAULT {},
//	  alreadySearched     [3]  Exclusions OPTIONAL,
//	  ... }
type ChainingResults struct {
	Info               DomainInfo         `asn1:"optional,explicit,tag:0"`
	CrossReferences    [](CrossReference) `asn1:"optional,explicit,tag:1"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:2"`
	AlreadySearched    Exclusions         `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	CrossReference ::= SET {
//	  contextPrefix  [0]  DistinguishedName,
//	  accessPoint    [1]  AccessPointInformation,
//	  ... }
type CrossReference struct {
	ContextPrefix DistinguishedName      `asn1:"explicit,tag:0"`
	AccessPoint   AccessPointInformation `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	OperationProgress ::= SET {
//	  nameResolutionPhase  [0]  ENUMERATED {
//	    notStarted  (1),
//	    proceeding  (2),
//	    completed   (3),
//	    ... },
//	  nextRDNToBeResolved  [1]  INTEGER OPTIONAL,
//	  ... }
type OperationProgress struct {
	NameResolutionPhase OperationProgress_nameResolutionPhase `asn1:"explicit,tag:0"`
	NextRDNToBeResolved int                                   `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
// TraceInformation  ::=  SEQUENCE OF TraceItem
type TraceInformation = [](TraceItem) // SequenceOfType
// # ASN.1 Definition:
//
//	TraceItem ::= SET {
//	  dsa                [0]  Name,
//	  targetObject       [1]  Name OPTIONAL,
//	  operationProgress  [2]  OperationProgress,
//	  ... }
type TraceItem struct {
	Dsa               Name              `asn1:"explicit,tag:0"`
	TargetObject      Name              `asn1:"optional,explicit,tag:1"`
	OperationProgress OperationProgress `asn1:"explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	ReferenceType  ::=  ENUMERATED {
//	  superior               (1),
//	  subordinate            (2),
//	  cross                  (3),
//	  nonSpecificSubordinate (4),
//	  supplier               (5),
//	  master                 (6),
//	  immediateSuperior      (7),
//	  self                   (8),
//	  ditBridge              (9),
//	  ... }
type ReferenceType = asn1.Enumerated

const (
	ReferenceType_Superior               ReferenceType = 1
	ReferenceType_Subordinate            ReferenceType = 2
	ReferenceType_Cross                  ReferenceType = 3
	ReferenceType_NonSpecificSubordinate ReferenceType = 4
	ReferenceType_Supplier               ReferenceType = 5
	ReferenceType_Master                 ReferenceType = 6
	ReferenceType_ImmediateSuperior      ReferenceType = 7
	ReferenceType_Self                   ReferenceType = 8
	ReferenceType_DitBridge              ReferenceType = 9
)

// # ASN.1 Definition:
//
//	AccessPoint ::= SET {
//	  ae-title             [0]  Name,
//	  address              [1]  PresentationAddress,
//	  protocolInformation  [2]  SET SIZE (1..MAX) OF ProtocolInformation OPTIONAL,
//	  --                   [6]  Not to be used
//	  ... }
type AccessPoint struct {
	Ae_title            Name                    `asn1:"explicit,tag:0"`
	Address             PresentationAddress     `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation) `asn1:"optional,explicit,tag:2,set"`
}

// # ASN.1 Definition:
//
//	MasterOrShadowAccessPoint ::= SET {
//	  COMPONENTS OF          AccessPoint,
//	  category          [3]  ENUMERATED {
//	    master            (0),
//	    shadow            (1),
//	    writeableCopy     (2),
//	    ... } DEFAULT master,
//	  chainingRequired  [5]  BOOLEAN DEFAULT FALSE,
//	  ... }
type MasterOrShadowAccessPoint struct {
	Ae_title            Name                               `asn1:"explicit,tag:0"`
	Address             PresentationAddress                `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation)            `asn1:"optional,explicit,tag:2,set"`
	Category            MasterOrShadowAccessPoint_category `asn1:"optional,explicit,tag:3"`
	ChainingRequired    bool                               `asn1:"optional,explicit,tag:5"`
}

// # ASN.1 Definition:
//
// MasterAndShadowAccessPoints  ::=  SET SIZE (1..MAX) OF MasterOrShadowAccessPoint
type MasterAndShadowAccessPoints = [](MasterOrShadowAccessPoint) // SetOfType
// # ASN.1 Definition:
//
//	AccessPointInformation ::= SET {
//	  COMPONENTS OF          MasterOrShadowAccessPoint,
//	  additionalPoints  [4]  MasterAndShadowAccessPoints OPTIONAL,
//	  ... }
type AccessPointInformation struct {
	Ae_title            Name                               `asn1:"explicit,tag:0"`
	Address             PresentationAddress                `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation)            `asn1:"optional,explicit,tag:2,set"`
	Category            MasterOrShadowAccessPoint_category `asn1:"optional,explicit,tag:3"`
	ChainingRequired    bool                               `asn1:"optional,explicit,tag:5"`
	AdditionalPoints    MasterAndShadowAccessPoints        `asn1:"optional,explicit,tag:4"`
}

// # ASN.1 Definition:
//
//	DitBridgeKnowledge ::= SEQUENCE {
//	  domainLocalID  UnboundedDirectoryString OPTIONAL,
//	  accessPoints   MasterAndShadowAccessPoints,
//	  ... }
type DitBridgeKnowledge struct {
	DomainLocalID UnboundedDirectoryString `asn1:"optional"`
	AccessPoints  MasterAndShadowAccessPoints
}

// # ASN.1 Definition:
//
// Exclusions  ::=  SET SIZE (1..MAX) OF RDNSequence
type Exclusions = [](pkix.RDNSequence) // SetOfType
// # ASN.1 Definition:
//
//	ContinuationReference ::= SET {
//	  targetObject         [0]  Name,
//	  aliasedRDNs          [1]  INTEGER OPTIONAL, -- only present in first edition systems
//	  operationProgress    [2]  OperationProgress,
//	  rdnsResolved         [3]  INTEGER OPTIONAL,
//	  referenceType        [4]  ReferenceType,
//	  accessPoints         [5]  SET OF AccessPointInformation,
//	  entryOnly            [6]  BOOLEAN DEFAULT FALSE,
//	  exclusions           [7]  Exclusions OPTIONAL,
//	  returnToDUA          [8]  BOOLEAN DEFAULT FALSE,
//	  nameResolveOnMaster  [9]  BOOLEAN DEFAULT FALSE,
//	  ... }
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

// # ASN.1 Definition:
//
//	DSABindArgument ::= SET  {
//	  credentials  [0]  DSACredentials OPTIONAL,
//	  versions     [1]  Versions DEFAULT {v1},
//	  ... }
type DSABindArgument struct {
	Credentials DSACredentials `asn1:"optional,explicit,tag:0"`
	Versions    Versions       `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	DSACredentials   ::=   CHOICE  {
//	  simple             [0]  SimpleCredentials,
//	  strong             [1]  StrongCredentials,
//	  externalProcedure  [2]  EXTERNAL,
//	  spkm               [3]  SpkmCredentials,
//	  ... }
type DSACredentials = asn1.RawValue

// # ASN.1 Definition:
//
// DSABindResult   ::=   DSABindArgument
type DSABindResult = DSABindArgument // DefinedType
// # ASN.1 Definition:
//
//	Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1 {OPERATION:operation} ::= SET {
//	    chainedArgument      ChainingArguments,
//	    argument        [0]  operation.&ArgumentType }
type Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 struct {
	ChainedArgument ChainingArguments
	Argument        asn1.RawValue `asn1:"explicit,tag:0"`
}

// # ASN.1 Definition:
//
//	Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1 {OPERATION:operation} ::= SET {
//	    chainedResult        ChainingResults,
//	    result          [0]  operation.&ResultType }
type Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 struct {
	ChainedResult ChainingResults
	Result        asn1.RawValue `asn1:"explicit,tag:0"`
}

// # ASN.1 Definition:
//
// OperationProgress-nameResolutionPhase ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type OperationProgress_nameResolutionPhase = asn1.Enumerated

const (
	OperationProgress_nameResolutionPhase_NotStarted OperationProgress_nameResolutionPhase = 1
	OperationProgress_nameResolutionPhase_Proceeding OperationProgress_nameResolutionPhase = 2
	OperationProgress_nameResolutionPhase_Completed  OperationProgress_nameResolutionPhase = 3
)

// # ASN.1 Definition:
//
// MasterOrShadowAccessPoint-category ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type MasterOrShadowAccessPoint_category = asn1.Enumerated

const (
	MasterOrShadowAccessPoint_category_Master        MasterOrShadowAccessPoint_category = 0
	MasterOrShadowAccessPoint_category_Shadow        MasterOrShadowAccessPoint_category = 1
	MasterOrShadowAccessPoint_category_WriteableCopy MasterOrShadowAccessPoint_category = 2
)
