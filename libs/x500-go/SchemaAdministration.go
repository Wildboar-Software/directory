package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION DITStructureRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// DITStructureRuleDescription ::= SEQUENCE {
//   COMPONENTS OF DITStructureRule,
//   name         [1]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type DITStructureRuleDescription struct {
	RuleIdentifier         RuleIdentifier
	NameForm               asn1.ObjectIdentifier
	SuperiorStructureRules [](RuleIdentifier)           `asn1:"optional,set"`
	Name                   [](UnboundedDirectoryString) `asn1:"optional,explicit,tag:1,set"`
	Description            UnboundedDirectoryString     `asn1:"optional"`
	Obsolete               bool                         `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION DITStructureRuleDescription */ /* START_OF_SYMBOL_DEFINITION DITContentRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// DITContentRuleDescription ::= SEQUENCE {
//   COMPONENTS OF DITContentRule,
//   name         [4]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   ... }
// ```
//
//
type DITContentRuleDescription struct {
	StructuralObjectClass asn1.ObjectIdentifier
	Auxiliaries           [](asn1.ObjectIdentifier)    `asn1:"optional,set"`
	Mandatory             [](asn1.ObjectIdentifier)    `asn1:"optional,explicit,tag:1,set"`
	Optional              [](asn1.ObjectIdentifier)    `asn1:"optional,explicit,tag:2,set"`
	Precluded             [](asn1.ObjectIdentifier)    `asn1:"optional,explicit,tag:3,set"`
	Name                  [](UnboundedDirectoryString) `asn1:"optional,explicit,tag:4,set"`
	Description           UnboundedDirectoryString     `asn1:"optional"`
	Obsolete              bool                         `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION DITContentRuleDescription */ /* START_OF_SYMBOL_DEFINITION MatchingRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// MatchingRuleDescription ::= SEQUENCE {
//   identifier        MATCHING-RULE.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   information  [0]  UnboundedDirectoryString OPTIONAL,
//                 -- describes the ASN.1 syntax
//   ... }
// ```
//
//
type MatchingRuleDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information UnboundedDirectoryString     `asn1:"optional,explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION MatchingRuleDescription */ /* START_OF_SYMBOL_DEFINITION AttributeTypeDescription */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeTypeDescription ::= SEQUENCE {
//   identifier        ATTRIBUTE.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   information  [0]  AttributeTypeInformation,
//   ... }
// ```
//
//
type AttributeTypeDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information AttributeTypeInformation     `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION AttributeTypeDescription */ /* START_OF_SYMBOL_DEFINITION AttributeTypeInformation */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeTypeInformation ::= SEQUENCE {
//   derivation       [0]  ATTRIBUTE.&id             OPTIONAL,
//   equalityMatch    [1]  MATCHING-RULE.&id         OPTIONAL,
//   orderingMatch    [2]  MATCHING-RULE.&id         OPTIONAL,
//   substringsMatch  [3]  MATCHING-RULE.&id         OPTIONAL,
//   attributeSyntax  [4]  UnboundedDirectoryString  OPTIONAL,
//   multi-valued     [5]  BOOLEAN                   DEFAULT TRUE,
//   collective       [6]  BOOLEAN                   DEFAULT FALSE,
//   userModifiable   [7]  BOOLEAN                   DEFAULT TRUE,
//   application           AttributeUsage            DEFAULT userApplications,
//   ... }
// ```
//
//
type AttributeTypeInformation struct {
	Derivation      asn1.ObjectIdentifier    `asn1:"optional,explicit,tag:0"`
	EqualityMatch   asn1.ObjectIdentifier    `asn1:"optional,explicit,tag:1"`
	OrderingMatch   asn1.ObjectIdentifier    `asn1:"optional,explicit,tag:2"`
	SubstringsMatch asn1.ObjectIdentifier    `asn1:"optional,explicit,tag:3"`
	AttributeSyntax UnboundedDirectoryString `asn1:"optional,explicit,tag:4"`
	Multi_valued    bool                     `asn1:"optional,explicit,tag:5"`
	Collective      bool                     `asn1:"optional,explicit,tag:6"`
	UserModifiable  bool                     `asn1:"optional,explicit,tag:7"`
	Application     AttributeUsage           `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AttributeTypeInformation */ /* START_OF_SYMBOL_DEFINITION ObjectClassDescription */
// ### ASN.1 Definition:
//
// ```asn1
// ObjectClassDescription ::= SEQUENCE {
//   identifier        OBJECT-CLASS.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString                      OPTIONAL,
//   obsolete          BOOLEAN                                       DEFAULT FALSE,
//   information  [0]  ObjectClassInformation,
//   ... }
// ```
//
//
type ObjectClassDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information ObjectClassInformation       `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION ObjectClassDescription */ /* START_OF_SYMBOL_DEFINITION ObjectClassInformation */
// ### ASN.1 Definition:
//
// ```asn1
// ObjectClassInformation ::= SEQUENCE {
//   subclassOf        SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//   kind              ObjectClassKind                       DEFAULT structural,
//   mandatories  [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//   optionals    [4]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//   ... }
// ```
//
//
type ObjectClassInformation struct {
	SubclassOf  [](asn1.ObjectIdentifier) `asn1:"optional,set"`
	Kind        ObjectClassKind           `asn1:"optional"`
	Mandatories [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:3,set"`
	Optionals   [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:4,set"`
}

/* END_OF_SYMBOL_DEFINITION ObjectClassInformation */ /* START_OF_SYMBOL_DEFINITION NameFormDescription */
// ### ASN.1 Definition:
//
// ```asn1
// NameFormDescription ::= SEQUENCE {
//   identifier        NAME-FORM.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString                      OPTIONAL,
//   obsolete          BOOLEAN                                       DEFAULT FALSE,
//   information  [0]  NameFormInformation,
//   ... }
// ```
//
//
type NameFormDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information NameFormInformation          `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION NameFormDescription */ /* START_OF_SYMBOL_DEFINITION NameFormInformation */
// ### ASN.1 Definition:
//
// ```asn1
// NameFormInformation ::= SEQUENCE {
//   subordinate        OBJECT-CLASS.&id,
//   namingMandatories  SET OF ATTRIBUTE.&id,
//   namingOptionals    SET SIZE (1..MAX) OF ATTRIBUTE.&id OPTIONAL,
//   ... }
// ```
//
//
type NameFormInformation struct {
	Subordinate       asn1.ObjectIdentifier
	NamingMandatories [](asn1.ObjectIdentifier) `asn1:"set"`
	NamingOptionals   [](asn1.ObjectIdentifier) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION NameFormInformation */ /* START_OF_SYMBOL_DEFINITION MatchingRuleUseDescription */
// ### ASN.1 Definition:
//
// ```asn1
// MatchingRuleUseDescription ::= SEQUENCE {
//   identifier        MATCHING-RULE.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString                      OPTIONAL,
//   obsolete          BOOLEAN                                       DEFAULT FALSE,
//   information  [0]  SET OF ATTRIBUTE.&id,
//   ... }
// ```
//
//
type MatchingRuleUseDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information [](asn1.ObjectIdentifier)    `asn1:"explicit,tag:0,set"`
}

/* END_OF_SYMBOL_DEFINITION MatchingRuleUseDescription */ /* START_OF_SYMBOL_DEFINITION ContextDescription */
// ### ASN.1 Definition:
//
// ```asn1
// ContextDescription ::= SEQUENCE {
//   identifier        CONTEXT.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString                      OPTIONAL,
//   obsolete          BOOLEAN                                       DEFAULT FALSE,
//   information  [0]  ContextInformation,
//   ... }
// ```
//
//
type ContextDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information ContextInformation           `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION ContextDescription */ /* START_OF_SYMBOL_DEFINITION ContextInformation */
// ### ASN.1 Definition:
//
// ```asn1
// ContextInformation ::= SEQUENCE {
//   syntax           UnboundedDirectoryString,
//   assertionSyntax  UnboundedDirectoryString OPTIONAL,
//   ... }
// ```
//
//
type ContextInformation struct {
	Syntax          UnboundedDirectoryString
	AssertionSyntax UnboundedDirectoryString `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION ContextInformation */ /* START_OF_SYMBOL_DEFINITION DITContextUseDescription */
// ### ASN.1 Definition:
//
// ```asn1
// DITContextUseDescription ::= SEQUENCE {
//   identifier        ATTRIBUTE.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   information  [0]  DITContextUseInformation,
//   ... }
// ```
//
//
type DITContextUseDescription struct {
	Identifier  asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Information DITContextUseInformation     `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION DITContextUseDescription */ /* START_OF_SYMBOL_DEFINITION DITContextUseInformation */
// ### ASN.1 Definition:
//
// ```asn1
// DITContextUseInformation ::= SEQUENCE {
//   mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//   optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//   ... }
// ```
//
//
type DITContextUseInformation struct {
	MandatoryContexts [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:1,set"`
	OptionalContexts  [](asn1.ObjectIdentifier) `asn1:"optional,explicit,tag:2,set"`
}

/* END_OF_SYMBOL_DEFINITION DITContextUseInformation */ /* START_OF_SYMBOL_DEFINITION FriendsDescription */
// ### ASN.1 Definition:
//
// ```asn1
// FriendsDescription ::= SEQUENCE {
//   anchor            ATTRIBUTE.&id,
//   name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//   description       UnboundedDirectoryString OPTIONAL,
//   obsolete          BOOLEAN DEFAULT FALSE,
//   friends      [0]  SET SIZE (1..MAX) OF ATTRIBUTE.&id,
//   ... }
// ```
//
//
type FriendsDescription struct {
	Anchor      asn1.ObjectIdentifier
	Name        [](UnboundedDirectoryString) `asn1:"optional,set"`
	Description UnboundedDirectoryString     `asn1:"optional"`
	Obsolete    bool                         `asn1:"optional"`
	Friends     [](asn1.ObjectIdentifier)    `asn1:"explicit,tag:0,set"`
}

/* END_OF_SYMBOL_DEFINITION FriendsDescription */ /* START_OF_SYMBOL_DEFINITION Id_soc_subschema */
// ### ASN.1 Definition:
//
// ```asn1
// id-soc-subschema OBJECT IDENTIFIER ::= {id-soc 1}
// ```
//
//
var Id_soc_subschema asn1.ObjectIdentifier = []int{2, 5, 20, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soc_subschema */ /* START_OF_SYMBOL_DEFINITION Id_soa_dITStructureRule */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-dITStructureRule       OBJECT IDENTIFIER ::= {id-soa 1}
// ```
//
//
var Id_soa_dITStructureRule asn1.ObjectIdentifier = []int{2, 5, 21, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_dITStructureRule */ /* START_OF_SYMBOL_DEFINITION Id_soa_dITContentRules */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-dITContentRules        OBJECT IDENTIFIER ::= {id-soa 2}
// ```
//
//
var Id_soa_dITContentRules asn1.ObjectIdentifier = []int{2, 5, 21, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_dITContentRules */ /* START_OF_SYMBOL_DEFINITION Id_soa_matchingRules */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-matchingRules          OBJECT IDENTIFIER ::= {id-soa 4}
// ```
//
//
var Id_soa_matchingRules asn1.ObjectIdentifier = []int{2, 5, 21, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_matchingRules */ /* START_OF_SYMBOL_DEFINITION Id_soa_attributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-attributeTypes         OBJECT IDENTIFIER ::= {id-soa 5}
// ```
//
//
var Id_soa_attributeTypes asn1.ObjectIdentifier = []int{2, 5, 21, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_attributeTypes */ /* START_OF_SYMBOL_DEFINITION Id_soa_objectClasses */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-objectClasses          OBJECT IDENTIFIER ::= {id-soa 6}
// ```
//
//
var Id_soa_objectClasses asn1.ObjectIdentifier = []int{2, 5, 21, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_objectClasses */ /* START_OF_SYMBOL_DEFINITION Id_soa_nameForms */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-nameForms              OBJECT IDENTIFIER ::= {id-soa 7}
// ```
//
//
var Id_soa_nameForms asn1.ObjectIdentifier = []int{2, 5, 21, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_nameForms */ /* START_OF_SYMBOL_DEFINITION Id_soa_matchingRuleUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-matchingRuleUse        OBJECT IDENTIFIER ::= {id-soa 8}
// ```
//
//
var Id_soa_matchingRuleUse asn1.ObjectIdentifier = []int{2, 5, 21, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_matchingRuleUse */ /* START_OF_SYMBOL_DEFINITION Id_soa_structuralObjectClass */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-structuralObjectClass  OBJECT IDENTIFIER ::= {id-soa 9}
// ```
//
//
var Id_soa_structuralObjectClass asn1.ObjectIdentifier = []int{2, 5, 21, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_structuralObjectClass */ /* START_OF_SYMBOL_DEFINITION Id_soa_governingStructureRule */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-governingStructureRule OBJECT IDENTIFIER ::= {id-soa 10}
// ```
//
//
var Id_soa_governingStructureRule asn1.ObjectIdentifier = []int{2, 5, 21, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_governingStructureRule */ /* START_OF_SYMBOL_DEFINITION Id_soa_contextTypes */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-contextTypes           OBJECT IDENTIFIER ::= {id-soa 11}
// ```
//
//
var Id_soa_contextTypes asn1.ObjectIdentifier = []int{2, 5, 21, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_contextTypes */ /* START_OF_SYMBOL_DEFINITION Id_soa_dITContextUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-dITContextUse          OBJECT IDENTIFIER ::= {id-soa 12}
// ```
//
//
var Id_soa_dITContextUse asn1.ObjectIdentifier = []int{2, 5, 21, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_dITContextUse */ /* START_OF_SYMBOL_DEFINITION Id_soa_friends */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-friends                OBJECT IDENTIFIER ::= {id-soa 13}
// ```
//
//
var Id_soa_friends asn1.ObjectIdentifier = []int{2, 5, 21, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_friends */
