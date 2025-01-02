package x500_go

import (
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
// EstablishOperationalBindingArgument  ::=
//
//	OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingArgumentData }
type EstablishOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	EstablishOperationalBindingArgumentData ::= SEQUENCE {
//	  bindingType        [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//	  bindingID          [1]  OperationalBindingID OPTIONAL,
//	  accessPoint        [2]  AccessPoint,
//	               -- symmetric, Role A initiates, or Role B initiates
//	  initiator               CHOICE {
//	    symmetric          [3]  OPERATIONAL-BINDING.&both.&EstablishParam
//	                            ({OpBindingSet}{@bindingType}),
//	    roleA-initiates    [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
//	                            ({OpBindingSet}{@bindingType}),
//	    roleB-initiates    [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
//	                              ({OpBindingSet}{@bindingType})},
//	  agreement          [6]  OPERATIONAL-BINDING.&Agreement
//	                            ({OpBindingSet}{@bindingType}),
//	  valid              [7]  Validity DEFAULT {},
//	  securityParameters [8]  SecurityParameters OPTIONAL,
//	  ... }
type EstablishOperationalBindingArgumentData struct {
	BindingType        asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID  `asn1:"optional,explicit,tag:1"`
	AccessPoint        AccessPoint           `asn1:"explicit,tag:2"`
	Initiator          EstablishOperationalBindingArgumentData_initiator
	Agreement          asn1.RawValue      `asn1:"explicit,tag:6"`
	Valid              OBValidity         `asn1:"optional,explicit,tag:7"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:8"`
}

// # ASN.1 Definition:
//
//	OperationalBindingID ::= SEQUENCE {
//	  identifier  INTEGER,
//	  version     INTEGER,
//	  ... }
type OperationalBindingID struct {
	Identifier int
	Version    int
}

// # ASN.1 Definition:
//
//	Validity ::= SEQUENCE {
//	  validFrom            [0]  CHOICE {
//	    now                  [0]  NULL,
//	    time                 [1]  Time,
//	    ...} DEFAULT now:NULL,
//	  validUntil           [1]  CHOICE {
//	    explicitTermination  [0]  NULL,
//	    time                 [1]  Time,
//	    ... } DEFAULT explicitTermination:NULL,
//	  ... }
type OBValidity struct {
	ValidFrom  Validity_validFrom  `asn1:"optional,explicit,tag:0"`
	ValidUntil Validity_validUntil `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	EstablishOperationalBindingResult ::= OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingResultData }
type EstablishOperationalBindingResult = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	EstablishOperationalBindingResultData ::= SEQUENCE {
//	  bindingType   [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//	  bindingID     [1]  OperationalBindingID OPTIONAL,
//	  accessPoint   [2]  AccessPoint,
//	  -- symmetric, Role A replies, or Role B replies
//	  initiator          CHOICE {
//	    symmetric     [3]  OPERATIONAL-BINDING.&both.&EstablishParam
//	                         ({OpBindingSet}{@bindingType}),
//	    roleA-replies [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
//	                         ({OpBindingSet}{@bindingType}),
//	    roleB-replies [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
//	                         ({OpBindingSet}{@bindingType})},
//	  ...,
//	  ...,
//	  COMPONENTS OF      CommonResultsSeq }
type EstablishOperationalBindingResultData struct {
	BindingType        asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID  `asn1:"optional,explicit,tag:1"`
	AccessPoint        AccessPoint           `asn1:"explicit,tag:2"`
	Initiator          EstablishOperationalBindingResultData_initiator
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	ModifyOperationalBindingArgument ::= OPTIONALLY-PROTECTED-SEQ { ModifyOperationalBindingArgumentData }
type ModifyOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	ModifyOperationalBindingArgumentData ::= SEQUENCE {
//	  bindingType       [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//	  bindingID         [1]  OperationalBindingID,
//	  accessPoint       [2]  AccessPoint OPTIONAL,
//	  -- symmetric, Role A initiates, or Role B initiates
//	  initiator              CHOICE {
//	    symmetric         [3]  OPERATIONAL-BINDING.&both.&ModifyParam
//	                          ({OpBindingSet}{@bindingType}),
//	    roleA-initiates   [4]  OPERATIONAL-BINDING.&roleA.&ModifyParam
//	                          ({OpBindingSet}{@bindingType}),
//	    roleB-initiates   [5]  OPERATIONAL-BINDING.&roleB.&ModifyParam
//	                          ({OpBindingSet}{@bindingType})} OPTIONAL,
//	  newBindingID      [6]  OperationalBindingID,
//	  newAgreement      [7]  OPERATIONAL-BINDING.&Agreement
//	                       ({OpBindingSet}{@bindingType}) OPTIONAL,
//	  valid               [8]  ModifiedValidity OPTIONAL,
//	  securityParameters  [9]  SecurityParameters OPTIONAL,
//	  ...}
type ModifyOperationalBindingArgumentData struct {
	BindingType        asn1.ObjectIdentifier                          `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID                           `asn1:"explicit,tag:1"`
	AccessPoint        AccessPoint                                    `asn1:"optional,explicit,tag:2"`
	Initiator          ModifyOperationalBindingArgumentData_initiator `asn1:"optional"`
	NewBindingID       OperationalBindingID                           `asn1:"explicit,tag:6"`
	NewAgreement       asn1.RawValue                                  `asn1:"optional,explicit,tag:7"`
	Valid              ModifiedValidity                               `asn1:"optional,explicit,tag:8"`
	SecurityParameters SecurityParameters                             `asn1:"optional,explicit,tag:9"`
}

// # ASN.1 Definition:
//
//	ModifiedValidity ::= SEQUENCE {
//	  validFrom            [0]  CHOICE {
//	    now                  [0]  NULL,
//	    time                 [1]  Time,
//	    ...} DEFAULT now:NULL,
//	  validUntil           [1]  CHOICE {
//	    explicitTermination  [0]  NULL,
//	    time                 [1]  Time,
//	    unchanged            [2]  NULL,
//	    ... } DEFAULT unchanged:NULL,
//	  ... }
type ModifiedValidity struct {
	ValidFrom  ModifiedValidity_validFrom  `asn1:"optional,explicit,tag:0"`
	ValidUntil ModifiedValidity_validUntil `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	ModifyOperationalBindingResult ::= CHOICE {
//	  null            NULL,
//	  protected  [1]  OPTIONALLY-PROTECTED-SEQ{ ModifyOperationalBindingResultData },
//	  ... }
type ModifyOperationalBindingResult = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyOperationalBindingResultData ::= SEQUENCE {
//	    newBindingID    OperationalBindingID,
//	    bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
//	    newAgreement    OPERATIONAL-BINDING.&Agreement ({OpBindingSet}{@.bindingType}),
//	    valid           Validity OPTIONAL,
//	    ...,
//	    ...,
//	    COMPONENTS OF   CommonResultsSeq
//	    }
type ModifyOperationalBindingResultData struct {
	NewBindingID       OperationalBindingID
	BindingType        asn1.ObjectIdentifier
	NewAgreement       asn1.RawValue
	Valid              OBValidity         `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	TerminateOperationalBindingArgument ::= OPTIONALLY-PROTECTED-SEQ { TerminateOperationalBindingArgumentData }
type TerminateOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ

// # ASN.1 Definition:
//
//	TerminateOperationalBindingArgumentData ::= SEQUENCE {
//	  bindingType         [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//	  bindingID           [1]  OperationalBindingID,
//	  -- symmetric, Role A initiates, or Role B initiates
//	  initiator                CHOICE {
//	    symmetric           [2]  OPERATIONAL-BINDING.&both.&TerminateParam
//	                            ({OpBindingSet}{@bindingType}),
//	    roleA-initiates     [3]  OPERATIONAL-BINDING.&roleA.&TerminateParam
//	                            ({OpBindingSet}{@bindingType}),
//	    roleB-initiates     [4]  OPERATIONAL-BINDING.&roleB.&TerminateParam
//	                            ({OpBindingSet}{@bindingType})} OPTIONAL,
//	  terminateAt         [5]  Time OPTIONAL,
//	  securityParameters  [6]  SecurityParameters OPTIONAL,
//	  ...}
type TerminateOperationalBindingArgumentData struct {
	BindingType        asn1.ObjectIdentifier                             `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID                              `asn1:"explicit,tag:1"`
	Initiator          TerminateOperationalBindingArgumentData_initiator `asn1:"optional"`
	TerminateAt        Time                                              `asn1:"optional,explicit,tag:5"`
	SecurityParameters SecurityParameters                                `asn1:"optional,explicit,tag:6"`
}

// # ASN.1 Definition:
//
//	TerminateOperationalBindingResult ::= CHOICE {
//	  null            NULL,
//	  protected  [1]  OPTIONALLY-PROTECTED-SEQ{ TerminateOperationalBindingResultData },
//	  ... }
type TerminateOperationalBindingResult = asn1.RawValue

// # ASN.1 Definition:
//
//	TerminateOperationalBindingResultData ::= SEQUENCE {
//	  bindingID       OperationalBindingID,
//	  bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
//	  terminateAt     GeneralizedTime OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF   CommonResultsSeq }
type TerminateOperationalBindingResultData struct {
	BindingID          OperationalBindingID
	BindingType        asn1.ObjectIdentifier
	TerminateAt        time.Time          `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	OpBindingErrorParam ::= SEQUENCE {
//	  problem            [0]  ENUMERATED {
//	    invalidID              (0),
//	    duplicateID            (1),
//	    unsupportedBindingType (2),
//	    notAllowedForRole      (3),
//	    parametersMissing      (4),
//	    roleAssignment         (5),
//	    invalidStartTime       (6),
//	    invalidEndTime         (7),
//	    invalidAgreement       (8),
//	    currentlyNotDecidable  (9),
//	    modificationNotAllowed (10),
//	    invalidBindingType     (11),
//	    invalidNewID           (12),
//	    ... },
//	  bindingType        [1]  OPERATIONAL-BINDING.&id({OpBindingSet}) OPTIONAL,
//	  agreementProposal  [2]  OPERATIONAL-BINDING.&Agreement
//	                          ({OpBindingSet}{@bindingType}) OPTIONAL,
//	  retryAt            [3]  Time OPTIONAL,
//	  ...,
//	  ...,
//	  COMPONENTS OF           CommonResultsSeq }
type OpBindingErrorParam struct {
	Problem            OpBindingErrorParam_problem `asn1:"explicit,tag:0"`
	BindingType        asn1.ObjectIdentifier       `asn1:"optional,explicit,tag:1"`
	AgreementProposal  asn1.RawValue               `asn1:"optional,explicit,tag:2"`
	RetryAt            Time                        `asn1:"optional,explicit,tag:3"`
	SecurityParameters SecurityParameters          `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName           `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool                        `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)               `asn1:"optional,explicit,tag:27"`
}

// # ASN.1 Definition:
//
//	EstablishOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EstablishOperationalBindingArgumentData_initiator = asn1.RawValue

// # ASN.1 Definition:
//
//	Validity-validFrom ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type Validity_validFrom = asn1.RawValue

// # ASN.1 Definition:
//
//	Validity-validUntil ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type Validity_validUntil = asn1.RawValue

// # ASN.1 Definition:
//
//	EstablishOperationalBindingResultData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EstablishOperationalBindingResultData_initiator = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifyOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ModifyOperationalBindingArgumentData_initiator = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifiedValidity-validFrom ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ModifiedValidity_validFrom = asn1.RawValue

// # ASN.1 Definition:
//
//	ModifiedValidity-validUntil ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ModifiedValidity_validUntil = asn1.RawValue

// # ASN.1 Definition:
//
//	TerminateOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type TerminateOperationalBindingArgumentData_initiator = asn1.RawValue

// # ASN.1 Definition:
//
//	OpBindingErrorParam-problem ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type OpBindingErrorParam_problem = asn1.Enumerated

const (
	OpBindingErrorParam_problem_InvalidID              OpBindingErrorParam_problem = 0
	OpBindingErrorParam_problem_DuplicateID            OpBindingErrorParam_problem = 1
	OpBindingErrorParam_problem_UnsupportedBindingType OpBindingErrorParam_problem = 2
	OpBindingErrorParam_problem_NotAllowedForRole      OpBindingErrorParam_problem = 3
	OpBindingErrorParam_problem_ParametersMissing      OpBindingErrorParam_problem = 4
	OpBindingErrorParam_problem_RoleAssignment         OpBindingErrorParam_problem = 5
	OpBindingErrorParam_problem_InvalidStartTime       OpBindingErrorParam_problem = 6
	OpBindingErrorParam_problem_InvalidEndTime         OpBindingErrorParam_problem = 7
	OpBindingErrorParam_problem_InvalidAgreement       OpBindingErrorParam_problem = 8
	OpBindingErrorParam_problem_CurrentlyNotDecidable  OpBindingErrorParam_problem = 9
	OpBindingErrorParam_problem_ModificationNotAllowed OpBindingErrorParam_problem = 10
	OpBindingErrorParam_problem_InvalidBindingType     OpBindingErrorParam_problem = 11
	OpBindingErrorParam_problem_InvalidNewID           OpBindingErrorParam_problem = 12
)
