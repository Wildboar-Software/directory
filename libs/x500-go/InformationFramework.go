package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION Attribute */
// ### ASN.1 Definition:
//
// ```asn1
// Attribute {ATTRIBUTE:SupportedAttributes} ::= SEQUENCE {
//   type                ATTRIBUTE.&id({SupportedAttributes}),
//   values              SET SIZE (0..MAX) OF ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//   valuesWithContext   SET SIZE (1..MAX) OF SEQUENCE {
//     value               ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//     contextList         SET SIZE (1..MAX) OF Context,
//     ...} OPTIONAL,
//   ... }
// ```
//
//
type Attribute struct {
	Type              asn1.ObjectIdentifier
	Values            [](asn1.RawValue)                    `asn1:"set"`
	ValuesWithContext [](Attribute_valuesWithContext_Item) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION Attribute */ /* START_OF_SYMBOL_DEFINITION AttributeType */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeType  ::=  ATTRIBUTE.&id
// ```
type AttributeType = asn1.ObjectIdentifier // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION AttributeType */ /* START_OF_SYMBOL_DEFINITION AttributeValue */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeValue  ::=  ATTRIBUTE.&Type
// ```
type AttributeValue = asn1.RawValue // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION AttributeValue */ /* START_OF_SYMBOL_DEFINITION Context */
// ### ASN.1 Definition:
//
// ```asn1
// Context ::= SEQUENCE {
//   contextType    CONTEXT.&id({SupportedContexts}),
//   contextValues
//     SET SIZE (1..MAX) OF CONTEXT.&Type({SupportedContexts}{@contextType}),
//   fallback       BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type Context struct {
	ContextType   asn1.ObjectIdentifier
	ContextValues [](asn1.RawValue) `asn1:"set"`
	Fallback      bool              `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION Context */ /* START_OF_SYMBOL_DEFINITION AttributeValueAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeValueAssertion ::= SEQUENCE {
//   type              ATTRIBUTE.&id({SupportedAttributes}),
//   assertion         ATTRIBUTE.&equality-match.&AssertionType
//                       ({SupportedAttributes}{@type}),
//   assertedContexts  CHOICE {
//     allContexts       [0]  NULL,
//     selectedContexts  [1]  SET SIZE (1..MAX) OF ContextAssertion } OPTIONAL,
//   ... }
// ```
//
//
type AttributeValueAssertion struct {
	Type             asn1.ObjectIdentifier
	Assertion        asn1.RawValue
	AssertedContexts AttributeValueAssertion_assertedContexts `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AttributeValueAssertion */ /* START_OF_SYMBOL_DEFINITION ContextAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// ContextAssertion ::= SEQUENCE {
//   contextType    CONTEXT.&id({SupportedContexts}),
//   contextValues  SET SIZE (1..MAX) OF
//       CONTEXT.&Assertion({SupportedContexts}{@contextType}),
//   ... }
// ```
//
//
type ContextAssertion struct {
	ContextType   asn1.ObjectIdentifier
	ContextValues [](asn1.RawValue) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ContextAssertion */ /* START_OF_SYMBOL_DEFINITION AttributeTypeAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeTypeAssertion ::= SEQUENCE {
//   type              ATTRIBUTE.&id({SupportedAttributes}),
//   assertedContexts  SEQUENCE SIZE (1..MAX) OF ContextAssertion OPTIONAL,
//   ... }
// ```
//
//
type AttributeTypeAssertion struct {
	Type             asn1.ObjectIdentifier
	AssertedContexts [](ContextAssertion) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AttributeTypeAssertion */ /* START_OF_SYMBOL_DEFINITION Name */
// ### ASN.1 Definition:
//
// ```asn1
// Name  ::=  CHOICE { -- only one possibility for now -- rdnSequence  RDNSequence }
// ```
type Name = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Name */
/* START_OF_SYMBOL_DEFINITION DistinguishedName */
// ### ASN.1 Definition:
//
// ```asn1
// DistinguishedName  ::=  RDNSequence
// ```
type DistinguishedName = pkix.RDNSequence // DefinedType
/* END_OF_SYMBOL_DEFINITION DistinguishedName */ /* START_OF_SYMBOL_DEFINITION RelativeDistinguishedName */
// ### ASN.1 Definition:
//
// ```asn1
// RelativeDistinguishedName  ::=  SET SIZE (1..MAX) OF AttributeTypeAndValue
// ```
type RelativeDistinguishedName = [](pkix.AttributeTypeAndValue) // SetOfType
/* END_OF_SYMBOL_DEFINITION RelativeDistinguishedName */ /* START_OF_SYMBOL_DEFINITION AttributeTypeAndValue */

// ### ASN.1 Definition:
//
// ```asn1
//
//	SubtreeSpecification ::= SEQUENCE {
//	  base                 [0]  LocalName DEFAULT {},
//	  COMPONENTS OF             ChopSpecification,
//	  specificationFilter  [4]  Refinement OPTIONAL,
//	  ... }
//
// ```
type SubtreeSpecification struct {
	Base                LocalName                                     `asn1:"optional,explicit,tag:0"`
	SpecificExclusions  [](ChopSpecification_specificExclusions_Item) `asn1:"optional,explicit,tag:1,set"`
	Minimum             BaseDistance                                  `asn1:"optional,explicit,tag:2"`
	Maximum             BaseDistance                                  `asn1:"optional,explicit,tag:3"`
	SpecificationFilter Refinement                                    `asn1:"optional,explicit,tag:4"`
}

/* END_OF_SYMBOL_DEFINITION SubtreeSpecification */

/* START_OF_SYMBOL_DEFINITION LocalName */
// ### ASN.1 Definition:
//
// ```asn1
// LocalName  ::=  RDNSequence
// ```
type LocalName = pkix.RDNSequence // DefinedType
/* END_OF_SYMBOL_DEFINITION LocalName */ /* START_OF_SYMBOL_DEFINITION ChopSpecification_specificExclusions_Item */
// ### ASN.1 Definition:
//
// ```asn1
// ChopSpecification-specificExclusions-Item  ::=  CHOICE {
//     chopBefore  [0]  LocalName,
//     chopAfter   [1]  LocalName,
//     ...}
// ```
type ChopSpecification_specificExclusions_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ChopSpecification_specificExclusions_Item */ /* START_OF_SYMBOL_DEFINITION ChopSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// ChopSpecification ::= SEQUENCE {
//   specificExclusions    [1]  SET SIZE (1..MAX) OF ChopSpecification-specificExclusions-Item OPTIONAL,
//   minimum       [2]  BaseDistance DEFAULT 0,
//   maximum       [3]  BaseDistance OPTIONAL,
//   ... }
// ```
//
//
type ChopSpecification struct {
	SpecificExclusions [](ChopSpecification_specificExclusions_Item) `asn1:"optional,explicit,tag:1,set"`
	Minimum            BaseDistance                                  `asn1:"optional,explicit,tag:2"`
	Maximum            BaseDistance                                  `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION ChopSpecification */ /* START_OF_SYMBOL_DEFINITION BaseDistance */
// ### ASN.1 Definition:
//
// ```asn1
// BaseDistance  ::=  INTEGER(0..MAX)
// ```
type BaseDistance = int64

/* END_OF_SYMBOL_DEFINITION BaseDistance */ /* START_OF_SYMBOL_DEFINITION Refinement */
// ### ASN.1 Definition:
//
// ```asn1
// Refinement  ::=  CHOICE {
//   item  [0]  OBJECT-CLASS.&id,
//   and   [1]  SET SIZE (1..MAX) OF Refinement,
//   or    [2]  SET SIZE (1..MAX) OF Refinement,
//   not   [3]  Refinement,
//   ... }
// ```
type Refinement = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Refinement */ /* START_OF_SYMBOL_DEFINITION ObjectClassKind */
// ### ASN.1 Definition:
//
// ```asn1
// ObjectClassKind  ::=  ENUMERATED {
//   abstract   (0),
//   structural (1),
//   auxiliary  (2)}
// ```
type ObjectClassKind = int

const (
	ObjectClassKind_Abstract   ObjectClassKind = 0 // LONG_NAMED_ENUMERATED_VALUE,
	ObjectClassKind_Structural ObjectClassKind = 1 // LONG_NAMED_ENUMERATED_VALUE,
	ObjectClassKind_Auxiliary  ObjectClassKind = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION ObjectClassKind */ /* START_OF_SYMBOL_DEFINITION AttributeUsage */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeUsage  ::=  ENUMERATED {
//   userApplications     (0),
//   directoryOperation   (1),
//   distributedOperation (2),
//   dSAOperation         (3),
//   ... }
// ```
type AttributeUsage = int

const (
	AttributeUsage_UserApplications     AttributeUsage = 0 // LONG_NAMED_ENUMERATED_VALUE,
	AttributeUsage_DirectoryOperation   AttributeUsage = 1 // LONG_NAMED_ENUMERATED_VALUE,
	AttributeUsage_DistributedOperation AttributeUsage = 2 // LONG_NAMED_ENUMERATED_VALUE,
	AttributeUsage_DSAOperation         AttributeUsage = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AttributeUsage */ /* START_OF_SYMBOL_DEFINITION DITStructureRule */
// ### ASN.1 Definition:
//
// ```asn1
// DITStructureRule ::= SEQUENCE {
//   ruleIdentifier          RuleIdentifier,
//                  -- shall be unique within the scope of the subschema
//   nameForm                NAME-FORM.&id,
//   superiorStructureRules  SET SIZE (1..MAX) OF RuleIdentifier OPTIONAL,
//   ... }
// ```
//
//
type DITStructureRule struct {
	RuleIdentifier         RuleIdentifier
	NameForm               asn1.ObjectIdentifier
	SuperiorStructureRules [](RuleIdentifier) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION DITStructureRule */ /* START_OF_SYMBOL_DEFINITION RuleIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// RuleIdentifier  ::=  INTEGER
// ```
type RuleIdentifier = int64

/* END_OF_SYMBOL_DEFINITION RuleIdentifier */ /* START_OF_SYMBOL_DEFINITION DITContentRule */
// ### ASN.1 Definition:
//
// ```asn1
// DITContentRule ::= SEQUENCE {
//   structuralObjectClass       OBJECT-CLASS.&id,
//   auxiliaries                 SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//   mandatory              [1]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//   optional               [2]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//   precluded              [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//   ... }
// ```
//
//
type DITContentRule struct {
	StructuralObjectClass asn1.ObjectIdentifier
	Auxiliaries           [](asn1.ObjectIdentifier) `asn1:"optional,set"`
	Mandatory             [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:1,set"`
	Optional              [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:2,set"`
	Precluded             [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:3,set"`
}

/* END_OF_SYMBOL_DEFINITION DITContentRule */ /* START_OF_SYMBOL_DEFINITION DITContextUse */
// ### ASN.1 Definition:
//
// ```asn1
// DITContextUse ::= SEQUENCE {
//   attributeType           ATTRIBUTE.&id,
//   mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//   optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//   ... }
// ```
//
//
type DITContextUse struct {
	AttributeType     asn1.ObjectIdentifier
	MandatoryContexts [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:1,set"`
	OptionalContexts  [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:2,set"`
}

/* END_OF_SYMBOL_DEFINITION DITContextUse */ /* START_OF_SYMBOL_DEFINITION SearchRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// SearchRuleDescription ::= SEQUENCE {
//   COMPONENTS OF      SearchRule,
//   name         [28]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description  [29]  UnboundedDirectoryString OPTIONAL,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION SearchRuleDescription */ /* START_OF_SYMBOL_DEFINITION PwdHistory */
// ### ASN.1 Definition:
//
// ```asn1
// PwdHistory{ATTRIBUTE:passwordAttribute} ::= SEQUENCE {
//   time       GeneralizedTime,
//   password   passwordAttribute.&Type,
//   ...}
// ```
//
//
type PwdHistory struct {
	Time     time.Time
	Password asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION PwdHistory */ /* START_OF_SYMBOL_DEFINITION HierarchyLevel */
// ### ASN.1 Definition:
//
// ```asn1
// HierarchyLevel  ::=  INTEGER
// ```
type HierarchyLevel = int64

/* END_OF_SYMBOL_DEFINITION HierarchyLevel */ /* START_OF_SYMBOL_DEFINITION HierarchyBelow */
// ### ASN.1 Definition:
//
// ```asn1
// HierarchyBelow  ::=  BOOLEAN
// ```
type HierarchyBelow = bool // BooleanType
/* END_OF_SYMBOL_DEFINITION HierarchyBelow */ /* START_OF_SYMBOL_DEFINITION Id_oc_top */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-top                              OBJECT IDENTIFIER ::= {id-oc 0}
// ```
//
//
var Id_oc_top asn1.ObjectIdentifier = []int{2, 5, 6, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_top */ /* START_OF_SYMBOL_DEFINITION Id_oc_alias */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-alias                            OBJECT IDENTIFIER ::= {id-oc 1}
// ```
//
//
var Id_oc_alias asn1.ObjectIdentifier = []int{2, 5, 6, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_alias */ /* START_OF_SYMBOL_DEFINITION Id_oc_parent */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-parent                           OBJECT IDENTIFIER ::= {id-oc 28}
// ```
//
//
var Id_oc_parent asn1.ObjectIdentifier = []int{2, 5, 6, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_parent */ /* START_OF_SYMBOL_DEFINITION Id_oc_child */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-child                            OBJECT IDENTIFIER ::= {id-oc 29}
// ```
//
//
var Id_oc_child asn1.ObjectIdentifier = []int{2, 5, 6, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_child */ /* START_OF_SYMBOL_DEFINITION Id_at_objectClass */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-objectClass                      OBJECT IDENTIFIER ::= {id-at 0}
// ```
//
//
var Id_at_objectClass asn1.ObjectIdentifier = []int{2, 5, 4, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_objectClass */ /* START_OF_SYMBOL_DEFINITION Id_at_aliasedEntryName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-aliasedEntryName                 OBJECT IDENTIFIER ::= {id-at 1}
// ```
//
//
var Id_at_aliasedEntryName asn1.ObjectIdentifier = []int{2, 5, 4, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_aliasedEntryName */ /* START_OF_SYMBOL_DEFINITION Id_at_pwdAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-pwdAttribute                     OBJECT IDENTIFIER ::= {id-at 84}
// ```
//
//
var Id_at_pwdAttribute asn1.ObjectIdentifier = []int{2, 5, 4, 84} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_pwdAttribute */ /* START_OF_SYMBOL_DEFINITION Id_mr_objectIdentifierMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-objectIdentifierMatch            OBJECT IDENTIFIER ::= {id-mr 0}
// ```
//
//
var Id_mr_objectIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_objectIdentifierMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_distinguishedNameMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-distinguishedNameMatch           OBJECT IDENTIFIER ::= {id-mr 1}
// ```
//
//
var Id_mr_distinguishedNameMatch asn1.ObjectIdentifier = []int{2, 5, 13, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_distinguishedNameMatch */ /* START_OF_SYMBOL_DEFINITION Id_oa_excludeAllCollectiveAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-excludeAllCollectiveAttributes   OBJECT IDENTIFIER ::= {id-oa 0}
// ```
//
//
var Id_oa_excludeAllCollectiveAttributes asn1.ObjectIdentifier = []int{2, 5, 18, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_excludeAllCollectiveAttributes */ /* START_OF_SYMBOL_DEFINITION Id_oa_createTimestamp */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-createTimestamp                  OBJECT IDENTIFIER ::= {id-oa 1}
// ```
//
//
var Id_oa_createTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_createTimestamp */ /* START_OF_SYMBOL_DEFINITION Id_oa_modifyTimestamp */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-modifyTimestamp                  OBJECT IDENTIFIER ::= {id-oa 2}
// ```
//
//
var Id_oa_modifyTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_modifyTimestamp */ /* START_OF_SYMBOL_DEFINITION Id_oa_creatorsName */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-creatorsName                     OBJECT IDENTIFIER ::= {id-oa 3}
// ```
//
//
var Id_oa_creatorsName asn1.ObjectIdentifier = []int{2, 5, 18, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_creatorsName */ /* START_OF_SYMBOL_DEFINITION Id_oa_modifiersName */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-modifiersName                    OBJECT IDENTIFIER ::= {id-oa 4}
// ```
//
//
var Id_oa_modifiersName asn1.ObjectIdentifier = []int{2, 5, 18, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_modifiersName */ /* START_OF_SYMBOL_DEFINITION Id_oa_administrativeRole */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-administrativeRole               OBJECT IDENTIFIER ::= {id-oa 5}
// ```
//
//
var Id_oa_administrativeRole asn1.ObjectIdentifier = []int{2, 5, 18, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_administrativeRole */ /* START_OF_SYMBOL_DEFINITION Id_oa_subtreeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-subtreeSpecification             OBJECT IDENTIFIER ::= {id-oa 6}
// ```
//
//
var Id_oa_subtreeSpecification asn1.ObjectIdentifier = []int{2, 5, 18, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_subtreeSpecification */ /* START_OF_SYMBOL_DEFINITION Id_oa_collectiveExclusions */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-collectiveExclusions             OBJECT IDENTIFIER ::= {id-oa 7}
// ```
//
//
var Id_oa_collectiveExclusions asn1.ObjectIdentifier = []int{2, 5, 18, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_collectiveExclusions */ /* START_OF_SYMBOL_DEFINITION Id_oa_subschemaTimestamp */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-subschemaTimestamp               OBJECT IDENTIFIER ::= {id-oa 8}
// ```
//
//
var Id_oa_subschemaTimestamp asn1.ObjectIdentifier = []int{2, 5, 18, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_subschemaTimestamp */ /* START_OF_SYMBOL_DEFINITION Id_oa_hasSubordinates */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-hasSubordinates                  OBJECT IDENTIFIER ::= {id-oa 9}
// ```
//
//
var Id_oa_hasSubordinates asn1.ObjectIdentifier = []int{2, 5, 18, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_hasSubordinates */ /* START_OF_SYMBOL_DEFINITION Id_oa_subschemaSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-subschemaSubentryList            OBJECT IDENTIFIER ::= {id-oa 10}
// ```
//
//
var Id_oa_subschemaSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_subschemaSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_accessControlSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-accessControlSubentryList        OBJECT IDENTIFIER ::= {id-oa 11}
// ```
//
//
var Id_oa_accessControlSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_accessControlSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_collectiveAttributeSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-collectiveAttributeSubentryList  OBJECT IDENTIFIER ::= {id-oa 12}
// ```
//
//
var Id_oa_collectiveAttributeSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_collectiveAttributeSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_contextDefaultSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-contextDefaultSubentryList       OBJECT IDENTIFIER ::= {id-oa 13}
// ```
//
//
var Id_oa_contextDefaultSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_contextDefaultSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_contextAssertionDefault */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-contextAssertionDefault          OBJECT IDENTIFIER ::= {id-oa 14}
// ```
//
//
var Id_oa_contextAssertionDefault asn1.ObjectIdentifier = []int{2, 5, 18, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_contextAssertionDefault */ /* START_OF_SYMBOL_DEFINITION Id_oa_serviceAdminSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-serviceAdminSubentryList         OBJECT IDENTIFIER ::= {id-oa 15}
// ```
//
//
var Id_oa_serviceAdminSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_serviceAdminSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_searchRules */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-searchRules                      OBJECT IDENTIFIER ::= {id-oa 16}
// ```
//
//
var Id_oa_searchRules asn1.ObjectIdentifier = []int{2, 5, 18, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_searchRules */ /* START_OF_SYMBOL_DEFINITION Id_oa_hierarchyLevel */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-hierarchyLevel                   OBJECT IDENTIFIER ::= {id-oa 17}
// ```
//
//
var Id_oa_hierarchyLevel asn1.ObjectIdentifier = []int{2, 5, 18, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_hierarchyLevel */ /* START_OF_SYMBOL_DEFINITION Id_oa_hierarchyBelow */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-hierarchyBelow                   OBJECT IDENTIFIER ::= {id-oa 18}
// ```
//
//
var Id_oa_hierarchyBelow asn1.ObjectIdentifier = []int{2, 5, 18, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_hierarchyBelow */ /* START_OF_SYMBOL_DEFINITION Id_oa_hierarchyParent */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-hierarchyParent                  OBJECT IDENTIFIER ::= {id-oa 19}
// ```
//
//
var Id_oa_hierarchyParent asn1.ObjectIdentifier = []int{2, 5, 18, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_hierarchyParent */ /* START_OF_SYMBOL_DEFINITION Id_oa_hierarchyTop */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-hierarchyTop                     OBJECT IDENTIFIER ::= {id-oa 20}
// ```
//
//
var Id_oa_hierarchyTop asn1.ObjectIdentifier = []int{2, 5, 18, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_hierarchyTop */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdAdminSubentryList */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdAdminSubentryList             OBJECT IDENTIFIER ::= {id-oa 21}
// ```
//
//
var Id_oa_pwdAdminSubentryList asn1.ObjectIdentifier = []int{2, 5, 18, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdAdminSubentryList */ /* START_OF_SYMBOL_DEFINITION Id_oa_allAttributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-allAttributeTypes                OBJECT IDENTIFIER ::= {id-oa 48}
// ```
//
//
var Id_oa_allAttributeTypes asn1.ObjectIdentifier = []int{2, 5, 18, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_allAttributeTypes */ /* START_OF_SYMBOL_DEFINITION Id_sc_subentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-subentry                         OBJECT IDENTIFIER ::= {id-sc 0}
// ```
//
//
var Id_sc_subentry asn1.ObjectIdentifier = []int{2, 5, 17, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_subentry */ /* START_OF_SYMBOL_DEFINITION Id_sc_accessControlSubentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-accessControlSubentry            OBJECT IDENTIFIER ::= {id-sc 1}
// ```
//
//
var Id_sc_accessControlSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_accessControlSubentry */ /* START_OF_SYMBOL_DEFINITION Id_sc_collectiveAttributeSubentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-collectiveAttributeSubentry      OBJECT IDENTIFIER ::= {id-sc 2}
// ```
//
//
var Id_sc_collectiveAttributeSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_collectiveAttributeSubentry */ /* START_OF_SYMBOL_DEFINITION Id_sc_contextAssertionSubentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-contextAssertionSubentry         OBJECT IDENTIFIER ::= {id-sc 3}
// ```
//
//
var Id_sc_contextAssertionSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_contextAssertionSubentry */ /* START_OF_SYMBOL_DEFINITION Id_sc_serviceAdminSubentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-serviceAdminSubentry             OBJECT IDENTIFIER ::= {id-sc 4}
// ```
//
//
var Id_sc_serviceAdminSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_serviceAdminSubentry */ /* START_OF_SYMBOL_DEFINITION Id_sc_pwdAdminSubentry */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc-pwdAdminSubentry                 OBJECT IDENTIFIER ::= {id-sc 5}
// ```
//
//
var Id_sc_pwdAdminSubentry asn1.ObjectIdentifier = []int{2, 5, 17, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_sc_pwdAdminSubentry */ /* START_OF_SYMBOL_DEFINITION Id_nf_subentryNameForm */
// ### ASN.1 Definition:
//
// ```asn1
// id-nf-subentryNameForm                 OBJECT IDENTIFIER ::= {id-nf 16}
// ```
//
//
var Id_nf_subentryNameForm asn1.ObjectIdentifier = []int{2, 5, 15, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_nf_subentryNameForm */ /* START_OF_SYMBOL_DEFINITION Id_ar_autonomousArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-autonomousArea                   OBJECT IDENTIFIER ::= {id-ar 1}
// ```
//
//
var Id_ar_autonomousArea asn1.ObjectIdentifier = []int{2, 5, 23, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_autonomousArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_accessControlSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-accessControlSpecificArea        OBJECT IDENTIFIER ::= {id-ar 2}
// ```
//
//
var Id_ar_accessControlSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_accessControlSpecificArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_accessControlInnerArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-accessControlInnerArea           OBJECT IDENTIFIER ::= {id-ar 3}
// ```
//
//
var Id_ar_accessControlInnerArea asn1.ObjectIdentifier = []int{2, 5, 23, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_accessControlInnerArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_subschemaAdminSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-subschemaAdminSpecificArea       OBJECT IDENTIFIER ::= {id-ar 4}
// ```
//
//
var Id_ar_subschemaAdminSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_subschemaAdminSpecificArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_collectiveAttributeSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-collectiveAttributeSpecificArea  OBJECT IDENTIFIER ::= {id-ar 5}
// ```
//
//
var Id_ar_collectiveAttributeSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_collectiveAttributeSpecificArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_collectiveAttributeInnerArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-collectiveAttributeInnerArea     OBJECT IDENTIFIER ::= {id-ar 6}
// ```
//
//
var Id_ar_collectiveAttributeInnerArea asn1.ObjectIdentifier = []int{2, 5, 23, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_collectiveAttributeInnerArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_contextDefaultSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-contextDefaultSpecificArea       OBJECT IDENTIFIER ::= {id-ar 7}
// ```
//
//
var Id_ar_contextDefaultSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_contextDefaultSpecificArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_serviceSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-serviceSpecificArea              OBJECT IDENTIFIER ::= {id-ar 8}
// ```
//
//
var Id_ar_serviceSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_serviceSpecificArea */ /* START_OF_SYMBOL_DEFINITION Id_ar_pwdAdminSpecificArea */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar-pwdAdminSpecificArea             OBJECT IDENTIFIER ::= {id-ar 9}
// ```
//
//
var Id_ar_pwdAdminSpecificArea asn1.ObjectIdentifier = []int{2, 5, 23, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ar_pwdAdminSpecificArea */ /* START_OF_SYMBOL_DEFINITION Attribute_valuesWithContext_Item */
// ### ASN.1 Definition:
//
// ```asn1
// Attribute-valuesWithContext-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type Attribute_valuesWithContext_Item struct {
	Value       asn1.RawValue
	ContextList [](Context) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION Attribute_valuesWithContext_Item */ /* START_OF_SYMBOL_DEFINITION AttributeValueAssertion_assertedContexts */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeValueAssertion-assertedContexts ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type AttributeValueAssertion_assertedContexts = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AttributeValueAssertion_assertedContexts */
