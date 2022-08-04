package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION OPTIONALLY_PROTECTED */
// ### ASN.1 Definition:
//
// ```asn1
// OPTIONALLY-PROTECTED{Type}  ::=  CHOICE {
//   unsigned       Type,
//   signed         SIGNED{Type} }
// ```
type OPTIONALLY_PROTECTED = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION OPTIONALLY_PROTECTED */ /* START_OF_SYMBOL_DEFINITION OPTIONALLY_PROTECTED_SEQ */
// ### ASN.1 Definition:
//
// ```asn1
// OPTIONALLY-PROTECTED-SEQ{Type}  ::=  CHOICE {
//   unsigned       Type,
//   signed    [0]  SIGNED{Type} }
// ```
type OPTIONALLY_PROTECTED_SEQ = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION OPTIONALLY_PROTECTED_SEQ */ /* START_OF_SYMBOL_DEFINITION SignedSecurityLabel */
// ### ASN.1 Definition:
//
// ```asn1
// SignedSecurityLabel  ::=  SIGNED{SignedSecurityLabelContent}
// ```
type SignedSecurityLabel = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION SignedSecurityLabel */ /* START_OF_SYMBOL_DEFINITION SignedSecurityLabelContent */
// ### ASN.1 Definition:
//
// ```asn1
// SignedSecurityLabelContent ::= SEQUENCE {
//   attHash        HASH{AttributeTypeAndValue},
//   issuer         Name OPTIONAL, -- name of labelling authority
//   keyIdentifier  KeyIdentifier OPTIONAL,
//   securityLabel  SecurityLabel,
//   ... }
// ```
//
//
type SignedSecurityLabelContent struct {
	AttHash       HASH
	Issuer        Name          `asn1:"optional"`
	KeyIdentifier KeyIdentifier `asn1:"optional"`
	SecurityLabel SecurityLabel
}

/* END_OF_SYMBOL_DEFINITION SignedSecurityLabelContent */ /* START_OF_SYMBOL_DEFINITION SecurityLabel */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityLabel ::= SET {
//   security-policy-identifier  SecurityPolicyIdentifier OPTIONAL,
//   security-classification     SecurityClassification OPTIONAL,
//   privacy-mark                PrivacyMark OPTIONAL,
//   security-categories         SecurityCategories OPTIONAL,
//   ... }
//    (ALL EXCEPT ({ -- none, at least one component shall be present --}))
// ```
//
//
type SecurityLabel struct {
	Security_policy_identifier SecurityPolicyIdentifier `asn1:"optional"`
	Security_classification    SecurityClassification   `asn1:"optional"`
	Privacy_mark               PrivacyMark              `asn1:"optional"`
	Security_categories        SecurityCategories       `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION SecurityLabel */ /* START_OF_SYMBOL_DEFINITION SecurityPolicyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityPolicyIdentifier  ::=  OBJECT IDENTIFIER
// ```
type SecurityPolicyIdentifier = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION SecurityPolicyIdentifier */ /* START_OF_SYMBOL_DEFINITION SecurityClassification */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityClassification  ::=  INTEGER {
//   unmarked      (0),
//   unclassified  (1),
//   restricted    (2),
//   confidential  (3),
//   secret        (4),
//   top-secret    (5)}
// ```
type SecurityClassification = int64

/* END_OF_SYMBOL_DEFINITION SecurityClassification */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Unmarked */
const SecurityClassification_Unmarked SecurityClassification = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Unmarked */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Unclassified */
const SecurityClassification_Unclassified SecurityClassification = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Unclassified */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Restricted */
const SecurityClassification_Restricted SecurityClassification = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Restricted */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Confidential */
const SecurityClassification_Confidential SecurityClassification = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Confidential */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Secret */
const SecurityClassification_Secret SecurityClassification = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Secret */

/* START_OF_SYMBOL_DEFINITION SecurityClassification_Top_secret */
const SecurityClassification_Top_secret SecurityClassification = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION SecurityClassification_Top_secret */ /* START_OF_SYMBOL_DEFINITION PrivacyMark */
// ### ASN.1 Definition:
//
// ```asn1
// PrivacyMark  ::=  PrintableString(SIZE (1..MAX))
// ```
type PrivacyMark = string // PrintableString
/* END_OF_SYMBOL_DEFINITION PrivacyMark */ /* START_OF_SYMBOL_DEFINITION SecurityCategories */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityCategories  ::=  SET SIZE (1..MAX) OF SecurityCategory
// ```
type SecurityCategories = [](SecurityCategory) // SetOfType
/* END_OF_SYMBOL_DEFINITION SecurityCategories */ /* START_OF_SYMBOL_DEFINITION Clearance */
// ### ASN.1 Definition:
//
// ```asn1
// Clearance ::= SEQUENCE {
//   policyId            OBJECT IDENTIFIER,
//   classList           ClassList DEFAULT {unclassified},
//   securityCategories  SET SIZE (1..MAX) OF SecurityCategory OPTIONAL,
//   ... }
// ```
//
//
type Clearance struct {
	PolicyId           asn1.ObjectIdentifier
	ClassList          ClassList            `asn1:"optional"`
	SecurityCategories [](SecurityCategory) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION Clearance */ /* START_OF_SYMBOL_DEFINITION ClassList */
// ### ASN.1 Definition:
//
// ```asn1
// ClassList  ::=  BIT STRING {
//   unmarked      (0),
//   unclassified  (1),
//   restricted    (2),
//   confidential  (3),
//   secret        (4),
//   topSecret     (5)}
// ```
type ClassList = asn1.BitString

/* END_OF_SYMBOL_DEFINITION ClassList */

/* START_OF_SYMBOL_DEFINITION ClassList_Unmarked */
const ClassList_Unmarked int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_Unmarked */

/* START_OF_SYMBOL_DEFINITION ClassList_Unclassified */
const ClassList_Unclassified int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_Unclassified */

/* START_OF_SYMBOL_DEFINITION ClassList_Restricted */
const ClassList_Restricted int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_Restricted */

/* START_OF_SYMBOL_DEFINITION ClassList_Confidential */
const ClassList_Confidential int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_Confidential */

/* START_OF_SYMBOL_DEFINITION ClassList_Secret */
const ClassList_Secret int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_Secret */

/* START_OF_SYMBOL_DEFINITION ClassList_TopSecret */
const ClassList_TopSecret int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ClassList_TopSecret */ /* START_OF_SYMBOL_DEFINITION SecurityCategory */
// ### ASN.1 Definition:
//
// ```asn1
// SecurityCategory ::= SEQUENCE {
//   type   [0]  SECURITY-CATEGORY.&id({SecurityCategoriesTable}),
//   value  [1]  EXPLICIT SECURITY-CATEGORY.&Type({SecurityCategoriesTable}{@type}),
//   ... }
// ```
//
//
type SecurityCategory struct {
	Type  asn1.ObjectIdentifier `asn1:"tag:0"`
	Value asn1.RawValue         `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION SecurityCategory */ /* START_OF_SYMBOL_DEFINITION AttributeIntegrityInfo */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeIntegrityInfo  ::=  SIGNED{AttributeIntegrityInfoContent}
// ```
type AttributeIntegrityInfo = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION AttributeIntegrityInfo */ /* START_OF_SYMBOL_DEFINITION AttributeIntegrityInfoContent */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeIntegrityInfoContent ::= SEQUENCE {
//   scope        Scope,           -- Identifies the attributes protected
//   signer       Signer OPTIONAL, -- Authority or data originators name
//   attribsHash  AttribsHash,     -- Hash value of protected attributes
//   ... }
// ```
//
//
type AttributeIntegrityInfoContent struct {
	Scope       Scope
	Signer      Signer `asn1:"optional"`
	AttribsHash AttribsHash
}

/* END_OF_SYMBOL_DEFINITION AttributeIntegrityInfoContent */ /* START_OF_SYMBOL_DEFINITION Signer */
// ### ASN.1 Definition:
//
// ```asn1
// Signer  ::=  CHOICE {
//   thisEntry   [0]  EXPLICIT ThisEntry,
//   thirdParty  [1]  SpecificallyIdentified,
//   ... }
// ```
type Signer = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Signer */ /* START_OF_SYMBOL_DEFINITION ThisEntry */
// ### ASN.1 Definition:
//
// ```asn1
// ThisEntry  ::=  CHOICE {
//   onlyOne   NULL,
//   specific  IssuerAndSerialNumber,
//   ... }
// ```
type ThisEntry = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ThisEntry */ /* START_OF_SYMBOL_DEFINITION IssuerAndSerialNumber */
// ### ASN.1 Definition:
//
// ```asn1
// IssuerAndSerialNumber ::= SEQUENCE {
//   issuer  Name,
//   serial  CertificateSerialNumber,
//   ... }
// ```
//
//
type IssuerAndSerialNumber struct {
	Issuer Name
	Serial CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION IssuerAndSerialNumber */ /* START_OF_SYMBOL_DEFINITION SpecificallyIdentified */
// ### ASN.1 Definition:
//
// ```asn1
// SpecificallyIdentified ::= SEQUENCE {
//   name    GeneralName,
//   issuer  GeneralName OPTIONAL,
//   serial  CertificateSerialNumber OPTIONAL }
//   (WITH COMPONENTS { ..., issuer PRESENT, serial PRESENT } |
//   (WITH COMPONENTS { ..., issuer ABSENT, serial ABSENT }))
// ```
//
//
type SpecificallyIdentified struct {
	Name   GeneralName
	Issuer GeneralName             `asn1:"optional"`
	Serial CertificateSerialNumber `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION SpecificallyIdentified */ /* START_OF_SYMBOL_DEFINITION Scope */
// ### ASN.1 Definition:
//
// ```asn1
// Scope  ::=  CHOICE {
//   wholeEntry     [0]  NULL, -- Signature protects all attribute values in this entry
//   selectedTypes  [1]  SelectedTypes,
//       -- Signature protects all attribute values of the selected attribute types
//   ... }
// ```
type Scope = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Scope */ /* START_OF_SYMBOL_DEFINITION SelectedTypes */
// ### ASN.1 Definition:
//
// ```asn1
// SelectedTypes  ::=  SEQUENCE SIZE (1..MAX) OF AttributeType
// ```
type SelectedTypes = [](AttributeType) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SelectedTypes */ /* START_OF_SYMBOL_DEFINITION AttribsHash */
// ### ASN.1 Definition:
//
// ```asn1
// AttribsHash  ::=  HASH{HashedAttributes}
// ```
type AttribsHash = HASH // DefinedType
/* END_OF_SYMBOL_DEFINITION AttribsHash */ /* START_OF_SYMBOL_DEFINITION HashedAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// HashedAttributes  ::=  SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
// ```
type HashedAttributes = [](Attribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION HashedAttributes */ /* START_OF_SYMBOL_DEFINITION AttributeValueIntegrityInfo */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeValueIntegrityInfo  ::=  SIGNED{AttributeValueIntegrityInfoContent}
// ```
type AttributeValueIntegrityInfo = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION AttributeValueIntegrityInfo */ /* START_OF_SYMBOL_DEFINITION AttributeValueIntegrityInfoContent */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeValueIntegrityInfoContent ::= SEQUENCE {
//   signer   Signer OPTIONAL, -- Authority or data originators name
//   aVIHash  AVIHash,         -- Hash value of protected attribute
//   ... }
// ```
//
//
type AttributeValueIntegrityInfoContent struct {
	Signer  Signer `asn1:"optional"`
	AVIHash AVIHash
}

/* END_OF_SYMBOL_DEFINITION AttributeValueIntegrityInfoContent */ /* START_OF_SYMBOL_DEFINITION AVIHash */
// ### ASN.1 Definition:
//
// ```asn1
// AVIHash  ::=  HASH{AttributeTypeValueContexts}
// ```
type AVIHash = HASH // DefinedType
/* END_OF_SYMBOL_DEFINITION AVIHash */ /* START_OF_SYMBOL_DEFINITION AttributeTypeValueContexts */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeTypeValueContexts ::= SEQUENCE {
//   type         ATTRIBUTE.&id({SupportedAttributes}),
//   value        ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//   contextList  SET SIZE (1..MAX) OF Context OPTIONAL,
//   ... }
// ```
//
//
type AttributeTypeValueContexts struct {
	Type        asn1.ObjectIdentifier
	Value       asn1.RawValue
	ContextList [](Context) `asn1:"optional,set"`
}

/* END_OF_SYMBOL_DEFINITION AttributeTypeValueContexts */ /* START_OF_SYMBOL_DEFINITION Id_oc_integrityInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-integrityInfo OBJECT IDENTIFIER ::= {id-oc 40}
// ```
//
//
var Id_oc_integrityInfo asn1.ObjectIdentifier = []int{2, 5, 6, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_integrityInfo */ /* START_OF_SYMBOL_DEFINITION Id_at_clearance */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-clearance                           OBJECT IDENTIFIER ::= {id-at 55}
// ```
//
//
var Id_at_clearance asn1.ObjectIdentifier = []int{2, 5, 4, 55} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_clearance */ /* START_OF_SYMBOL_DEFINITION Id_at_attributeIntegrityInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-attributeIntegrityInfo              OBJECT IDENTIFIER ::= {id-at 57}
// ```
//
//
var Id_at_attributeIntegrityInfo asn1.ObjectIdentifier = []int{2, 5, 4, 57} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_attributeIntegrityInfo */ /* START_OF_SYMBOL_DEFINITION Id_avc_attributeValueSecurityLabelContext */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-attributeValueSecurityLabelContext OBJECT IDENTIFIER ::= {id-avc 3}
// ```
//
//
var Id_avc_attributeValueSecurityLabelContext asn1.ObjectIdentifier = []int{2, 5, 31, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_attributeValueSecurityLabelContext */ /* START_OF_SYMBOL_DEFINITION Id_avc_attributeValueIntegrityInfoContext */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-attributeValueIntegrityInfoContext OBJECT IDENTIFIER ::= {id-avc 4}
// ```
//
//
var Id_avc_attributeValueIntegrityInfoContext asn1.ObjectIdentifier = []int{2, 5, 31, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_attributeValueIntegrityInfoContext */
