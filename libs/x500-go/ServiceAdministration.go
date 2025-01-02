package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	SearchRule ::= SEQUENCE {
//	  COMPONENTS OF SearchRuleId,
//	  serviceType           [1]  OBJECT IDENTIFIER                          OPTIONAL,
//	  userClass             [2]  INTEGER                                    OPTIONAL,
//	  inputAttributeTypes   [3]  SEQUENCE SIZE (0..MAX) OF RequestAttribute OPTIONAL,
//	  attributeCombination  [4]  AttributeCombination                       DEFAULT and:{},
//	  outputAttributeTypes  [5]  SEQUENCE SIZE (1..MAX) OF ResultAttribute  OPTIONAL,
//	  defaultControls       [6]  ControlOptions                             OPTIONAL,
//	  mandatoryControls     [7]  ControlOptions                             OPTIONAL,
//	  searchRuleControls    [8]  ControlOptions                             OPTIONAL,
//	  familyGrouping        [9]  FamilyGrouping                             OPTIONAL,
//	  familyReturn          [10] FamilyReturn                               OPTIONAL,
//	  relaxation            [11] RelaxationPolicy                           OPTIONAL,
//	  additionalControl     [12] SEQUENCE SIZE (1..MAX) OF AttributeType    OPTIONAL,
//	  allowedSubset         [13] AllowedSubset                              DEFAULT '111'B,
//	  imposedSubset         [14] ImposedSubset                              OPTIONAL,
//	  entryLimit            [15] EntryLimit                                 OPTIONAL,
//	  ... }
type SearchRule struct {
	Id                   int
	DmdId                asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	ServiceType          asn1.ObjectIdentifier `asn1:"optional,explicit,tag:1"`
	UserClass            int                   `asn1:"optional,explicit,tag:2"`
	InputAttributeTypes  [](RequestAttribute)  `asn1:"optional,explicit,tag:3"`
	AttributeCombination AttributeCombination  `asn1:"optional,explicit,tag:4"`
	OutputAttributeTypes [](ResultAttribute)   `asn1:"optional,explicit,tag:5"`
	DefaultControls      ControlOptions        `asn1:"optional,explicit,tag:6"`
	MandatoryControls    ControlOptions        `asn1:"optional,explicit,tag:7"`
	SearchRuleControls   ControlOptions        `asn1:"optional,explicit,tag:8"`
	FamilyGrouping       FamilyGrouping        `asn1:"optional,explicit,tag:9"`
	FamilyReturn         FamilyReturn          `asn1:"optional,explicit,tag:10"`
	Relaxation           RelaxationPolicy      `asn1:"optional,explicit,tag:11"`
	AdditionalControl    [](AttributeType)     `asn1:"optional,explicit,tag:12"`
	AllowedSubset        AllowedSubset         `asn1:"optional,explicit,tag:13"`
	ImposedSubset        ImposedSubset         `asn1:"optional,explicit,tag:14"`
	EntryLimit           EntryLimit            `asn1:"optional,explicit,tag:15"`
}

// # ASN.1 Definition:
//
//	SearchRuleId ::= SEQUENCE {
//	  id          INTEGER,
//	  dmdId  [0]  OBJECT IDENTIFIER }
type SearchRuleId struct {
	Id    int
	DmdId asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
}

// # ASN.1 Definition:
//
// AllowedSubset  ::=  BIT STRING {baseObject(0), oneLevel(1), wholeSubtree(2)}
type AllowedSubset = asn1.BitString

const AllowedSubset_BaseObject int32 = 0

const AllowedSubset_OneLevel int32 = 1

const AllowedSubset_WholeSubtree int32 = 2

// # ASN.1 Definition:
//
// ImposedSubset  ::=  ENUMERATED {baseObject(0), oneLevel(1), wholeSubtree(2),...}
type ImposedSubset = asn1.Enumerated

const (
	ImposedSubset_BaseObject   ImposedSubset = 0
	ImposedSubset_OneLevel     ImposedSubset = 1
	ImposedSubset_WholeSubtree ImposedSubset = 2
)

// # ASN.1 Definition:
//
//	RequestAttribute ::= SEQUENCE {
//	  attributeType            ATTRIBUTE.&id({SupportedAttributes}),
//	  includeSubtypes     [0]  BOOLEAN DEFAULT FALSE,
//	  selectedValues      [1]  SEQUENCE SIZE (0..MAX) OF ATTRIBUTE.&Type
//	                           ({SupportedAttributes}{@attributeType}) OPTIONAL,
//	  defaultValues       [2]  SEQUENCE SIZE (0..MAX) OF SEQUENCE {
//	    entryType                OBJECT-CLASS.&id OPTIONAL,
//	    values                   SEQUENCE OF ATTRIBUTE.&Type
//	                             ({SupportedAttributes}{@attributeType}),
//	                             ...} OPTIONAL,
//	  contexts            [3]  SEQUENCE SIZE (0..MAX) OF ContextProfile OPTIONAL,
//	  contextCombination  [4]  ContextCombination DEFAULT and:{},
//	  matchingUse         [5]  SEQUENCE SIZE (1..MAX) OF MatchingUse OPTIONAL,
//	  ... }
type RequestAttribute struct {
	AttributeType      asn1.ObjectIdentifier
	IncludeSubtypes    bool                                    `asn1:"optional,explicit,tag:0"`
	SelectedValues     [](asn1.RawValue)                       `asn1:"optional,explicit,tag:1"`
	DefaultValues      [](RequestAttribute_defaultValues_Item) `asn1:"optional,explicit,tag:2"`
	Contexts           [](ContextProfile)                      `asn1:"optional,explicit,tag:3"`
	ContextCombination ContextCombination                      `asn1:"optional,explicit,tag:4"`
	MatchingUse        [](MatchingUse)                         `asn1:"optional,explicit,tag:5"`
}

// # ASN.1 Definition:
//
//	ContextProfile ::= SEQUENCE {
//	  contextType   CONTEXT.&id({SupportedContexts}),
//	  contextValue  SEQUENCE SIZE (1..MAX) OF CONTEXT.&Assertion
//	                 ({SupportedContexts}{@contextType}) OPTIONAL,
//	  ... }
type ContextProfile struct {
	ContextType  asn1.ObjectIdentifier
	ContextValue [](asn1.RawValue) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ContextCombination  ::=  CHOICE {
//	  context  [0]  CONTEXT.&id({SupportedContexts}),
//	  and      [1]  SEQUENCE OF ContextCombination,
//	  or       [2]  SEQUENCE OF ContextCombination,
//	  not      [3]  ContextCombination,
//	  ... }
type ContextCombination = asn1.RawValue

// # ASN.1 Definition:
//
//	MatchingUse ::= SEQUENCE {
//	  restrictionType    MATCHING-RESTRICTION.&id({SupportedMatchingRestrictions}),
//	  restrictionValue   MATCHING-RESTRICTION.&Restriction
//	                        ({SupportedMatchingRestrictions}{@restrictionType}),
//	  ... }
type MatchingUse struct {
	RestrictionType  asn1.ObjectIdentifier
	RestrictionValue asn1.RawValue
}

// # ASN.1 Definition:
//
//	AttributeCombination  ::=  CHOICE {
//	  attribute  [0]  AttributeType,
//	  and        [1]  SEQUENCE OF AttributeCombination,
//	  or         [2]  SEQUENCE OF AttributeCombination,
//	  not        [3]  AttributeCombination,
//	  ... }
type AttributeCombination = asn1.RawValue

// # ASN.1 Definition:
//
//	ResultAttribute ::= SEQUENCE {
//	  attributeType      ATTRIBUTE.&id({SupportedAttributes}),
//	  outputValues       CHOICE {
//	    selectedValues     SEQUENCE OF ATTRIBUTE.&Type
//	                       ({SupportedAttributes}{@attributeType}),
//	    matchedValuesOnly  NULL } OPTIONAL,
//	  contexts      [0]  SEQUENCE SIZE (1..MAX) OF ContextProfile OPTIONAL,
//	  ... }
type ResultAttribute struct {
	AttributeType asn1.ObjectIdentifier
	OutputValues  ResultAttribute_outputValues `asn1:"optional"`
	Contexts      [](ContextProfile)           `asn1:"optional,explicit,tag:0"`
}

// # ASN.1 Definition:
//
//	ControlOptions ::= SEQUENCE {
//	  serviceControls   [0]  ServiceControlOptions DEFAULT {},
//	  searchOptions     [1]  SearchControlOptions  DEFAULT {searchAliases},
//	  hierarchyOptions  [2]  HierarchySelections   OPTIONAL,
//	  ... }
type ControlOptions struct {
	ServiceControls  ServiceControlOptions `asn1:"optional,explicit,tag:0"`
	SearchOptions    SearchControlOptions  `asn1:"optional,explicit,tag:1"`
	HierarchyOptions HierarchySelections   `asn1:"optional,explicit,tag:2"`
}

// # ASN.1 Definition:
//
//	EntryLimit ::= SEQUENCE {
//	  default  INTEGER,
//	  max      INTEGER,
//	  ... }
type EntryLimit struct {
	Default int
	Max     int
}

// # ASN.1 Definition:
//
//	RelaxationPolicy ::= SEQUENCE {
//	  basic        [0]  MRMapping DEFAULT {},
//	  tightenings  [1]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
//	  relaxations  [2]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
//	  maximum      [3]  INTEGER OPTIONAL, -- mandatory if tightenings is present
//	  minimum      [4]  INTEGER DEFAULT 1,
//	  ... }
type RelaxationPolicy struct {
	Basic       MRMapping     `asn1:"optional,explicit,tag:0"`
	Tightenings [](MRMapping) `asn1:"optional,explicit,tag:1"`
	Relaxations [](MRMapping) `asn1:"optional,explicit,tag:2"`
	Maximum     int           `asn1:"optional,explicit,tag:3"`
	Minimum     int           `asn1:"optional,explicit,tag:4,default:1"`
}

// # ASN.1 Definition:
//
//	MRMapping ::= SEQUENCE {
//	  mapping       [0]  SEQUENCE SIZE (1..MAX) OF Mapping OPTIONAL,
//	  substitution  [1]  SEQUENCE SIZE (1..MAX) OF MRSubstitution OPTIONAL,
//	  ... }
type MRMapping struct {
	Mapping      [](Mapping)        `asn1:"optional,explicit,tag:0"`
	Substitution [](MRSubstitution) `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	Mapping ::= SEQUENCE {
//	  mappingFunction  OBJECT IDENTIFIER (CONSTRAINED BY {-- shall be an--
//	                     -- object identifier of a mapping-based matching algorithm -- }),
//	  level            INTEGER DEFAULT 0,
//	  ... }
type Mapping struct {
	MappingFunction asn1.ObjectIdentifier
	Level           int `asn1:"optional,default:0"`
}

// # ASN.1 Definition:
//
//	MRSubstitution ::= SEQUENCE {
//	  attribute             AttributeType,
//	  oldMatchingRule  [0]  MATCHING-RULE.&id OPTIONAL,
//	  newMatchingRule  [1]  MATCHING-RULE.&id OPTIONAL,
//	  ... }
type MRSubstitution struct {
	Attribute       AttributeType
	OldMatchingRule asn1.ObjectIdentifier `asn1:"optional,explicit,tag:0"`
	NewMatchingRule asn1.ObjectIdentifier `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
// RequestAttribute-defaultValues-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type RequestAttribute_defaultValues_Item struct {
	EntryType asn1.ObjectIdentifier `asn1:"optional"`
	Values    [](asn1.RawValue)
}

// # ASN.1 Definition:
//
// ResultAttribute-outputValues ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ResultAttribute_outputValues = asn1.RawValue
