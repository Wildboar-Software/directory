package x500_go

import (
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION ModificationParameter */
// ### ASN.1 Definition:
//
// ```asn1
// ModificationParameter ::= SEQUENCE {
//   secondaryShadows  SET OF SupplierAndConsumers,
//   ... }
// ```
//
//
type ModificationParameter struct {
	SecondaryShadows [](SupplierAndConsumers) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ModificationParameter */ /* START_OF_SYMBOL_DEFINITION AgreementID */
// ### ASN.1 Definition:
//
// ```asn1
// AgreementID  ::=  OperationalBindingID
// ```
type AgreementID = OperationalBindingID // DefinedType
/* END_OF_SYMBOL_DEFINITION AgreementID */ /* START_OF_SYMBOL_DEFINITION ShadowingAgreementInfo */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowingAgreementInfo ::= SEQUENCE {
//   shadowSubject          UnitOfReplication,
//   updateMode             UpdateMode DEFAULT supplierInitiated:onChange:TRUE,
//   master                 AccessPoint OPTIONAL,
//   secondaryShadows  [2]  BOOLEAN DEFAULT FALSE }
// ```
//
//
type ShadowingAgreementInfo struct {
	ShadowSubject    UnitOfReplication
	UpdateMode       UpdateMode  `asn1:"optional"`
	Master           AccessPoint `asn1:"optional"`
	SecondaryShadows bool        `asn1:"optional,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION ShadowingAgreementInfo */ /* START_OF_SYMBOL_DEFINITION UnitOfReplication */
// ### ASN.1 Definition:
//
// ```asn1
// UnitOfReplication ::= SEQUENCE {
//   area                 AreaSpecification,
//   attributes           AttributeSelection,
//   knowledge            Knowledge OPTIONAL,
//   subordinates         BOOLEAN DEFAULT FALSE,
//   contextSelection     ContextSelection OPTIONAL,
//   supplyContexts  [0]  CHOICE {
//     allContexts         NULL,
//     selectedContexts    SET SIZE (1..MAX) OF CONTEXT.&id,
//     ... } OPTIONAL }
// ```
//
//
type UnitOfReplication struct {
	Area             AreaSpecification
	Attributes       AttributeSelection
	Knowledge        Knowledge                        `asn1:"optional"`
	Subordinates     bool                             `asn1:"optional"`
	ContextSelection ContextSelection                 `asn1:"optional"`
	SupplyContexts   UnitOfReplication_supplyContexts `asn1:"optional,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION UnitOfReplication */ /* START_OF_SYMBOL_DEFINITION AreaSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// AreaSpecification ::= SEQUENCE {
//   contextPrefix    DistinguishedName,
//   replicationArea  SubtreeSpecification,
//   ... }
// ```
//
//
type AreaSpecification struct {
	ContextPrefix   DistinguishedName
	ReplicationArea SubtreeSpecification
}

/* END_OF_SYMBOL_DEFINITION AreaSpecification */ /* START_OF_SYMBOL_DEFINITION Knowledge */
// ### ASN.1 Definition:
//
// ```asn1
// Knowledge ::= SEQUENCE {
//   knowledgeType      ENUMERATED {
//     master (0),
//     shadow (1),
//     both   (2)},
//   extendedKnowledge  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type Knowledge struct {
	KnowledgeType     Knowledge_knowledgeType
	ExtendedKnowledge bool `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION Knowledge */ /* START_OF_SYMBOL_DEFINITION AttributeSelection */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeSelection  ::=  SET OF ClassAttributeSelection
// ```
type AttributeSelection = [](ClassAttributeSelection) // SetOfType
/* END_OF_SYMBOL_DEFINITION AttributeSelection */ /* START_OF_SYMBOL_DEFINITION ClassAttributeSelection */
// ### ASN.1 Definition:
//
// ```asn1
// ClassAttributeSelection ::= SEQUENCE {
//   class            OBJECT IDENTIFIER OPTIONAL,
//   classAttributes  ClassAttributes DEFAULT allAttributes:NULL }
// ```
//
//
type ClassAttributeSelection struct {
	Class           asn1.ObjectIdentifier `asn1:"optional"`
	ClassAttributes ClassAttributes       `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION ClassAttributeSelection */ /* START_OF_SYMBOL_DEFINITION ClassAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// ClassAttributes  ::=  CHOICE {
//   allAttributes  NULL,
//   include        [0]  AttributeTypes,
//   exclude        [1]  AttributeTypes,
//   ... }
// ```
type ClassAttributes = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ClassAttributes */ /* START_OF_SYMBOL_DEFINITION AttributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeTypes  ::=  SET OF AttributeType
// ```
type AttributeTypes = [](AttributeType) // SetOfType
/* END_OF_SYMBOL_DEFINITION AttributeTypes */ /* START_OF_SYMBOL_DEFINITION UpdateMode */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateMode  ::=  CHOICE {
//   supplierInitiated  [0]  SupplierUpdateMode,
//   consumerInitiated  [1]  ConsumerUpdateMode,
//   ... }
// ```
type UpdateMode = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UpdateMode */ /* START_OF_SYMBOL_DEFINITION SupplierUpdateMode */
// ### ASN.1 Definition:
//
// ```asn1
// SupplierUpdateMode  ::=  CHOICE {
//   onChange   BOOLEAN,
//   scheduled  SchedulingParameters,
//   ... }
// ```
type SupplierUpdateMode = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SupplierUpdateMode */ /* START_OF_SYMBOL_DEFINITION ConsumerUpdateMode */
// ### ASN.1 Definition:
//
// ```asn1
// ConsumerUpdateMode  ::=  SchedulingParameters
// ```
type ConsumerUpdateMode = SchedulingParameters // DefinedType
/* END_OF_SYMBOL_DEFINITION ConsumerUpdateMode */ /* START_OF_SYMBOL_DEFINITION SchedulingParameters */
// ### ASN.1 Definition:
//
// ```asn1
// SchedulingParameters ::= SEQUENCE {
//   periodic    PeriodicStrategy OPTIONAL, -- shall be present if othertimes
//   --                                        is set to FALSE
//   othertimes  BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type SchedulingParameters struct {
	Periodic   PeriodicStrategy `asn1:"optional"`
	Othertimes bool             `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION SchedulingParameters */ /* START_OF_SYMBOL_DEFINITION PeriodicStrategy */
// ### ASN.1 Definition:
//
// ```asn1
// PeriodicStrategy ::= SEQUENCE {
//   beginTime       Time OPTIONAL,
//   windowSize      INTEGER,
//   updateInterval  INTEGER,
//   ... }
// ```
//
//
type PeriodicStrategy struct {
	BeginTime      ShadowingTime `asn1:"optional"`
	WindowSize     int
	UpdateInterval int
}

/* END_OF_SYMBOL_DEFINITION PeriodicStrategy */ /* START_OF_SYMBOL_DEFINITION Time */
// ### ASN.1 Definition:
//
// ```asn1
// Time  ::=  GeneralizedTime
// ```
type ShadowingTime = time.Time // GeneralizedTime
/* END_OF_SYMBOL_DEFINITION Time */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgument */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateArgument  ::=
//   OPTIONALLY-PROTECTED { CoordinateShadowUpdateArgumentData }
// ```
type CoordinateShadowUpdateArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgument */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateArgumentData ::= [0]  SEQUENCE {
//   agreementID         AgreementID,
//   lastUpdate          Time OPTIONAL,
//   updateStrategy      CHOICE {
//     standard            ENUMERATED {
//       noChanges   (0),
//       incremental (1),
//       total       (2),
//       ...},
//     other               EXTERNAL,
//     ...},
//   securityParameters  SecurityParameters OPTIONAL,
//   ...}
// ```
//
//
type CoordinateShadowUpdateArgumentData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime `asn1:"optional"`
	UpdateStrategy     CoordinateShadowUpdateArgumentData_updateStrategy
	SecurityParameters SecurityParameters `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateResult */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateResult  ::=  CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED{ CoordinateShadowUpdateResultData },
//   ...}
// ```
type CoordinateShadowUpdateResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateResult */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateResultData */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateResultData ::= [0]  SEQUENCE {
//   agreementID  AgreementID,
//   lastUpdate   Time OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type CoordinateShadowUpdateResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateResultData */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateArgument */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateArgument  ::=  OPTIONALLY-PROTECTED { RequestShadowUpdateArgumentData }
// ```
type RequestShadowUpdateArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateArgument */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateArgumentData ::= [0]  SEQUENCE {
//   agreementID         AgreementID,
//   lastUpdate          Time OPTIONAL,
//   requestedStrategy   CHOICE {
//     standard  ENUMERATED {
//       incremental (1),
//       total       (2),
//       ...},
//     other     EXTERNAL,
//     ...},
//   securityParameters  SecurityParameters OPTIONAL,
//   ...}
// ```
//
//
type RequestShadowUpdateArgumentData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime `asn1:"optional"`
	RequestedStrategy  RequestShadowUpdateArgumentData_requestedStrategy
	SecurityParameters SecurityParameters `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateResult */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateResult  ::=  CHOICE {
//   null         NULL,
//   information OPTIONALLY-PROTECTED{ RequestShadowUpdateResultData },
//   ...
//   }
// ```
type RequestShadowUpdateResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateResult */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateResultData */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateResultData ::= [0]  SEQUENCE {
//   agreementID  AgreementID,
//   lastUpdate   Time OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type RequestShadowUpdateResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateResultData */ /* START_OF_SYMBOL_DEFINITION UpdateShadowArgument */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateShadowArgument  ::=  OPTIONALLY-PROTECTED {UpdateShadowArgumentData }
// ```
type UpdateShadowArgument = OPTIONALLY_PROTECTED // DefinedType
/* END_OF_SYMBOL_DEFINITION UpdateShadowArgument */ /* START_OF_SYMBOL_DEFINITION UpdateShadowArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateShadowArgumentData ::= [0]  SEQUENCE {
//   agreementID         AgreementID,
//   updateTime          Time,
//   updateWindow        UpdateWindow OPTIONAL,
//   updatedInfo         RefreshInformation,
//   securityParameters  SecurityParameters OPTIONAL,
//   ...}
// ```
//
//
type UpdateShadowArgumentData struct {
	AgreementID        AgreementID
	UpdateTime         ShadowingTime
	UpdateWindow       UpdateWindow `asn1:"optional"`
	UpdatedInfo        RefreshInformation
	SecurityParameters SecurityParameters `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION UpdateShadowArgumentData */ /* START_OF_SYMBOL_DEFINITION UpdateShadowResult */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateShadowResult  ::=  CHOICE {
//   null         NULL,
//   information OPTIONALLY-PROTECTED{ UpdateShadowResultData },
//   ...}
// ```
type UpdateShadowResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UpdateShadowResult */ /* START_OF_SYMBOL_DEFINITION UpdateShadowResultData */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateShadowResultData ::= [0]  SEQUENCE {
//   agreementID  AgreementID,
//   lastUpdate   Time OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type UpdateShadowResultData struct {
	AgreementID        AgreementID
	LastUpdate         ShadowingTime      `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION UpdateShadowResultData */ /* START_OF_SYMBOL_DEFINITION UpdateWindow */
// ### ASN.1 Definition:
//
// ```asn1
// UpdateWindow ::= SEQUENCE {
//   start  Time,
//   stop   Time,
//   ...}
// ```
//
//
type UpdateWindow struct {
	Start ShadowingTime
	Stop  ShadowingTime
}

/* END_OF_SYMBOL_DEFINITION UpdateWindow */ /* START_OF_SYMBOL_DEFINITION RefreshInformation */
// ### ASN.1 Definition:
//
// ```asn1
// RefreshInformation  ::=  CHOICE {
//   noRefresh      NULL,
//   total          [0]  TotalRefresh,
//   incremental    [1]  IncrementalRefresh,
//   otherStrategy       EXTERNAL,
//   ...}
// ```
type RefreshInformation = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION RefreshInformation */ /* START_OF_SYMBOL_DEFINITION TotalRefresh */
// ### ASN.1 Definition:
//
// ```asn1
// TotalRefresh ::= SEQUENCE {
//   sDSE     SDSEContent OPTIONAL,
//   subtree  SET SIZE (1..MAX) OF Subtree OPTIONAL,
//   ...}
// ```
//
//
type TotalRefresh struct {
	SDSE    SDSEContent `asn1:"optional"`
	Subtree [](Subtree) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION TotalRefresh */
/* START_OF_SYMBOL_DEFINITION SDSEContent */
// WARNING: If you encounter a bug encoding or decoding, it is probably the
// Attributes field, which may need to be a `[]pkix.AttributeTypeAndValueSET`.
//
// ### ASN.1 Definition:
//
// ```asn1
// SDSEContent ::= SEQUENCE {
//   sDSEType          SDSEType,
//   subComplete       [0]  BOOLEAN DEFAULT FALSE,
//   attComplete       [1]  BOOLEAN OPTIONAL,
//   attributes        SET OF Attribute{{SupportedAttributes}},
//   attValIncomplete  SET OF AttributeType DEFAULT {},
//   ...}
// ```
//
type SDSEContent struct {
	SDSEType         SDSEType
	SubComplete      bool              `asn1:"optional,tag:0"`
	AttComplete      bool              `asn1:"optional,tag:1"`
	Attributes       [](Attribute)     `asn1:"set"`
	AttValIncomplete [](AttributeType) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION SDSEContent */ /* START_OF_SYMBOL_DEFINITION SDSEType */
// ### ASN.1 Definition:
//
// ```asn1
// SDSEType  ::=  DSEType
// ```
type SDSEType = DSEType // DefinedType
/* END_OF_SYMBOL_DEFINITION SDSEType */ /* START_OF_SYMBOL_DEFINITION Subtree */
// ### ASN.1 Definition:
//
// ```asn1
// Subtree ::= SEQUENCE {
//   rdn  RelativeDistinguishedName,
//   COMPONENTS OF TotalRefresh,
//   ...}
// ```
//
//
type Subtree struct {
	Rdn     RelativeDistinguishedName
	SDSE    SDSEContent `asn1:"optional"`
	Subtree [](Subtree) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION Subtree */ /* START_OF_SYMBOL_DEFINITION IncrementalRefresh */
// ### ASN.1 Definition:
//
// ```asn1
// IncrementalRefresh  ::=  SEQUENCE OF IncrementalStepRefresh
// ```
type IncrementalRefresh = [](IncrementalStepRefresh) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION IncrementalRefresh */ /* START_OF_SYMBOL_DEFINITION IncrementalStepRefresh */
// ### ASN.1 Definition:
//
// ```asn1
// IncrementalStepRefresh ::= SEQUENCE {
//   sDSEChanges
//     CHOICE {add     [0]  SDSEContent,
//             remove  NULL,
//             modify  [1]  ContentChange,
//             ...} OPTIONAL,
//   subordinateUpdates  SEQUENCE SIZE (1..MAX) OF SubordinateChanges OPTIONAL }
// ```
//
//
type IncrementalStepRefresh struct {
	SDSEChanges        IncrementalStepRefresh_sDSEChanges `asn1:"optional"`
	SubordinateUpdates [](SubordinateChanges)             `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION IncrementalStepRefresh */ /* START_OF_SYMBOL_DEFINITION ContentChange */
// ### ASN.1 Definition:
//
// ```asn1
// ContentChange ::= SEQUENCE {
//   rename
//     CHOICE {newRDN  RelativeDistinguishedName,
//             newDN   DistinguishedName} OPTIONAL,
//   attributeChanges
//     CHOICE {replace  [0]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}},
//             changes  [1]  SEQUENCE SIZE (1..MAX) OF EntryModification} OPTIONAL,
//   sDSEType          SDSEType,
//   subComplete       [2]  BOOLEAN DEFAULT FALSE,
//   attComplete       [3]  BOOLEAN OPTIONAL,
//   attValIncomplete  SET OF AttributeType DEFAULT {},
//   ... }
// ```
//
//
type ContentChange struct {
	Rename           ContentChange_rename           `asn1:"optional"`
	AttributeChanges ContentChange_attributeChanges `asn1:"optional"`
	SDSEType         SDSEType
	SubComplete      bool              `asn1:"optional,tag:2"`
	AttComplete      bool              `asn1:"optional,tag:3"`
	AttValIncomplete [](AttributeType) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION ContentChange */ /* START_OF_SYMBOL_DEFINITION SubordinateChanges */
// ### ASN.1 Definition:
//
// ```asn1
// SubordinateChanges ::= SEQUENCE {
//   subordinate  RelativeDistinguishedName,
//   changes      IncrementalStepRefresh,
//   ... }
// ```
//
//
type SubordinateChanges struct {
	Subordinate RelativeDistinguishedName
	Changes     IncrementalStepRefresh
}

/* END_OF_SYMBOL_DEFINITION SubordinateChanges */ /* START_OF_SYMBOL_DEFINITION ShadowErrorData */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowErrorData ::= SEQUENCE {
//   problem       ShadowProblem,
//   lastUpdate    Time OPTIONAL,
//   updateWindow  UpdateWindow OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }
// ```
//
//
type ShadowErrorData struct {
	Problem            ShadowProblem
	LastUpdate         ShadowingTime      `asn1:"optional"`
	UpdateWindow       UpdateWindow       `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION ShadowErrorData */ /* START_OF_SYMBOL_DEFINITION ShadowProblem */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowProblem  ::=  INTEGER {
//   invalidAgreementID         (1),
//   inactiveAgreement          (2),
//   invalidInformationReceived (3),
//   unsupportedStrategy        (4),
//   missedPrevious             (5),
//   fullUpdateRequired         (6),
//   unwillingToPerform         (7),
//   unsuitableTiming           (8),
//   updateAlreadyReceived      (9),
//   invalidSequencing          (10),
//   insufficientResources      (11) }
// ```
type ShadowProblem = int64

/* END_OF_SYMBOL_DEFINITION ShadowProblem */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_InvalidAgreementID */
const ShadowProblem_InvalidAgreementID ShadowProblem = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_InvalidAgreementID */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_InactiveAgreement */
const ShadowProblem_InactiveAgreement ShadowProblem = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_InactiveAgreement */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_InvalidInformationReceived */
const ShadowProblem_InvalidInformationReceived ShadowProblem = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_InvalidInformationReceived */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_UnsupportedStrategy */
const ShadowProblem_UnsupportedStrategy ShadowProblem = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_UnsupportedStrategy */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_MissedPrevious */
const ShadowProblem_MissedPrevious ShadowProblem = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_MissedPrevious */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_FullUpdateRequired */
const ShadowProblem_FullUpdateRequired ShadowProblem = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_FullUpdateRequired */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_UnwillingToPerform */
const ShadowProblem_UnwillingToPerform ShadowProblem = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_UnwillingToPerform */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_UnsuitableTiming */
const ShadowProblem_UnsuitableTiming ShadowProblem = 8 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_UnsuitableTiming */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_UpdateAlreadyReceived */
const ShadowProblem_UpdateAlreadyReceived ShadowProblem = 9 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_UpdateAlreadyReceived */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_InvalidSequencing */
const ShadowProblem_InvalidSequencing ShadowProblem = 10 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_InvalidSequencing */

/* START_OF_SYMBOL_DEFINITION ShadowProblem_InsufficientResources */
const ShadowProblem_InsufficientResources ShadowProblem = 11 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowProblem_InsufficientResources */ /* START_OF_SYMBOL_DEFINITION UnitOfReplication_supplyContexts */
// ### ASN.1 Definition:
//
// ```asn1
// UnitOfReplication-supplyContexts ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type UnitOfReplication_supplyContexts = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UnitOfReplication_supplyContexts */ /* START_OF_SYMBOL_DEFINITION Knowledge_knowledgeType */
// ### ASN.1 Definition:
//
// ```asn1
// Knowledge-knowledgeType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type Knowledge_knowledgeType = int

const (
	Knowledge_knowledgeType_Master Knowledge_knowledgeType = 0 // LONG_NAMED_ENUMERATED_VALUE,
	Knowledge_knowledgeType_Shadow Knowledge_knowledgeType = 1 // LONG_NAMED_ENUMERATED_VALUE,
	Knowledge_knowledgeType_Both   Knowledge_knowledgeType = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION Knowledge_knowledgeType */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData_updateStrategy_standard */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateArgumentData-updateStrategy-standard ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type CoordinateShadowUpdateArgumentData_updateStrategy_standard = int

const (
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_NoChanges   CoordinateShadowUpdateArgumentData_updateStrategy_standard = 0 // LONG_NAMED_ENUMERATED_VALUE,
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_Incremental CoordinateShadowUpdateArgumentData_updateStrategy_standard = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CoordinateShadowUpdateArgumentData_updateStrategy_standard_Total       CoordinateShadowUpdateArgumentData_updateStrategy_standard = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData_updateStrategy_standard */ /* START_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData_updateStrategy */
// ### ASN.1 Definition:
//
// ```asn1
// CoordinateShadowUpdateArgumentData-updateStrategy ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CoordinateShadowUpdateArgumentData_updateStrategy = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CoordinateShadowUpdateArgumentData_updateStrategy */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData_requestedStrategy_standard */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateArgumentData-requestedStrategy-standard ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type RequestShadowUpdateArgumentData_requestedStrategy_standard = int

const (
	RequestShadowUpdateArgumentData_requestedStrategy_standard_Incremental RequestShadowUpdateArgumentData_requestedStrategy_standard = 1 // LONG_NAMED_ENUMERATED_VALUE,
	RequestShadowUpdateArgumentData_requestedStrategy_standard_Total       RequestShadowUpdateArgumentData_requestedStrategy_standard = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData_requestedStrategy_standard */ /* START_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData_requestedStrategy */
// ### ASN.1 Definition:
//
// ```asn1
// RequestShadowUpdateArgumentData-requestedStrategy ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type RequestShadowUpdateArgumentData_requestedStrategy = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION RequestShadowUpdateArgumentData_requestedStrategy */ /* START_OF_SYMBOL_DEFINITION IncrementalStepRefresh_sDSEChanges */
// ### ASN.1 Definition:
//
// ```asn1
// IncrementalStepRefresh-sDSEChanges ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type IncrementalStepRefresh_sDSEChanges = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION IncrementalStepRefresh_sDSEChanges */ /* START_OF_SYMBOL_DEFINITION ContentChange_rename */
// ### ASN.1 Definition:
//
// ```asn1
// ContentChange-rename ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ContentChange_rename = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ContentChange_rename */ /* START_OF_SYMBOL_DEFINITION ContentChange_attributeChanges */
// ### ASN.1 Definition:
//
// ```asn1
// ContentChange-attributeChanges ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ContentChange_attributeChanges = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ContentChange_attributeChanges */
