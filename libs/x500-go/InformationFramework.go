package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	Attribute {ATTRIBUTE:SupportedAttributes} ::= SEQUENCE {
//	  type                ATTRIBUTE.&id({SupportedAttributes}),
//	  values              SET SIZE (0..MAX) OF ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//	  valuesWithContext   SET SIZE (1..MAX) OF SEQUENCE {
//	    value               ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//	    contextList         SET SIZE (1..MAX) OF Context,
//	    ...} OPTIONAL,
//	  ... }
type Attribute struct {
	Type              asn1.ObjectIdentifier
	Values            [](asn1.RawValue)                    `asn1:"set"`
	ValuesWithContext [](Attribute_valuesWithContext_Item) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	AttributeType ::= ATTRIBUTE.&id
type AttributeType = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	AttributeValue ::= ATTRIBUTE.&Type
type AttributeValue = asn1.RawValue

// # ASN.1 Definition:
//
//	Context ::= SEQUENCE {
//	  contextType    CONTEXT.&id({SupportedContexts}),
//	  contextValues
//	    SET SIZE (1..MAX) OF CONTEXT.&Type({SupportedContexts}{@contextType}),
//	  fallback       BOOLEAN DEFAULT FALSE,
//	  ... }
type Context struct {
	ContextType   asn1.ObjectIdentifier
	ContextValues [](asn1.RawValue) `asn1:"set"`
	Fallback      bool              `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	AttributeValueAssertion ::= SEQUENCE {
//	  type              ATTRIBUTE.&id({SupportedAttributes}),
//	  assertion         ATTRIBUTE.&equality-match.&AssertionType
//	                      ({SupportedAttributes}{@type}),
//	  assertedContexts  CHOICE {
//	    allContexts       [0]  NULL,
//	    selectedContexts  [1]  SET SIZE (1..MAX) OF ContextAssertion } OPTIONAL,
//	  ... }
type AttributeValueAssertion struct {
	Type             asn1.ObjectIdentifier
	Assertion        asn1.RawValue
	AssertedContexts AttributeValueAssertion_assertedContexts `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ContextAssertion ::= SEQUENCE {
//	  contextType    CONTEXT.&id({SupportedContexts}),
//	  contextValues  SET SIZE (1..MAX) OF
//	      CONTEXT.&Assertion({SupportedContexts}{@contextType}),
//	  ... }
type ContextAssertion struct {
	ContextType   asn1.ObjectIdentifier
	ContextValues [](asn1.RawValue) `asn1:"set"`
}

// # ASN.1 Definition:
//
//	AttributeTypeAssertion ::= SEQUENCE {
//	  type              ATTRIBUTE.&id({SupportedAttributes}),
//	  assertedContexts  SEQUENCE SIZE (1..MAX) OF ContextAssertion OPTIONAL,
//	  ... }
type AttributeTypeAssertion struct {
	Type             asn1.ObjectIdentifier
	AssertedContexts [](ContextAssertion) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Name ::= CHOICE { -- only one possibility for now -- rdnSequence  RDNSequence }
type Name = asn1.RawValue

// # ASN.1 Definition:
//
//	DistinguishedName ::= RDNSequence
type DistinguishedName = pkix.RDNSequence

// # ASN.1 Definition:
//
//	RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue
type RelativeDistinguishedName = [](pkix.AttributeTypeAndValue)

// # ASN.1 Definition:
//
//	SubtreeSpecification ::= SEQUENCE {
//	  base                 [0]  LocalName DEFAULT {},
//	  COMPONENTS OF             ChopSpecification,
//	  specificationFilter  [4]  Refinement OPTIONAL,
//	  ... }
type SubtreeSpecification struct {
	Base                LocalName                                     `asn1:"optional,explicit,tag:0"`
	SpecificExclusions  [](ChopSpecification_specificExclusions_Item) `asn1:"optional,explicit,tag:1,set"`
	Minimum             BaseDistance                                  `asn1:"optional,explicit,tag:2"`
	Maximum             BaseDistance                                  `asn1:"optional,explicit,tag:3"`
	SpecificationFilter Refinement                                    `asn1:"optional,explicit,tag:4"`
}

// # ASN.1 Definition:
//
//	LocalName ::= RDNSequence
type LocalName = pkix.RDNSequence

// # ASN.1 Definition:
//
//	ChopSpecification-specificExclusions-Item ::= CHOICE {
//	    chopBefore  [0]  LocalName,
//	    chopAfter   [1]  LocalName,
//	    ...}
type ChopSpecification_specificExclusions_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	ChopSpecification ::= SEQUENCE {
//	  specificExclusions    [1]  SET SIZE (1..MAX) OF ChopSpecification-specificExclusions-Item OPTIONAL,
//	  minimum       [2]  BaseDistance DEFAULT 0,
//	  maximum       [3]  BaseDistance OPTIONAL,
//	  ... }
type ChopSpecification struct {
	SpecificExclusions [](ChopSpecification_specificExclusions_Item) `asn1:"optional,explicit,tag:1,set"`
	Minimum            BaseDistance                                  `asn1:"optional,explicit,tag:2"`
	Maximum            BaseDistance                                  `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	BaseDistance ::= INTEGER(0..MAX)
type BaseDistance = int64

// # ASN.1 Definition:
//
//	Refinement ::= CHOICE {
//	  item  [0]  OBJECT-CLASS.&id,
//	  and   [1]  SET SIZE (1..MAX) OF Refinement,
//	  or    [2]  SET SIZE (1..MAX) OF Refinement,
//	  not   [3]  Refinement,
//	  ... }
type Refinement = asn1.RawValue

// # ASN.1 Definition:
//
//	ObjectClassKind ::= ENUMERATED {
//	  abstract   (0),
//	  structural (1),
//	  auxiliary  (2)}
type ObjectClassKind = asn1.Enumerated

const (
	ObjectClassKind_Abstract   ObjectClassKind = 0
	ObjectClassKind_Structural ObjectClassKind = 1
	ObjectClassKind_Auxiliary  ObjectClassKind = 2
)

// # ASN.1 Definition:
//
//	AttributeUsage ::= ENUMERATED {
//	  userApplications     (0),
//	  directoryOperation   (1),
//	  distributedOperation (2),
//	  dSAOperation         (3),
//	  ... }
type AttributeUsage = asn1.Enumerated

const (
	AttributeUsage_UserApplications     AttributeUsage = 0
	AttributeUsage_DirectoryOperation   AttributeUsage = 1
	AttributeUsage_DistributedOperation AttributeUsage = 2
	AttributeUsage_DSAOperation         AttributeUsage = 3
)

// # ASN.1 Definition:
//
//	DITStructureRule ::= SEQUENCE {
//	  ruleIdentifier          RuleIdentifier,
//	  nameForm                NAME-FORM.&id,
//	  superiorStructureRules  SET SIZE (1..MAX) OF RuleIdentifier OPTIONAL,
//	  ... }
type DITStructureRule struct {
	RuleIdentifier         RuleIdentifier
	NameForm               asn1.ObjectIdentifier
	SuperiorStructureRules [](RuleIdentifier) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	RuleIdentifier ::= INTEGER
type RuleIdentifier = int64

// # ASN.1 Definition:
//
//	DITContentRule ::= SEQUENCE {
//	  structuralObjectClass       OBJECT-CLASS.&id,
//	  auxiliaries                 SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//	  mandatory              [1]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//	  optional               [2]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//	  precluded              [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//	  ... }
type DITContentRule struct {
	StructuralObjectClass asn1.ObjectIdentifier
	Auxiliaries           [](asn1.ObjectIdentifier) `asn1:"optional,set"`
	Mandatory             [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:1,set"`
	Optional              [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:2,set"`
	Precluded             [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:3,set"`
}

// # ASN.1 Definition:
//
//	DITContextUse ::= SEQUENCE {
//	  attributeType           ATTRIBUTE.&id,
//	  mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//	  optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//	  ... }
type DITContextUse struct {
	AttributeType     asn1.ObjectIdentifier
	MandatoryContexts [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:1,set"`
	OptionalContexts  [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:2,set"`
}

// # ASN.1 Definition:
//
//	SearchRuleDescription ::= SEQUENCE {
//	  COMPONENTS OF      SearchRule,
//	  name         [28]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//	  description  [29]  UnboundedDirectoryString OPTIONAL,
//	  ... }
type SearchRuleDescription struct {
	Id                   int
	DmdId                asn1.ObjectIdentifier        `asn1:"explicit,tag:0"`
	ServiceType          asn1.ObjectIdentifier        `asn1:"optional,explicit,tag:1"`
	UserClass            int                          `asn1:"optional,explicit,tag:2"`
	InputAttributeTypes  [](RequestAttribute)         `asn1:"optional,explicit,tag:3"`
	AttributeCombination AttributeCombination         `asn1:"optional,explicit,tag:4"`
	OutputAttributeTypes [](ResultAttribute)          `asn1:"optional,explicit,tag:5"`
	DefaultControls      ControlOptions               `asn1:"optional,explicit,tag:6"`
	MandatoryControls    ControlOptions               `asn1:"optional,explicit,tag:7"`
	SearchRuleControls   ControlOptions               `asn1:"optional,explicit,tag:8"`
	FamilyGrouping       FamilyGrouping               `asn1:"optional,explicit,tag:9"`
	FamilyReturn         FamilyReturn                 `asn1:"optional,explicit,tag:10"`
	Relaxation           RelaxationPolicy             `asn1:"optional,explicit,tag:11"`
	AdditionalControl    [](AttributeType)            `asn1:"optional,explicit,tag:12"`
	AllowedSubset        AllowedSubset                `asn1:"optional,explicit,tag:13"`
	ImposedSubset        ImposedSubset                `asn1:"optional,explicit,tag:14"`
	EntryLimit           EntryLimit                   `asn1:"optional,explicit,tag:15"`
	Name                 [](UnboundedDirectoryString) `asn1:"optional,explicit,tag:28,set"`
	Description          UnboundedDirectoryString     `asn1:"optional,explicit,tag:29"`
}

// # ASN.1 Definition:
//
//	PwdHistory{ATTRIBUTE:passwordAttribute} ::= SEQUENCE {
//	  time       GeneralizedTime,
//	  password   passwordAttribute.&Type,
//	  ...}
type PwdHistory struct {
	Time     time.Time
	Password asn1.RawValue
}

// # ASN.1 Definition:
//
//	HierarchyLevel ::= INTEGER
type HierarchyLevel = int64

// # ASN.1 Definition:
//
//	HierarchyBelow ::= BOOLEAN
type HierarchyBelow = bool

// # ASN.1 Definition:
//
//	id-oc-top                              OBJECT IDENTIFIER ::= {id-oc 0}
var Id_oc_top asn1.ObjectIdentifier = []int{2, 5, 6, 0}

// # ASN.1 Definition:
//
//	id-oc-alias                            OBJECT IDENTIFIER ::= {id-oc 1}
var Id_oc_alias asn1.ObjectIdentifier = []int{2, 5, 6, 1}

// # ASN.1 Definition:
//
//	id-oc-parent                           OBJECT IDENTIFIER ::= {id-oc 28}
var Id_oc_parent asn1.ObjectIdentifier = []int{2, 5, 6, 28}

// # ASN.1 Definition:
//
//	id-oc-child                            OBJECT IDENTIFIER ::= {id-oc 29}
var Id_oc_child asn1.ObjectIdentifier = []int{2, 5, 6, 29}

// # ASN.1 Definition:
//
//	id-at-objectClass                      OBJECT IDENTIFIER ::= {id-at 0}
var Id_at_objectClass asn1.ObjectIdentifier = []int{2, 5, 4, 0}

// # ASN.1 Definition:
//
//	id-at-aliasedEntryName                 OBJECT IDENTIFIER ::= {id-at 1}
var Id_at_aliasedEntryName asn1.ObjectIdentifier = []int{2, 5, 4, 1}

// # ASN.1 Definition:
//
//	id-at-pwdAttribute                     OBJECT IDENTIFIER ::= {id-at 84}
var Id_at_pwdAttribute asn1.ObjectIdentifier = []int{2, 5, 4, 84}

// # ASN.1 Definition:
//
//	id-mr-objectIdentifierMatch            OBJECT IDENTIFIER ::= {id-mr 0}
var Id_mr_objectIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 0}

// # ASN.1 Definition:
//
//	id-mr-distinguishedNameMatch           OBJECT IDENTIFIER ::= {id-mr 1}
var Id_mr_distinguishedNameMatch asn1.ObjectIdentifier = []int{2, 5, 13, 1}

// # ASN.1 Definition:
//
//	id-oa-excludeAllCollectiveAttributes   OBJECT IDENTIFIER ::= {id-oa 0}
var Id_oa_excludeAllCollectiveAttributes asn1.ObjectIdentifier = []int{2, 5, 18, 0}

// # ASN.1 Definition:
//
//	id-oa-createTimestamp                  OBJECT IDENTIFIER ::= {id-oa 1}
var Id_oa_createTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 1}

// # ASN.1 Definition:
//
//	id-oa-modifyTimestamp                  OBJECT IDENTIFIER ::= {id-oa 2}
var Id_oa_modifyTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 2}

// # ASN.1 Definition:
//
//	id-oa-creatorsName                     OBJECT IDENTIFIER ::= {id-oa 3}
var Id_oa_creatorsName asn1.ObjectIdentifier = []int{2, 5, 18, 3}

// # ASN.1 Definition:
//
//	id-oa-modifiersName                    OBJECT IDENTIFIER ::= {id-oa 4}
var Id_oa_modifiersName asn1.ObjectIdentifier = []int{2, 5, 18, 4}

// # ASN.1 Definition:
//
//	id-oa-administrativeRole               OBJECT IDENTIFIER ::= {id-oa 5}
var Id_oa_administrativeRole asn1.ObjectIdentifier = []int{2, 5, 18, 5}

// # ASN.1 Definition:
//
//	id-oa-subtreeSpecification             OBJECT IDENTIFIER ::= {id-oa 6}
var Id_oa_subtreeSpecification asn1.ObjectIdentifier = []int{2, 5, 18, 6}

// # ASN.1 Definition:
//
//	id-oa-collectiveExclusions             OBJECT IDENTIFIER ::= {id-oa 7}
var Id_oa_collectiveExclusions asn1.ObjectIdentifier = []int{2, 5, 18, 7}

// # ASN.1 Definition:
//
//	id-oa-subschemaTimestamp               OBJECT IDENTIFIER ::= {id-oa 8}
var Id_oa_subschemaTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 8}

// # ASN.1 Definition:
//
//	id-oa-hasSubordinates                  OBJECT IDENTIFIER ::= {id-oa 9}
var Id_oa_hasSubordinates asn1.ObjectIdentifier = []int{2, 5, 18, 9}

// # ASN.1 Definition:
//
//	id-oa-subschemaSubentryList            OBJECT IDENTIFIER ::= {id-oa 10}
var Id_oa_subschemaSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 10}

// # ASN.1 Definition:
//
//	id-oa-accessControlSubentryList        OBJECT IDENTIFIER ::= {id-oa 11}
var Id_oa_accessControlSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 11}

// # ASN.1 Definition:
//
//	id-oa-collectiveAttributeSubentryList  OBJECT IDENTIFIER ::= {id-oa 12}
var Id_oa_collectiveAttributeSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 12}

// # ASN.1 Definition:
//
//	id-oa-contextDefaultSubentryList       OBJECT IDENTIFIER ::= {id-oa 13}
var Id_oa_contextDefaultSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 13}

// # ASN.1 Definition:
//
//	id-oa-contextAssertionDefault          OBJECT IDENTIFIER ::= {id-oa 14}
var Id_oa_contextAssertionDefault asn1.ObjectIdentifier = []int{2, 5, 18, 14}

// # ASN.1 Definition:
//
//	id-oa-serviceAdminSubentryList         OBJECT IDENTIFIER ::= {id-oa 15}
var Id_oa_serviceAdminSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 15}

// # ASN.1 Definition:
//
//	id-oa-searchRules                      OBJECT IDENTIFIER ::= {id-oa 16}
var Id_oa_searchRules asn1.ObjectIdentifier = []int{2, 5, 18, 16}

// # ASN.1 Definition:
//
//	id-oa-hierarchyLevel                   OBJECT IDENTIFIER ::= {id-oa 17}
var Id_oa_hierarchyLevel asn1.ObjectIdentifier = []int{2, 5, 18, 17}

// # ASN.1 Definition:
//
//	id-oa-hierarchyBelow                   OBJECT IDENTIFIER ::= {id-oa 18}
var Id_oa_hierarchyBelow asn1.ObjectIdentifier = []int{2, 5, 18, 18}

// # ASN.1 Definition:
//
//	id-oa-hierarchyParent                  OBJECT IDENTIFIER ::= {id-oa 19}
var Id_oa_hierarchyParent asn1.ObjectIdentifier = []int{2, 5, 18, 19}

// # ASN.1 Definition:
//
//	id-oa-hierarchyTop                     OBJECT IDENTIFIER ::= {id-oa 20}
var Id_oa_hierarchyTop asn1.ObjectIdentifier = []int{2, 5, 18, 20}

// # ASN.1 Definition:
//
//	id-oa-pwdAdminSubentryList             OBJECT IDENTIFIER ::= {id-oa 21}
var Id_oa_pwdAdminSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 21}

// # ASN.1 Definition:
//
//	id-oa-allAttributeTypes                OBJECT IDENTIFIER ::= {id-oa 48}
var Id_oa_allAttributeTypes asn1.ObjectIdentifier = []int{2, 5, 18, 48}

// # ASN.1 Definition:
//
//	id-sc-subentry                         OBJECT IDENTIFIER ::= {id-sc 0}
var Id_sc_subentry asn1.ObjectIdentifier = []int{2, 5, 17, 0}

// # ASN.1 Definition:
//
//	id-sc-accessControlSubentry            OBJECT IDENTIFIER ::= {id-sc 1}
var Id_sc_accessControlSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 1}

// # ASN.1 Definition:
//
//	id-sc-collectiveAttributeSubentry      OBJECT IDENTIFIER ::= {id-sc 2}
var Id_sc_collectiveAttributeSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 2}

// # ASN.1 Definition:
//
//	id-sc-contextAssertionSubentry         OBJECT IDENTIFIER ::= {id-sc 3}
var Id_sc_contextAssertionSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 3}

// # ASN.1 Definition:
//
//	id-sc-serviceAdminSubentry             OBJECT IDENTIFIER ::= {id-sc 4}
var Id_sc_serviceAdminSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 4}

// # ASN.1 Definition:
//
//	id-sc-pwdAdminSubentry                 OBJECT IDENTIFIER ::= {id-sc 5}
var Id_sc_pwdAdminSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 5}

// # ASN.1 Definition:
//
//	id-nf-subentryNameForm                 OBJECT IDENTIFIER ::= {id-nf 16}
var Id_nf_subentryNameForm asn1.ObjectIdentifier = []int{2, 5, 15, 16}

// # ASN.1 Definition:
//
//	id-ar-autonomousArea                   OBJECT IDENTIFIER ::= {id-ar 1}
var Id_ar_autonomousArea asn1.ObjectIdentifier = []int{2, 5, 23, 1}

// # ASN.1 Definition:
//
//	id-ar-accessControlSpecificArea        OBJECT IDENTIFIER ::= {id-ar 2}
var Id_ar_accessControlSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 2}

// # ASN.1 Definition:
//
//	id-ar-accessControlInnerArea           OBJECT IDENTIFIER ::= {id-ar 3}
var Id_ar_accessControlInnerArea asn1.ObjectIdentifier = []int{2, 5, 23, 3}

// # ASN.1 Definition:
//
//	id-ar-subschemaAdminSpecificArea       OBJECT IDENTIFIER ::= {id-ar 4}
var Id_ar_subschemaAdminSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 4}

// # ASN.1 Definition:
//
//	id-ar-collectiveAttributeSpecificArea  OBJECT IDENTIFIER ::= {id-ar 5}
var Id_ar_collectiveAttributeSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 5}

// # ASN.1 Definition:
//
//	id-ar-collectiveAttributeInnerArea     OBJECT IDENTIFIER ::= {id-ar 6}
var Id_ar_collectiveAttributeInnerArea asn1.ObjectIdentifier = []int{2, 5, 23, 6}

// # ASN.1 Definition:
//
//	id-ar-contextDefaultSpecificArea       OBJECT IDENTIFIER ::= {id-ar 7}
var Id_ar_contextDefaultSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 7}

// # ASN.1 Definition:
//
//	id-ar-serviceSpecificArea              OBJECT IDENTIFIER ::= {id-ar 8}
var Id_ar_serviceSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 8}

// # ASN.1 Definition:
//
//	id-ar-pwdAdminSpecificArea             OBJECT IDENTIFIER ::= {id-ar 9}
var Id_ar_pwdAdminSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 9}

// # ASN.1 Definition:
//
//	Attribute-valuesWithContext-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type Attribute_valuesWithContext_Item struct {
	Value       asn1.RawValue
	ContextList [](Context) `asn1:"set"`
}

// # ASN.1 Definition:
//
//	AttributeValueAssertion-assertedContexts ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type AttributeValueAssertion_assertedContexts = asn1.RawValue
