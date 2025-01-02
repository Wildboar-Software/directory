package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	OPTIONALLY-PROTECTED{Type} ::= CHOICE {
//	  unsigned       Type,
//	  signed         SIGNED{Type} }
type OPTIONALLY_PROTECTED = asn1.RawValue

// # ASN.1 Definition:
//
//	OPTIONALLY-PROTECTED-SEQ{Type} ::= CHOICE {
//	  unsigned       Type,
//	  signed    [0]  SIGNED{Type} }
type OPTIONALLY_PROTECTED_SEQ = asn1.RawValue

// # ASN.1 Definition:
//
//	SignedSecurityLabel ::= SIGNED{SignedSecurityLabelContent}
type SignedSecurityLabel = SIGNED

// # ASN.1 Definition:
//
//	SignedSecurityLabelContent ::= SEQUENCE {
//	  attHash        HASH{AttributeTypeAndValue},
//	  issuer         Name OPTIONAL, -- name of labelling authority
//	  keyIdentifier  KeyIdentifier OPTIONAL,
//	  securityLabel  SecurityLabel,
//	  ... }
type SignedSecurityLabelContent struct {
	AttHash       HASH
	Issuer        Name          `asn1:"optional"`
	KeyIdentifier KeyIdentifier `asn1:"optional"`
	SecurityLabel SecurityLabel
}

// # ASN.1 Definition:
//
//	SecurityLabel ::= SET {
//	  security-policy-identifier  SecurityPolicyIdentifier OPTIONAL,
//	  security-classification     SecurityClassification OPTIONAL,
//	  privacy-mark                PrivacyMark OPTIONAL,
//	  security-categories         SecurityCategories OPTIONAL,
//	  ... }
//	   (ALL EXCEPT ({ -- none, at least one component shall be present --}))
type SecurityLabel struct {
	Security_policy_identifier SecurityPolicyIdentifier `asn1:"optional"`
	Security_classification    SecurityClassification   `asn1:"optional"`
	Privacy_mark               PrivacyMark              `asn1:"optional"`
	Security_categories        SecurityCategories       `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	SecurityPolicyIdentifier ::= OBJECT IDENTIFIER
type SecurityPolicyIdentifier = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	SecurityClassification ::= INTEGER {
//	  unmarked      (0),
//	  unclassified  (1),
//	  restricted    (2),
//	  confidential  (3),
//	  secret        (4),
//	  top-secret    (5)}
type SecurityClassification = int64

const SecurityClassification_Unmarked SecurityClassification = 0

const SecurityClassification_Unclassified SecurityClassification = 1

const SecurityClassification_Restricted SecurityClassification = 2

const SecurityClassification_Confidential SecurityClassification = 3

const SecurityClassification_Secret SecurityClassification = 4

const SecurityClassification_Top_secret SecurityClassification = 5

// # ASN.1 Definition:
//
//	PrivacyMark ::= PrintableString(SIZE (1..MAX))
type PrivacyMark = string

// # ASN.1 Definition:
//
//	SecurityCategories ::= SET SIZE (1..MAX) OF SecurityCategory
type SecurityCategories = [](SecurityCategory)

// # ASN.1 Definition:
//
//	Clearance ::= SEQUENCE {
//	  policyId            OBJECT IDENTIFIER,
//	  classList           ClassList DEFAULT {unclassified},
//	  securityCategories  SET SIZE (1..MAX) OF SecurityCategory OPTIONAL,
//	  ... }
type Clearance struct {
	PolicyId           asn1.ObjectIdentifier
	ClassList          ClassList            `asn1:"optional"`
	SecurityCategories [](SecurityCategory) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	ClassList ::= BIT STRING {
//	  unmarked      (0),
//	  unclassified  (1),
//	  restricted    (2),
//	  confidential  (3),
//	  secret        (4),
//	  topSecret     (5)}
type ClassList = asn1.BitString

const ClassList_Unmarked int32 = 0

const ClassList_Unclassified int32 = 1

const ClassList_Restricted int32 = 2

const ClassList_Confidential int32 = 3

const ClassList_Secret int32 = 4

const ClassList_TopSecret int32 = 5

// # ASN.1 Definition:
//
//	SecurityCategory ::= SEQUENCE {
//	  type   [0]  SECURITY-CATEGORY.&id({SecurityCategoriesTable}),
//	  value  [1]  EXPLICIT SECURITY-CATEGORY.&Type({SecurityCategoriesTable}{@type}),
//	  ... }
type SecurityCategory struct {
	Type  asn1.ObjectIdentifier `asn1:"tag:0"`
	Value asn1.RawValue         `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	AttributeIntegrityInfo ::= SIGNED{AttributeIntegrityInfoContent}
type AttributeIntegrityInfo = SIGNED

// # ASN.1 Definition:
//
//	AttributeIntegrityInfoContent ::= SEQUENCE {
//	  scope        Scope,           -- Identifies the attributes protected
//	  signer       Signer OPTIONAL, -- Authority or data originators name
//	  attribsHash  AttribsHash,     -- Hash value of protected attributes
//	  ... }
type AttributeIntegrityInfoContent struct {
	Scope       Scope
	Signer      Signer `asn1:"optional"`
	AttribsHash AttribsHash
}

// # ASN.1 Definition:
//
//	Signer ::= CHOICE {
//	  thisEntry   [0]  EXPLICIT ThisEntry,
//	  thirdParty  [1]  SpecificallyIdentified,
//	  ... }
type Signer = asn1.RawValue

// # ASN.1 Definition:
//
//	ThisEntry ::= CHOICE {
//	  onlyOne   NULL,
//	  specific  IssuerAndSerialNumber,
//	  ... }
type ThisEntry = asn1.RawValue

// # ASN.1 Definition:
//
//	IssuerAndSerialNumber ::= SEQUENCE {
//	  issuer  Name,
//	  serial  CertificateSerialNumber,
//	  ... }
type IssuerAndSerialNumber struct {
	Issuer Name
	Serial CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	SpecificallyIdentified ::= SEQUENCE {
//	  name    GeneralName,
//	  issuer  GeneralName OPTIONAL,
//	  serial  CertificateSerialNumber OPTIONAL }
//	  (WITH COMPONENTS { ..., issuer PRESENT, serial PRESENT } |
//	  (WITH COMPONENTS { ..., issuer ABSENT, serial ABSENT }))
type SpecificallyIdentified struct {
	Name   GeneralName
	Issuer GeneralName             `asn1:"optional"`
	Serial CertificateSerialNumber `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Scope ::= CHOICE {
//	  wholeEntry     [0]  NULL, -- Signature protects all attribute values in this entry
//	  selectedTypes  [1]  SelectedTypes,
//	      -- Signature protects all attribute values of the selected attribute types
//	  ... }
type Scope = asn1.RawValue

// # ASN.1 Definition:
//
//	SelectedTypes ::= SEQUENCE SIZE (1..MAX) OF AttributeType
type SelectedTypes = [](AttributeType)

// # ASN.1 Definition:
//
//	AttribsHash ::= HASH{HashedAttributes}
type AttribsHash = HASH

// # ASN.1 Definition:
//
//	HashedAttributes ::= SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
type HashedAttributes = [](Attribute)

// # ASN.1 Definition:
//
//	AttributeValueIntegrityInfo ::= SIGNED{AttributeValueIntegrityInfoContent}
type AttributeValueIntegrityInfo = SIGNED

// # ASN.1 Definition:
//
//	AttributeValueIntegrityInfoContent ::= SEQUENCE {
//	  signer   Signer OPTIONAL, -- Authority or data originators name
//	  aVIHash  AVIHash,         -- Hash value of protected attribute
//	  ... }
type AttributeValueIntegrityInfoContent struct {
	Signer  Signer `asn1:"optional"`
	AVIHash AVIHash
}

// # ASN.1 Definition:
//
//	AVIHash ::= HASH{AttributeTypeValueContexts}
type AVIHash = HASH

// # ASN.1 Definition:
//
//	AttributeTypeValueContexts ::= SEQUENCE {
//	  type         ATTRIBUTE.&id({SupportedAttributes}),
//	  value        ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//	  contextList  SET SIZE (1..MAX) OF Context OPTIONAL,
//	  ... }
type AttributeTypeValueContexts struct {
	Type        asn1.ObjectIdentifier
	Value       asn1.RawValue
	ContextList [](Context) `asn1:"optional,set"`
}

// # ASN.1 Definition:
//
//	id-oc-integrityInfo OBJECT IDENTIFIER ::= {id-oc 40}
var Id_oc_integrityInfo asn1.ObjectIdentifier = []int{2, 5, 6, 40}

// # ASN.1 Definition:
//
//	id-at-clearance                           OBJECT IDENTIFIER ::= {id-at 55}
var Id_at_clearance asn1.ObjectIdentifier = []int{2, 5, 4, 55}

// # ASN.1 Definition:
//
//	id-at-attributeIntegrityInfo              OBJECT IDENTIFIER ::= {id-at 57}
var Id_at_attributeIntegrityInfo asn1.ObjectIdentifier = []int{2, 5, 4, 57}

// # ASN.1 Definition:
//
//	id-avc-attributeValueSecurityLabelContext OBJECT IDENTIFIER ::= {id-avc 3}
var Id_avc_attributeValueSecurityLabelContext asn1.ObjectIdentifier = []int{2, 5, 31, 3}

// # ASN.1 Definition:
//
//	id-avc-attributeValueIntegrityInfoContext OBJECT IDENTIFIER ::= {id-avc 4}
var Id_avc_attributeValueIntegrityInfoContext asn1.ObjectIdentifier = []int{2, 5, 31, 4}
