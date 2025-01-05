package x500_go

import (
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	ModificationParameter ::= SEQUENCE {
//	  secondaryShadows  SET OF SupplierAndConsumers,
//	  ... }
type ModificationParameter struct {
	SecondaryShadows [](SupplierAndConsumers) `asn1:"set"`
}

// # ASN.1 Definition:
//
//	AgreementID ::= OperationalBindingID
type AgreementID = OperationalBindingID

// # ASN.1 Definition:
//
//	ShadowingAgreementInfo ::= SEQUENCE {
//	  shadowSubject          UnitOfReplication,
//	  updateMode             UpdateMode DEFAULT supplierInitiated:onChange:TRUE,
//	  master                 AccessPoint OPTIONAL,
//	  secondaryShadows  [2]  BOOLEAN DEFAULT FALSE }
type ShadowingAgreementInfo struct {
	ShadowSubject    UnitOfReplication
	UpdateMode       UpdateMode  `asn1:"optional"`
	Master           AccessPoint `asn1:"optional,set"`
	SecondaryShadows bool        `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	UnitOfReplication ::= SEQUENCE {
//	  area                 AreaSpecification,
//	  attributes           AttributeSelection,
//	  knowledge            Knowledge OPTIONAL,
//	  subordinates         BOOLEAN DEFAULT FALSE,
//	  contextSelection     ContextSelection OPTIONAL,
//	  supplyContexts  [0]  CHOICE {
//	    allContexts         NULL,
//	    selectedContexts    SET SIZE (1..MAX) OF CONTEXT.&id,
//	    ... } OPTIONAL }
type UnitOfReplication struct {
	Area             AreaSpecification
	Attributes       AttributeSelection
	Knowledge        Knowledge                        `asn1:"optional"`
	Subordinates     bool                             `asn1:"optional"`
	ContextSelection ContextSelection                 `asn1:"optional"`
	SupplyContexts   UnitOfReplication_supplyContexts `asn1:"optional,tag:0"`
}

// # ASN.1 Definition:
//
//	AreaSpecification ::= SEQUENCE {
//	  contextPrefix    DistinguishedName,
//	  replicationArea  SubtreeSpecification,
//	  ... }
type AreaSpecification struct {
	ContextPrefix   DistinguishedName
	ReplicationArea SubtreeSpecification
}

// # ASN.1 Definition:
//
//	Knowledge ::= SEQUENCE {
//	  knowledgeType      ENUMERATED {
//	    master (0),
//	    shadow (1),
//	    both   (2)},
//	  extendedKnowledge  BOOLEAN DEFAULT FALSE,
//	  ... }
type Knowledge struct {
	KnowledgeType     Knowledge_knowledgeType
	ExtendedKnowledge bool `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	AttributeSelection ::= SET OF ClassAttributeSelection
type AttributeSelection = [](ClassAttributeSelection)

// # ASN.1 Definition:
//
//	ClassAttributeSelection ::= SEQUENCE {
//	  class            OBJECT IDENTIFIER OPTIONAL,
//	  classAttributes  ClassAttributes DEFAULT allAttributes:NULL }
type ClassAttributeSelection struct {
	Class           asn1.ObjectIdentifier `asn1:"optional"`
	ClassAttributes ClassAttributes       `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ClassAttributes ::= CHOICE {
//	  allAttributes  NULL,
//	  include        [0]  AttributeTypes,
//	  exclude        [1]  AttributeTypes,
//	  ... }
type ClassAttributes = asn1.RawValue

// # ASN.1 Definition:
//
//	AttributeTypes ::= SET OF AttributeType
type AttributeTypes = [](AttributeType)

// # ASN.1 Definition:
//
//	UpdateMode ::= CHOICE {
//	  supplierInitiated  [0]  SupplierUpdateMode,
//	  consumerInitiated  [1]  ConsumerUpdateMode,
//	  ... }
type UpdateMode = asn1.RawValue

// # ASN.1 Definition:
//
//	SupplierUpdateMode ::= CHOICE {
//	  onChange   BOOLEAN,
//	  scheduled  SchedulingParameters,
//	  ... }
type SupplierUpdateMode = asn1.RawValue

// # ASN.1 Definition:
//
//	ConsumerUpdateMode ::= SchedulingParameters
type ConsumerUpdateMode = SchedulingParameters

// # ASN.1 Definition:
//
//	SchedulingParameters ::= SEQUENCE {
//	  periodic    PeriodicStrategy OPTIONAL, -- shall be present if othertimes
//	  --                                        is set to FALSE
//	  othertimes  BOOLEAN DEFAULT FALSE,
//	  ... }
type SchedulingParameters struct {
	Periodic   PeriodicStrategy `asn1:"optional"`
	Othertimes bool             `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	PeriodicStrategy ::= SEQUENCE {
//	  beginTime       Time OPTIONAL,
//	  windowSize      INTEGER,
//	  updateInterval  INTEGER,
//	  ... }
type PeriodicStrategy struct {
	BeginTime      ShadowingTime `asn1:"optional"`
	WindowSize     int
	UpdateInterval int
}

// # ASN.1 Definition:
//
//	Time ::= GeneralizedTime
type ShadowingTime = time.Time

// # ASN.1 Definition:
//
// CoordinateShadowUpdateArgument  ::=
//
//	OPTIONALLY-PROTECTED { CoordinateShadowUpdateArgumentData }
type CoordinateShadowUpdateArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	CoordinateShadowUpdateArgumentData ::= [0]  SEQUENCE {
//	  agreementID         AgreementID,
//	  lastUpdate          Time OPTIONAL,
//	  updateStrategy      CHOICE {
//	    standard            ENUMERATED {
//	      noChanges   (0),
//	      incremental (1),
//	      total       (2),
//	      ...},
//	    other               EXTERNAL,
//	    ...},
//	  securityParameters  SecurityParameters OPTIONAL,
//	  ...}
type CoordinateShadowUpdateArgumentData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime `asn1:"optional"`
	UpdateStrategy     CoordinateShadowUpdateArgumentData_updateStrategy
	SecurityParameters SecurityParameters `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	CoordinateShadowUpdateResult ::= CHOICE {
//	  null         NULL,
//	  information  OPTIONALLY-PROTECTED{ CoordinateShadowUpdateResultData },
//	  ...}
type CoordinateShadowUpdateResult = asn1.RawValue

// # ASN.1 Definition:
//
//	CoordinateShadowUpdateResultData ::= [0]  SEQUENCE {
//	  agreementID  AgreementID,
//	  lastUpdate   Time OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type CoordinateShadowUpdateResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30,set"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	RequestShadowUpdateArgument ::= OPTIONALLY-PROTECTED { RequestShadowUpdateArgumentData }
type RequestShadowUpdateArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	RequestShadowUpdateArgumentData ::= [0]  SEQUENCE {
//	  agreementID         AgreementID,
//	  lastUpdate          Time OPTIONAL,
//	  requestedStrategy   CHOICE {
//	    standard  ENUMERATED {
//	      incremental (1),
//	      total       (2),
//	      ...},
//	    other     EXTERNAL,
//	    ...},
//	  securityParameters  SecurityParameters OPTIONAL,
//	  ...}
type RequestShadowUpdateArgumentData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime `asn1:"optional"`
	RequestedStrategy  RequestShadowUpdateArgumentData_requestedStrategy
	SecurityParameters SecurityParameters `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	RequestShadowUpdateResult ::= CHOICE {
//	  null         NULL,
//	  information OPTIONALLY-PROTECTED{ RequestShadowUpdateResultData },
//	  ...
//	  }
type RequestShadowUpdateResult = asn1.RawValue

// # ASN.1 Definition:
//
//	RequestShadowUpdateResultData ::= [0]  SEQUENCE {
//	  agreementID  AgreementID,
//	  lastUpdate   Time OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type RequestShadowUpdateResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30,set"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	UpdateShadowArgument ::= OPTIONALLY-PROTECTED {UpdateShadowArgumentData }
type UpdateShadowArgument = OPTIONALLY_PROTECTED

// # ASN.1 Definition:
//
//	UpdateShadowArgumentData ::= [0]  SEQUENCE {
//	  agreementID         AgreementID,
//	  updateTime          Time,
//	  updateWindow        UpdateWindow OPTIONAL,
//	  updatedInfo         RefreshInformation,
//	  securityParameters  SecurityParameters OPTIONAL,
//	  ...}
type UpdateShadowArgumentData struct {
	AgreementID        AgreementID
	UpdateTime         ShadowingTime
	UpdateWindow       UpdateWindow `asn1:"optional"`
	UpdatedInfo        RefreshInformation
	SecurityParameters SecurityParameters `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	UpdateShadowResult ::= CHOICE {
//	  null         NULL,
//	  information OPTIONALLY-PROTECTED{ UpdateShadowResultData },
//	  ...}
type UpdateShadowResult = asn1.RawValue

// # ASN.1 Definition:
//
//	UpdateShadowResultData ::= [0]  SEQUENCE {
//	  agreementID  AgreementID,
//	  lastUpdate   Time OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type UpdateShadowResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30,set"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	UpdateWindow ::= SEQUENCE {
//	  start  Time,
//	  stop   Time,
//	  ...}
type UpdateWindow struct {
	Start ShadowingTime
	Stop  ShadowingTime
}

// # ASN.1 Definition:
//
//	RefreshInformation ::= CHOICE {
//	  noRefresh      NULL,
//	  total          [0]  TotalRefresh,
//	  incremental    [1]  IncrementalRefresh,
//	  otherStrategy       EXTERNAL,
//	  ...}
type RefreshInformation = asn1.RawValue

// # ASN.1 Definition:
//
//	TotalRefresh ::= SEQUENCE {
//	  sDSE     SDSEContent OPTIONAL,
//	  subtree  SET SIZE (1..MAX) OF Subtree OPTIONAL,
//	  ...}
type TotalRefresh struct {
	SDSE    SDSEContent `asn1:"optional"`
	Subtree [](Subtree) `asn1:"optional,set"`
}

// WARNING: If you encounter a bug encoding or decoding, it is probably the
// Attributes field, which may need to be a `[]pkix.AttributeTypeAndValueSET`.
//
// # ASN.1 Definition:
//
//	SDSEContent ::= SEQUENCE {
//	  sDSEType          SDSEType,
//	  subComplete       [0]  BOOLEAN DEFAULT FALSE,
//	  attComplete       [1]  BOOLEAN OPTIONAL,
//	  attributes        SET OF Attribute{{SupportedAttributes}},
//	  attValIncomplete  SET OF AttributeType DEFAULT {},
//	  ...}
type SDSEContent struct {
	SDSEType         SDSEType
	SubComplete      bool              `asn1:"optional,tag:0"`
	AttComplete      bool              `asn1:"optional,tag:1"`
	Attributes       [](Attribute)     `asn1:"set"`
	AttValIncomplete [](AttributeType) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	SDSEType ::= DSEType
type SDSEType = DSEType

// # ASN.1 Definition:
//
//	Subtree ::= SEQUENCE {
//	  rdn  RelativeDistinguishedName,
//	  COMPONENTS OF TotalRefresh,
//	  ...}
type Subtree struct {
	Rdn     RelativeDistinguishedName
	SDSE    SDSEContent `asn1:"optional"`
	Subtree [](Subtree) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	IncrementalRefresh ::= SEQUENCE OF IncrementalStepRefresh
type IncrementalRefresh = [](IncrementalStepRefresh)

// # ASN.1 Definition:
//
//	IncrementalStepRefresh ::= SEQUENCE {
//	  sDSEChanges
//	    CHOICE {add     [0]  SDSEContent,
//	            remove  NULL,
//	            modify  [1]  ContentChange,
//	            ...} OPTIONAL,
//	  subordinateUpdates  SEQUENCE SIZE (1..MAX) OF SubordinateChanges OPTIONAL }
type IncrementalStepRefresh struct {
	SDSEChanges        IncrementalStepRefresh_sDSEChanges `asn1:"optional"`
	SubordinateUpdates [](SubordinateChanges)             `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ContentChange ::= SEQUENCE {
//	  rename
//	    CHOICE {newRDN  RelativeDistinguishedName,
//	            newDN   DistinguishedName} OPTIONAL,
//	  attributeChanges
//	    CHOICE {replace  [0]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}},
//	            changes  [1]  SEQUENCE SIZE (1..MAX) OF EntryModification} OPTIONAL,
//	  sDSEType          SDSEType,
//	  subComplete       [2]  BOOLEAN DEFAULT FALSE,
//	  attComplete       [3]  BOOLEAN OPTIONAL,
//	  attValIncomplete  SET OF AttributeType DEFAULT {},
//	  ... }
type ContentChange struct {
	Rename           ContentChange_rename           `asn1:"optional"`
	AttributeChanges ContentChange_attributeChanges `asn1:"optional"`
	SDSEType         SDSEType
	SubComplete      bool              `asn1:"optional,tag:2"`
	AttComplete      bool              `asn1:"optional,tag:3"`
	AttValIncomplete [](AttributeType) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	SubordinateChanges ::= SEQUENCE {
//	  subordinate  RelativeDistinguishedName,
//	  changes      IncrementalStepRefresh,
//	  ... }
type SubordinateChanges struct {
	Subordinate RelativeDistinguishedName
	Changes     IncrementalStepRefresh
}

// # ASN.1 Definition:
//
//	ShadowErrorData ::= SEQUENCE {
//	  problem       ShadowProblem,
//	  lastUpdate    Time OPTIONAL,
//	  updateWindow  UpdateWindow OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF CommonResultsSeq }
type ShadowErrorData struct {
	Problem            ShadowProblem
	LastUpdate         ShadowingTime      `asn1:"optional"`
	UpdateWindow       UpdateWindow       `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30,set"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ShadowProblem ::= INTEGER {
//	  invalidAgreementID         (1),
//	  inactiveAgreement          (2),
//	  invalidInformationReceived (3),
//	  unsupportedStrategy        (4),
//	  missedPrevious             (5),
//	  fullUpdateRequired         (6),
//	  unwillingToPerform         (7),
//	  unsuitableTiming           (8),
//	  updateAlreadyReceived      (9),
//	  invalidSequencing          (10),
//	  insufficientResources      (11) }
type ShadowProblem = int64

const ShadowProblem_InvalidAgreementID ShadowProblem = 1

const ShadowProblem_InactiveAgreement ShadowProblem = 2

const ShadowProblem_InvalidInformationReceived ShadowProblem = 3

const ShadowProblem_UnsupportedStrategy ShadowProblem = 4

const ShadowProblem_MissedPrevious ShadowProblem = 5

const ShadowProblem_FullUpdateRequired ShadowProblem = 6

const ShadowProblem_UnwillingToPerform ShadowProblem = 7

const ShadowProblem_UnsuitableTiming ShadowProblem = 8

const ShadowProblem_UpdateAlreadyReceived ShadowProblem = 9

const ShadowProblem_InvalidSequencing ShadowProblem = 10

const ShadowProblem_InsufficientResources ShadowProblem = 11

// # ASN.1 Definition:
//
//	UnitOfReplication-supplyContexts ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type UnitOfReplication_supplyContexts = asn1.RawValue

// # ASN.1 Definition:
//
//	Knowledge-knowledgeType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type Knowledge_knowledgeType = asn1.Enumerated

const (
	Knowledge_knowledgeType_Master Knowledge_knowledgeType = 0
	Knowledge_knowledgeType_Shadow Knowledge_knowledgeType = 1
	Knowledge_knowledgeType_Both   Knowledge_knowledgeType = 2
)

// # ASN.1 Definition:
//
//	CoordinateShadowUpdateArgumentData-updateStrategy-standard ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type CoordinateShadowUpdateArgumentData_updateStrategy_standard = asn1.Enumerated

const (
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_NoChanges   CoordinateShadowUpdateArgumentData_updateStrategy_standard = 0
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_Incremental CoordinateShadowUpdateArgumentData_updateStrategy_standard = 1
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_Total       CoordinateShadowUpdateArgumentData_updateStrategy_standard = 2
)

// # ASN.1 Definition:
//
//	CoordinateShadowUpdateArgumentData-updateStrategy ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CoordinateShadowUpdateArgumentData_updateStrategy = asn1.RawValue

// # ASN.1 Definition:
//
//	RequestShadowUpdateArgumentData-requestedStrategy-standard ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type RequestShadowUpdateArgumentData_requestedStrategy_standard = asn1.Enumerated

const (
	RequestShadowUpdateArgumentData_requestedStrategy_standard_Incremental RequestShadowUpdateArgumentData_requestedStrategy_standard = 1
	RequestShadowUpdateArgumentData_requestedStrategy_standard_Total       RequestShadowUpdateArgumentData_requestedStrategy_standard = 2
)

// # ASN.1 Definition:
//
//	RequestShadowUpdateArgumentData-requestedStrategy ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type RequestShadowUpdateArgumentData_requestedStrategy = asn1.RawValue

// # ASN.1 Definition:
//
//	IncrementalStepRefresh-sDSEChanges ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type IncrementalStepRefresh_sDSEChanges = asn1.RawValue

// # ASN.1 Definition:
//
//	ContentChange-rename ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ContentChange_rename = asn1.RawValue

// # ASN.1 Definition:
//
//	ContentChange-attributeChanges ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ContentChange_attributeChanges = asn1.RawValue
