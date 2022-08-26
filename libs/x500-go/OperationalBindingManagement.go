package x500_go

import (
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgument */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingArgument  ::=
//   OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingArgumentData }
// ```
type EstablishOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgument */ /* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingArgumentData ::= SEQUENCE {
//   bindingType        [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//   bindingID          [1]  OperationalBindingID OPTIONAL,
//   accessPoint        [2]  AccessPoint,
//                -- symmetric, Role A initiates, or Role B initiates
//   initiator               CHOICE {
//     symmetric          [3]  OPERATIONAL-BINDING.&both.&EstablishParam
//                             ({OpBindingSet}{@bindingType}),
//     roleA-initiates    [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
//                             ({OpBindingSet}{@bindingType}),
//     roleB-initiates    [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
//                               ({OpBindingSet}{@bindingType})},
//   agreement          [6]  OPERATIONAL-BINDING.&Agreement
//                             ({OpBindingSet}{@bindingType}),
//   valid              [7]  Validity DEFAULT {},
//   securityParameters [8]  SecurityParameters OPTIONAL,
//   ... }
// ```
//
//
type EstablishOperationalBindingArgumentData struct {
	BindingType        asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID  `asn1:"optional,explicit,tag:1"`
	AccessPoint        AccessPoint           `asn1:"explicit,tag:2"`
	Initiator          EstablishOperationalBindingArgumentData_initiator
	Agreement          asn1.RawValue      `asn1:"explicit,tag:6"`
	Valid              OBValidity         `asn1:"optional,explicit,tag:7"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:8"`
}

/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgumentData */ /* START_OF_SYMBOL_DEFINITION OperationalBindingID */
// ### ASN.1 Definition:
//
// ```asn1
// OperationalBindingID ::= SEQUENCE {
//   identifier  INTEGER,
//   version     INTEGER,
//   ... }
// ```
//
//
type OperationalBindingID struct {
	Identifier int
	Version    int
}

/* END_OF_SYMBOL_DEFINITION OperationalBindingID */ /* START_OF_SYMBOL_DEFINITION Validity */
// ### ASN.1 Definition:
//
// ```asn1
// Validity ::= SEQUENCE {
//   validFrom            [0]  CHOICE {
//     now                  [0]  NULL,
//     time                 [1]  Time,
//     ...} DEFAULT now:NULL,
//   validUntil           [1]  CHOICE {
//     explicitTermination  [0]  NULL,
//     time                 [1]  Time,
//     ... } DEFAULT explicitTermination:NULL,
//   ... }
// ```
//
//
type OBValidity struct {
	ValidFrom  Validity_validFrom  `asn1:"optional,explicit,tag:0"`
	ValidUntil Validity_validUntil `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION Validity */ /* START_OF_SYMBOL_DEFINITION Time */
// ### ASN.1 Definition:
//
// ```asn1
// Time  ::=  CHOICE {
//   utcTime          UTCTime,
//   generalizedTime  GeneralizedTime,
//   ... }
// ```
// type Time = asn1.RawValue
/* END_OF_SYMBOL_DEFINITION Time */ /* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingResult */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingResult  ::=  OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingResultData }
// ```
type EstablishOperationalBindingResult = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingResult */ /* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingResultData */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingResultData ::= SEQUENCE {
//   bindingType   [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//   bindingID     [1]  OperationalBindingID OPTIONAL,
//   accessPoint   [2]  AccessPoint,
//   -- symmetric, Role A replies, or Role B replies
//   initiator          CHOICE {
//     symmetric     [3]  OPERATIONAL-BINDING.&both.&EstablishParam
//                          ({OpBindingSet}{@bindingType}),
//     roleA-replies [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
//                          ({OpBindingSet}{@bindingType}),
//     roleB-replies [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
//                          ({OpBindingSet}{@bindingType})},
//   ...,
//   ...,
//   COMPONENTS OF      CommonResultsSeq }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingResultData */ /* START_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgument */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyOperationalBindingArgument  ::=
//   OPTIONALLY-PROTECTED-SEQ { ModifyOperationalBindingArgumentData }
// ```
type ModifyOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgument */ /* START_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyOperationalBindingArgumentData ::= SEQUENCE {
//   bindingType       [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//   bindingID         [1]  OperationalBindingID,
//   accessPoint       [2]  AccessPoint OPTIONAL,
//   -- symmetric, Role A initiates, or Role B initiates
//   initiator              CHOICE {
//     symmetric         [3]  OPERATIONAL-BINDING.&both.&ModifyParam
//                           ({OpBindingSet}{@bindingType}),
//     roleA-initiates   [4]  OPERATIONAL-BINDING.&roleA.&ModifyParam
//                           ({OpBindingSet}{@bindingType}),
//     roleB-initiates   [5]  OPERATIONAL-BINDING.&roleB.&ModifyParam
//                           ({OpBindingSet}{@bindingType})} OPTIONAL,
//   newBindingID      [6]  OperationalBindingID,
//   newAgreement      [7]  OPERATIONAL-BINDING.&Agreement
//                        ({OpBindingSet}{@bindingType}) OPTIONAL,
//   valid               [8]  ModifiedValidity OPTIONAL,
//   securityParameters  [9]  SecurityParameters OPTIONAL,
//   ...}
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgumentData */ /* START_OF_SYMBOL_DEFINITION ModifiedValidity */
// ### ASN.1 Definition:
//
// ```asn1
// ModifiedValidity ::= SEQUENCE {
//   validFrom            [0]  CHOICE {
//     now                  [0]  NULL,
//     time                 [1]  Time,
//     ...} DEFAULT now:NULL,
//   validUntil           [1]  CHOICE {
//     explicitTermination  [0]  NULL,
//     time                 [1]  Time,
//     unchanged            [2]  NULL,
//     ... } DEFAULT unchanged:NULL,
//   ... }
// ```
//
//
type ModifiedValidity struct {
	ValidFrom  ModifiedValidity_validFrom  `asn1:"optional,explicit,tag:0"`
	ValidUntil ModifiedValidity_validUntil `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION ModifiedValidity */ /* START_OF_SYMBOL_DEFINITION ModifyOperationalBindingResult */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyOperationalBindingResult  ::=  CHOICE {
//   null            NULL,
//   protected  [1]  OPTIONALLY-PROTECTED-SEQ{ ModifyOperationalBindingResultData },
//   ... }
// ```
type ModifyOperationalBindingResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifyOperationalBindingResult */ /* START_OF_SYMBOL_DEFINITION ModifyOperationalBindingResultData */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyOperationalBindingResultData ::= SEQUENCE {
//     newBindingID    OperationalBindingID,
//     bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
//     newAgreement    OPERATIONAL-BINDING.&Agreement ({OpBindingSet}{@.bindingType}),
//     valid           Validity OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF   CommonResultsSeq
//     }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ModifyOperationalBindingResultData */ /* START_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgument */
// ### ASN.1 Definition:
//
// ```asn1
// TerminateOperationalBindingArgument  ::=
//   OPTIONALLY-PROTECTED-SEQ { TerminateOperationalBindingArgumentData }
// ```
type TerminateOperationalBindingArgument = OPTIONALLY_PROTECTED_SEQ // DefinedType
/* END_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgument */ /* START_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgumentData */
// ### ASN.1 Definition:
//
// ```asn1
// TerminateOperationalBindingArgumentData ::= SEQUENCE {
//   bindingType         [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//   bindingID           [1]  OperationalBindingID,
//   -- symmetric, Role A initiates, or Role B initiates
//   initiator                CHOICE {
//     symmetric           [2]  OPERATIONAL-BINDING.&both.&TerminateParam
//                             ({OpBindingSet}{@bindingType}),
//     roleA-initiates     [3]  OPERATIONAL-BINDING.&roleA.&TerminateParam
//                             ({OpBindingSet}{@bindingType}),
//     roleB-initiates     [4]  OPERATIONAL-BINDING.&roleB.&TerminateParam
//                             ({OpBindingSet}{@bindingType})} OPTIONAL,
//   terminateAt         [5]  Time OPTIONAL,
//   securityParameters  [6]  SecurityParameters OPTIONAL,
//   ...}
// ```
//
//
type TerminateOperationalBindingArgumentData struct {
	BindingType        asn1.ObjectIdentifier                             `asn1:"explicit,tag:0"`
	BindingID          OperationalBindingID                              `asn1:"explicit,tag:1"`
	Initiator          TerminateOperationalBindingArgumentData_initiator `asn1:"optional"`
	TerminateAt        Time                                              `asn1:"optional,explicit,tag:5"`
	SecurityParameters SecurityParameters                                `asn1:"optional,explicit,tag:6"`
}

/* END_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgumentData */ /* START_OF_SYMBOL_DEFINITION TerminateOperationalBindingResult */
// ### ASN.1 Definition:
//
// ```asn1
// TerminateOperationalBindingResult  ::=  CHOICE {
//   null            NULL,
//   protected  [1]  OPTIONALLY-PROTECTED-SEQ{ TerminateOperationalBindingResultData },
//   ... }
// ```
type TerminateOperationalBindingResult = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TerminateOperationalBindingResult */ /* START_OF_SYMBOL_DEFINITION TerminateOperationalBindingResultData */
// ### ASN.1 Definition:
//
// ```asn1
// TerminateOperationalBindingResultData ::= SEQUENCE {
//   bindingID       OperationalBindingID,
//   bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
//   terminateAt     GeneralizedTime OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF   CommonResultsSeq }
// ```
//
//
type TerminateOperationalBindingResultData struct {
	BindingID          OperationalBindingID
	BindingType        asn1.ObjectIdentifier
	TerminateAt        time.Time          `asn1:"optional"`
	SecurityParameters SecurityParameters `asn1:"optional,explicit,tag:30"`
	Performer          DistinguishedName  `asn1:"optional,explicit,tag:29"`
	AliasDereferenced  bool               `asn1:"optional,explicit,tag:28"`
	Notification       [](Attribute)      `asn1:"optional,explicit,tag:27"`
}

/* END_OF_SYMBOL_DEFINITION TerminateOperationalBindingResultData */ /* START_OF_SYMBOL_DEFINITION OpBindingErrorParam */
// ### ASN.1 Definition:
//
// ```asn1
// OpBindingErrorParam ::= SEQUENCE {
//   problem            [0]  ENUMERATED {
//     invalidID              (0),
//     duplicateID            (1),
//     unsupportedBindingType (2),
//     notAllowedForRole      (3),
//     parametersMissing      (4),
//     roleAssignment         (5),
//     invalidStartTime       (6),
//     invalidEndTime         (7),
//     invalidAgreement       (8),
//     currentlyNotDecidable  (9),
//     modificationNotAllowed (10),
//     invalidBindingType     (11),
//     invalidNewID           (12),
//     ... },
//   bindingType        [1]  OPERATIONAL-BINDING.&id({OpBindingSet}) OPTIONAL,
//   agreementProposal  [2]  OPERATIONAL-BINDING.&Agreement
//                           ({OpBindingSet}{@bindingType}) OPTIONAL,
//   retryAt            [3]  Time OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF           CommonResultsSeq }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION OpBindingErrorParam */ /* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgumentData_initiator */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EstablishOperationalBindingArgumentData_initiator = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingArgumentData_initiator */ /* START_OF_SYMBOL_DEFINITION Validity_validFrom */
// ### ASN.1 Definition:
//
// ```asn1
// Validity-validFrom ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type Validity_validFrom = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Validity_validFrom */ /* START_OF_SYMBOL_DEFINITION Validity_validUntil */
// ### ASN.1 Definition:
//
// ```asn1
// Validity-validUntil ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type Validity_validUntil = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Validity_validUntil */ /* START_OF_SYMBOL_DEFINITION EstablishOperationalBindingResultData_initiator */
// ### ASN.1 Definition:
//
// ```asn1
// EstablishOperationalBindingResultData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EstablishOperationalBindingResultData_initiator = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EstablishOperationalBindingResultData_initiator */ /* START_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgumentData_initiator */
// ### ASN.1 Definition:
//
// ```asn1
// ModifyOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ModifyOperationalBindingArgumentData_initiator = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifyOperationalBindingArgumentData_initiator */ /* START_OF_SYMBOL_DEFINITION ModifiedValidity_validFrom */
// ### ASN.1 Definition:
//
// ```asn1
// ModifiedValidity-validFrom ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ModifiedValidity_validFrom = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifiedValidity_validFrom */ /* START_OF_SYMBOL_DEFINITION ModifiedValidity_validUntil */
// ### ASN.1 Definition:
//
// ```asn1
// ModifiedValidity-validUntil ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ModifiedValidity_validUntil = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ModifiedValidity_validUntil */ /* START_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgumentData_initiator */
// ### ASN.1 Definition:
//
// ```asn1
// TerminateOperationalBindingArgumentData-initiator ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type TerminateOperationalBindingArgumentData_initiator = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TerminateOperationalBindingArgumentData_initiator */ /* START_OF_SYMBOL_DEFINITION OpBindingErrorParam_problem */
// ### ASN.1 Definition:
//
// ```asn1
// OpBindingErrorParam-problem ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type OpBindingErrorParam_problem = int

const (
	OpBindingErrorParam_problem_InvalidID              OpBindingErrorParam_problem = 0  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_DuplicateID            OpBindingErrorParam_problem = 1  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_UnsupportedBindingType OpBindingErrorParam_problem = 2  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_NotAllowedForRole      OpBindingErrorParam_problem = 3  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_ParametersMissing      OpBindingErrorParam_problem = 4  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_RoleAssignment         OpBindingErrorParam_problem = 5  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_InvalidStartTime       OpBindingErrorParam_problem = 6  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_InvalidEndTime         OpBindingErrorParam_problem = 7  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_InvalidAgreement       OpBindingErrorParam_problem = 8  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_CurrentlyNotDecidable  OpBindingErrorParam_problem = 9  // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_ModificationNotAllowed OpBindingErrorParam_problem = 10 // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_InvalidBindingType     OpBindingErrorParam_problem = 11 // LONG_NAMED_ENUMERATED_VALUE,
	OpBindingErrorParam_problem_InvalidNewID           OpBindingErrorParam_problem = 12 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION OpBindingErrorParam_problem */
