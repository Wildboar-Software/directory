package x500_go

import (
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION AttributeCertificate */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificate  ::=  SIGNED{TBSAttributeCertificate}
// ```
type AttributeCertificate = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION AttributeCertificate */ /* START_OF_SYMBOL_DEFINITION TBSAttributeCertificate */
// ### ASN.1 Definition:
//
// ```asn1
// TBSAttributeCertificate ::= SEQUENCE {
//   version                 AttCertVersion, -- version is v2
//   holder                  Holder,
//   issuer                  AttCertIssuer,
//   signature               AlgorithmIdentifier{{SupportedAlgorithms}},
//   serialNumber            CertificateSerialNumber,
//   attrCertValidityPeriod  AttCertValidityPeriod,
//   attributes              SEQUENCE OF Attribute{{SupportedAttributes}},
//   issuerUniqueID          UniqueIdentifier OPTIONAL,
//   ...,
//   ...,
//   extensions              Extensions OPTIONAL
//  }  (CONSTRAINED BY { -- shall be DER encoded -- } )
// ```
//
//
type TBSAttributeCertificate struct {
	Version                AttCertVersion
	Holder                 Holder
	Issuer                 AttCertIssuer
	Signature              pkix.AlgorithmIdentifier
	SerialNumber           CertificateSerialNumber
	AttrCertValidityPeriod AttCertValidityPeriod
	Attributes             [](Attribute)
	IssuerUniqueID         UniqueIdentifier `asn1:"optional"`
	Extensions             Extensions       `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TBSAttributeCertificate */ /* START_OF_SYMBOL_DEFINITION AttCertVersion */
// ### ASN.1 Definition:
//
// ```asn1
// AttCertVersion  ::=  INTEGER {v2(1)}
// ```
type AttCertVersion = int64

/* END_OF_SYMBOL_DEFINITION AttCertVersion */

/* START_OF_SYMBOL_DEFINITION AttCertVersion_V2 */
const AttCertVersion_V2 AttCertVersion = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AttCertVersion_V2 */ /* START_OF_SYMBOL_DEFINITION Holder */
// ### ASN.1 Definition:
//
// ```asn1
// Holder ::= SEQUENCE {
//   baseCertificateID  [0]  IssuerSerial OPTIONAL,
//   entityName         [1]  GeneralNames OPTIONAL,
//   objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
//   (WITH COMPONENTS {..., baseCertificateID  PRESENT } |
//    WITH COMPONENTS {..., entityName  PRESENT } |
//    WITH COMPONENTS {..., objectDigestInfo  PRESENT } )
// ```
//
//
type Holder struct {
	BaseCertificateID IssuerSerial     `asn1:"optional,tag:0"`
	EntityName        GeneralNames     `asn1:"optional,tag:1"`
	ObjectDigestInfo  ObjectDigestInfo `asn1:"optional,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION Holder */ /* START_OF_SYMBOL_DEFINITION IssuerSerial */
// ### ASN.1 Definition:
//
// ```asn1
// IssuerSerial ::= SEQUENCE {
//   issuer     GeneralNames,
//   serial     CertificateSerialNumber,
//   issuerUID  UniqueIdentifier OPTIONAL,
//   ... }
// ```
//
//
type IssuerSerial struct {
	Issuer    GeneralNames
	Serial    CertificateSerialNumber
	IssuerUID UniqueIdentifier `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION IssuerSerial */ /* START_OF_SYMBOL_DEFINITION ObjectDigestInfo */
// ### ASN.1 Definition:
//
// ```asn1
// ObjectDigestInfo ::= SEQUENCE {
//   digestedObjectType   ENUMERATED {
//     publicKey        (0),
//     publicKeyCert    (1),
//     otherObjectTypes (2)},
//   otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
//   digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
//   objectDigest        BIT STRING,
//   ... }
// ```
//
//
type ObjectDigestInfo struct {
	DigestedObjectType ObjectDigestInfo_digestedObjectType
	OtherObjectTypeID  asn1.ObjectIdentifier `asn1:"optional"`
	DigestAlgorithm    pkix.AlgorithmIdentifier
	ObjectDigest       asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION ObjectDigestInfo */ /* START_OF_SYMBOL_DEFINITION AttCertIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// AttCertIssuer ::= [0]  SEQUENCE {
//   issuerName              GeneralNames OPTIONAL,
//   baseCertificateID  [0]  IssuerSerial OPTIONAL,
//   objectDigestInfo   [1]  ObjectDigestInfo OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., issuerName  PRESENT } |
//    WITH COMPONENTS {..., baseCertificateID  PRESENT } |
//    WITH COMPONENTS {..., objectDigestInfo  PRESENT } )
// ```
//
//
type AttCertIssuer struct {
	IssuerName        GeneralNames     `asn1:"optional"`
	BaseCertificateID IssuerSerial     `asn1:"optional,tag:0"`
	ObjectDigestInfo  ObjectDigestInfo `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION AttCertIssuer */ /* START_OF_SYMBOL_DEFINITION AttCertValidityPeriod */
// ### ASN.1 Definition:
//
// ```asn1
// AttCertValidityPeriod ::= SEQUENCE {
//   notBeforeTime  GeneralizedTime,
//   notAfterTime   GeneralizedTime,
//   ... }
// ```
//
//
type AttCertValidityPeriod struct {
	NotBeforeTime time.Time
	NotAfterTime  time.Time
}

/* END_OF_SYMBOL_DEFINITION AttCertValidityPeriod */ /* START_OF_SYMBOL_DEFINITION AttributeCertificationPath */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificationPath ::= SEQUENCE {
//   attributeCertificate  AttributeCertificate,
//   acPath                SEQUENCE OF ACPathData OPTIONAL,
//   ... }
// ```
//
//
type AttributeCertificationPath struct {
	AttributeCertificate AttributeCertificate
	AcPath               [](ACPathData) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AttributeCertificationPath */ /* START_OF_SYMBOL_DEFINITION ACPathData */
// ### ASN.1 Definition:
//
// ```asn1
// ACPathData ::= SEQUENCE {
//   certificate           [0]  Certificate OPTIONAL,
//   attributeCertificate  [1]  AttributeCertificate OPTIONAL,
//   ... }
// ```
//
//
type ACPathData struct {
	Certificate          x509.Certificate     `asn1:"optional,tag:0"`
	AttributeCertificate AttributeCertificate `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION ACPathData */ /* START_OF_SYMBOL_DEFINITION PrivilegePolicy */
// ### ASN.1 Definition:
//
// ```asn1
// PrivilegePolicy  ::=  OBJECT IDENTIFIER
// ```
type PrivilegePolicy = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION PrivilegePolicy */ /* START_OF_SYMBOL_DEFINITION RoleSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// RoleSyntax ::= SEQUENCE {
//   roleAuthority  [0]  GeneralNames OPTIONAL,
//   roleName       [1]  GeneralName,
//   ... }
// ```
//
//
type RoleSyntax struct {
	RoleAuthority GeneralNames `asn1:"optional,tag:0"`
	RoleName      GeneralName  `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION RoleSyntax */ /* START_OF_SYMBOL_DEFINITION DualStringSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// DualStringSyntax ::= SEQUENCE {
//   operation  [0]  UnboundedDirectoryString,
//   object     [1]  UnboundedDirectoryString,
//   ... }
// ```
//
//
type DualStringSyntax struct {
	Operation UnboundedDirectoryString `asn1:"tag:0"`
	Object    UnboundedDirectoryString `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION DualStringSyntax */ /* START_OF_SYMBOL_DEFINITION Targets */
// ### ASN.1 Definition:
//
// ```asn1
// Targets  ::=  SEQUENCE SIZE (1..MAX) OF Target
// ```
type Targets = [](Target) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Targets */ /* START_OF_SYMBOL_DEFINITION Target */
// ### ASN.1 Definition:
//
// ```asn1
// Target  ::=  CHOICE {
//   targetName   [0]  GeneralName,
//   targetGroup  [1]  GeneralName,
//   targetCert   [2]  TargetCert,
//   ... }
// ```
type Target = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Target */ /* START_OF_SYMBOL_DEFINITION TargetCert */
// ### ASN.1 Definition:
//
// ```asn1
// TargetCert ::= SEQUENCE {
//   targetCertificate  IssuerSerial,
//   targetName         GeneralName OPTIONAL,
//   certDigestInfo     ObjectDigestInfo OPTIONAL }
// ```
//
//
type TargetCert struct {
	TargetCertificate IssuerSerial
	TargetName        GeneralName      `asn1:"optional"`
	CertDigestInfo    ObjectDigestInfo `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TargetCert */ /* START_OF_SYMBOL_DEFINITION UserNotice */
// ### ASN.1 Definition:
//
// ```asn1
// UserNotice ::= SEQUENCE {
//   noticeRef     NoticeReference OPTIONAL,
//   explicitText  DisplayText OPTIONAL }
// ```
//
//
type UserNotice struct {
	NoticeRef    NoticeReference `asn1:"optional"`
	ExplicitText DisplayText     `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION UserNotice */ /* START_OF_SYMBOL_DEFINITION NoticeReference */
// ### ASN.1 Definition:
//
// ```asn1
// NoticeReference ::= SEQUENCE {
//   organization   DisplayText,
//   noticeNumbers  SEQUENCE OF INTEGER }
// ```
//
//
type NoticeReference struct {
	Organization  DisplayText
	NoticeNumbers [](int)
}

/* END_OF_SYMBOL_DEFINITION NoticeReference */ /* START_OF_SYMBOL_DEFINITION DisplayText */
// ### ASN.1 Definition:
//
// ```asn1
// DisplayText  ::=  CHOICE {
//   visibleString  VisibleString(SIZE (1..200)),
//   bmpString      BMPString(SIZE (1..200)),
//   utf8String     UTF8String(SIZE (1..200)) }
// ```
// type DisplayText = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DisplayText */ /* START_OF_SYMBOL_DEFINITION AcceptablePrivilegePoliciesSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AcceptablePrivilegePoliciesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF PrivilegePolicy
// ```
type AcceptablePrivilegePoliciesSyntax = [](PrivilegePolicy) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AcceptablePrivilegePoliciesSyntax */ /* START_OF_SYMBOL_DEFINITION AttributeDescriptorSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeDescriptorSyntax ::= SEQUENCE {
//   identifier             AttributeIdentifier,
//   attributeSyntax        OCTET STRING(SIZE (1..MAX)),
//   name              [0]  AttributeName OPTIONAL,
//   description       [1]  AttributeDescription OPTIONAL,
//   dominationRule         PrivilegePolicyIdentifier,
//   ... }
// ```
//
//
type AttributeDescriptorSyntax struct {
	Identifier      AttributeIdentifier
	AttributeSyntax []byte
	Name            AttributeName        `asn1:"optional,tag:0"`
	Description     AttributeDescription `asn1:"optional,tag:1"`
	DominationRule  PrivilegePolicyIdentifier
}

/* END_OF_SYMBOL_DEFINITION AttributeDescriptorSyntax */ /* START_OF_SYMBOL_DEFINITION AttributeIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeIdentifier  ::=  ATTRIBUTE.&id({AttributeIDs})
// ```
type AttributeIdentifier = asn1.ObjectIdentifier // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION AttributeIdentifier */ /* START_OF_SYMBOL_DEFINITION AttributeName */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeName  ::=  UTF8String(SIZE (1..MAX))
// ```
type AttributeName = string // UTF8String
/* END_OF_SYMBOL_DEFINITION AttributeName */ /* START_OF_SYMBOL_DEFINITION AttributeDescription */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeDescription  ::=  UTF8String(SIZE (1..MAX))
// ```
type AttributeDescription = string // UTF8String
/* END_OF_SYMBOL_DEFINITION AttributeDescription */ /* START_OF_SYMBOL_DEFINITION PrivilegePolicyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// PrivilegePolicyIdentifier ::= SEQUENCE {
//   privilegePolicy  PrivilegePolicy,
//   privPolSyntax    InfoSyntax,
//   ... }
// ```
//
//
type PrivilegePolicyIdentifier struct {
	PrivilegePolicy PrivilegePolicy
	PrivPolSyntax   InfoSyntax
}

/* END_OF_SYMBOL_DEFINITION PrivilegePolicyIdentifier */ /* START_OF_SYMBOL_DEFINITION RoleSpecCertIdentifierSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// RoleSpecCertIdentifierSyntax  ::=
//   SEQUENCE SIZE (1..MAX) OF RoleSpecCertIdentifier
// ```
type RoleSpecCertIdentifierSyntax = [](RoleSpecCertIdentifier) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION RoleSpecCertIdentifierSyntax */ /* START_OF_SYMBOL_DEFINITION RoleSpecCertIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// RoleSpecCertIdentifier ::= SEQUENCE {
//   roleName              [0]  GeneralName,
//   roleCertIssuer        [1]  GeneralName,
//   roleCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
//   roleCertLocator       [3]  GeneralNames OPTIONAL,
//   ... }
// ```
//
//
type RoleSpecCertIdentifier struct {
	RoleName             GeneralName             `asn1:"tag:0"`
	RoleCertIssuer       GeneralName             `asn1:"tag:1"`
	RoleCertSerialNumber CertificateSerialNumber `asn1:"optional,tag:2"`
	RoleCertLocator      GeneralNames            `asn1:"optional,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION RoleSpecCertIdentifier */ /* START_OF_SYMBOL_DEFINITION BasicAttConstraintsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// BasicAttConstraintsSyntax ::= SEQUENCE {
//   authority          BOOLEAN DEFAULT FALSE,
//   pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
//   ... }
// ```
//
//
type BasicAttConstraintsSyntax struct {
	Authority         bool `asn1:"optional"`
	PathLenConstraint int  `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION BasicAttConstraintsSyntax */ /* START_OF_SYMBOL_DEFINITION AcceptableCertPoliciesSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AcceptableCertPoliciesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF CertPolicyId
// ```
type AcceptableCertPoliciesSyntax = [](CertPolicyId) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AcceptableCertPoliciesSyntax */ /* START_OF_SYMBOL_DEFINITION CertPolicyId */
// ### ASN.1 Definition:
//
// ```asn1
// CertPolicyId  ::=  OBJECT IDENTIFIER
// ```
// type CertPolicyId = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION CertPolicyId */ /* START_OF_SYMBOL_DEFINITION AuthorityAttributeIdentifierSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AuthorityAttributeIdentifierSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AuthAttId
// ```
type AuthorityAttributeIdentifierSyntax = [](AuthAttId) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AuthorityAttributeIdentifierSyntax */ /* START_OF_SYMBOL_DEFINITION AuthAttId */
// ### ASN.1 Definition:
//
// ```asn1
// AuthAttId  ::=  IssuerSerial
// ```
type AuthAttId = IssuerSerial // DefinedType
/* END_OF_SYMBOL_DEFINITION AuthAttId */ /* START_OF_SYMBOL_DEFINITION AllowedAttributeAssignments */
// ### ASN.1 Definition:
//
// ```asn1
// AllowedAttributeAssignments  ::=  SET OF SEQUENCE {
//   attributes              [0]  SET OF CHOICE {
//     attributeType           [0]  AttributeType,
//     attributeTypeandValues  [1]  Attribute{{SupportedAttributes}},
//     ... },
//   holderDomain            [1]  GeneralName,
//   ... }
// ```
type AllowedAttributeAssignments = [](AllowedAttributeAssignments_Item) // SetOfType
/* END_OF_SYMBOL_DEFINITION AllowedAttributeAssignments */ /* START_OF_SYMBOL_DEFINITION AttributeMappings */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeMappings  ::=  SET OF CHOICE {
//   typeMappings      [0]  SEQUENCE {
//     local             [0]  AttributeType,
//     remote            [1]  AttributeType,
//     ... },
//   typeValueMappings [1]  SEQUENCE {
//     local             [0]  AttributeTypeAndValue,
//     remote            [1]  AttributeTypeAndValue,
//     ... } }
// ```
type AttributeMappings = [](AttributeMappings_Item) // SetOfType
/* END_OF_SYMBOL_DEFINITION AttributeMappings */ /* START_OF_SYMBOL_DEFINITION HolderNameConstraintsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// HolderNameConstraintsSyntax ::= SEQUENCE {
//   permittedSubtrees  [0]  GeneralSubtrees,
//   excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
//   ... }
// ```
//
//
type HolderNameConstraintsSyntax struct {
	PermittedSubtrees GeneralSubtrees `asn1:"tag:0"`
	ExcludedSubtrees  GeneralSubtrees `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION HolderNameConstraintsSyntax */ /* START_OF_SYMBOL_DEFINITION GeneralSubtrees */
// ### ASN.1 Definition:
//
// ```asn1
// GeneralSubtrees  ::=  SEQUENCE SIZE (1..MAX) OF GeneralSubtree
// ```
// type GeneralSubtrees = [](GeneralSubtree) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION GeneralSubtrees */ /* START_OF_SYMBOL_DEFINITION GeneralSubtree */
// ### ASN.1 Definition:
//
// ```asn1
// GeneralSubtree ::= SEQUENCE {
//   base          GeneralName,
//   minimum  [0]  BaseDistance DEFAULT 0,
//   maximum  [1]  BaseDistance OPTIONAL,
//   ... }
// ```
//
//
// type GeneralSubtree struct {
// 	Base    GeneralName
// 	Minimum BaseDistance `asn1:"optional,tag:0"`
// 	Maximum BaseDistance `asn1:"optional,tag:1"`
// }

/* END_OF_SYMBOL_DEFINITION GeneralSubtree */ /* START_OF_SYMBOL_DEFINITION BaseDistance */
// ### ASN.1 Definition:
//
// ```asn1
// BaseDistance  ::=  INTEGER(0..MAX)
// ```
// type BaseDistance = int64

/* END_OF_SYMBOL_DEFINITION BaseDistance */ /* START_OF_SYMBOL_DEFINITION AttCertPath */
// ### ASN.1 Definition:
//
// ```asn1
// AttCertPath  ::=  SEQUENCE OF AttributeCertificate
// ```
type AttCertPath = [](AttributeCertificate) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AttCertPath */ /* START_OF_SYMBOL_DEFINITION AttributeCertificateExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificateExactAssertion ::= SEQUENCE {
//   serialNumber  CertificateSerialNumber,
//   issuer        AttCertIssuer,
//   ... }
// ```
//
//
type AttributeCertificateExactAssertion struct {
	SerialNumber CertificateSerialNumber
	Issuer       AttCertIssuer
}

/* END_OF_SYMBOL_DEFINITION AttributeCertificateExactAssertion */ /* START_OF_SYMBOL_DEFINITION AttributeCertificateAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificateAssertion ::= SEQUENCE {
//   holder             [0]  CHOICE {
//     baseCertificateID  [0]  IssuerSerial,
//     holderName         [1]  GeneralNames,
//     ...} OPTIONAL,
//   issuer             [1]  GeneralNames OPTIONAL,
//   attCertValidity    [2]  GeneralizedTime OPTIONAL,
//   attType            [3]  SET OF AttributeType OPTIONAL,
//   ... }
// ```
//
//
type AttributeCertificateAssertion struct {
	Holder          AttributeCertificateAssertion_holder `asn1:"optional,tag:0"`
	Issuer          GeneralNames                         `asn1:"optional,tag:1"`
	AttCertValidity time.Time                            `asn1:"optional,tag:2"`
	AttType         [](AttributeType)                    `asn1:"optional,tag:3,set"`
}

/* END_OF_SYMBOL_DEFINITION AttributeCertificateAssertion */ /* START_OF_SYMBOL_DEFINITION HolderIssuerAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// HolderIssuerAssertion ::= SEQUENCE {
//   holder  [0]  Holder OPTIONAL,
//   issuer  [1]  AttCertIssuer OPTIONAL,
//   ... }
// ```
//
//
type HolderIssuerAssertion struct {
	Holder Holder        `asn1:"optional,tag:0"`
	Issuer AttCertIssuer `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION HolderIssuerAssertion */ /* START_OF_SYMBOL_DEFINITION DelMatchSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// DelMatchSyntax ::= SEQUENCE {
//   firstIssuer  AttCertIssuer,
//   lastHolder   Holder,
//   ... }
// ```
//
//
type DelMatchSyntax struct {
	FirstIssuer AttCertIssuer
	LastHolder  Holder
}

/* END_OF_SYMBOL_DEFINITION DelMatchSyntax */ /* START_OF_SYMBOL_DEFINITION Id_oc_pmiUser */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pmiUser                            OBJECT IDENTIFIER ::= {id-oc 24}
// ```
//
//
var Id_oc_pmiUser asn1.ObjectIdentifier = []int{2, 5, 6, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pmiUser */ /* START_OF_SYMBOL_DEFINITION Id_oc_pmiAA */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pmiAA                              OBJECT IDENTIFIER ::= {id-oc 25}
// ```
//
//
var Id_oc_pmiAA asn1.ObjectIdentifier = []int{2, 5, 6, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pmiAA */ /* START_OF_SYMBOL_DEFINITION Id_oc_pmiSOA */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pmiSOA                             OBJECT IDENTIFIER ::= {id-oc 26}
// ```
//
//
var Id_oc_pmiSOA asn1.ObjectIdentifier = []int{2, 5, 6, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pmiSOA */ /* START_OF_SYMBOL_DEFINITION Id_oc_attCertCRLDistributionPts */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-attCertCRLDistributionPts          OBJECT IDENTIFIER ::= {id-oc 27}
// ```
//
//
var Id_oc_attCertCRLDistributionPts asn1.ObjectIdentifier = []int{2, 5, 6, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_attCertCRLDistributionPts */ /* START_OF_SYMBOL_DEFINITION Id_oc_privilegePolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-privilegePolicy                    OBJECT IDENTIFIER ::= {id-oc 32}
// ```
//
//
var Id_oc_privilegePolicy asn1.ObjectIdentifier = []int{2, 5, 6, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_privilegePolicy */ /* START_OF_SYMBOL_DEFINITION Id_oc_pmiDelegationPath */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pmiDelegationPath                  OBJECT IDENTIFIER ::= {id-oc 33}
// ```
//
//
var Id_oc_pmiDelegationPath asn1.ObjectIdentifier = []int{2, 5, 6, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pmiDelegationPath */ /* START_OF_SYMBOL_DEFINITION Id_oc_protectedPrivilegePolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-protectedPrivilegePolicy           OBJECT IDENTIFIER ::= {id-oc 34}
// ```
//
//
var Id_oc_protectedPrivilegePolicy asn1.ObjectIdentifier = []int{2, 5, 6, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_protectedPrivilegePolicy */ /* START_OF_SYMBOL_DEFINITION Id_at_attributeCertificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-attributeCertificate               OBJECT IDENTIFIER ::= {id-at 58}
// ```
//
//
var Id_at_attributeCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 58} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_attributeCertificate */ /* START_OF_SYMBOL_DEFINITION Id_at_attributeCertificateRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-attributeCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 59}
// ```
//
//
var Id_at_attributeCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 59} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_attributeCertificateRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_aACertificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-aACertificate                      OBJECT IDENTIFIER ::= {id-at 61}
// ```
//
//
var Id_at_aACertificate asn1.ObjectIdentifier = []int{2, 5, 4, 61} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_aACertificate */ /* START_OF_SYMBOL_DEFINITION Id_at_attributeDescriptorCertificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-attributeDescriptorCertificate     OBJECT IDENTIFIER ::= {id-at 62}
// ```
//
//
var Id_at_attributeDescriptorCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 62} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_attributeDescriptorCertificate */ /* START_OF_SYMBOL_DEFINITION Id_at_attributeAuthorityRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-attributeAuthorityRevocationList   OBJECT IDENTIFIER ::= {id-at 63}
// ```
//
//
var Id_at_attributeAuthorityRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 63} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_attributeAuthorityRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_privPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-privPolicy                         OBJECT IDENTIFIER ::= {id-at 71}
// ```
//
//
var Id_at_privPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 71} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_privPolicy */ /* START_OF_SYMBOL_DEFINITION Id_at_role */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-role                               OBJECT IDENTIFIER ::= {id-at 72}
// ```
//
//
var Id_at_role asn1.ObjectIdentifier = []int{2, 5, 4, 72} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_role */ /* START_OF_SYMBOL_DEFINITION Id_at_delegationPath */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-delegationPath                     OBJECT IDENTIFIER ::= {id-at 73}
// ```
//
//
var Id_at_delegationPath asn1.ObjectIdentifier = []int{2, 5, 4, 73} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_delegationPath */ /* START_OF_SYMBOL_DEFINITION Id_at_protPrivPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-protPrivPolicy                     OBJECT IDENTIFIER ::= {id-at 74}
// ```
//
//
var Id_at_protPrivPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 74} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_protPrivPolicy */ /* START_OF_SYMBOL_DEFINITION Id_at_xMLPrivilegeInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-xMLPrivilegeInfo                   OBJECT IDENTIFIER ::= {id-at 75}
// ```
//
//
var Id_at_xMLPrivilegeInfo asn1.ObjectIdentifier = []int{2, 5, 4, 75} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_xMLPrivilegeInfo */ /* START_OF_SYMBOL_DEFINITION Id_at_xmlPrivPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-xmlPrivPolicy                      OBJECT IDENTIFIER ::= {id-at 76}
// ```
//
//
var Id_at_xmlPrivPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 76} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_xmlPrivPolicy */ /* START_OF_SYMBOL_DEFINITION Id_at_permission */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-permission                         OBJECT IDENTIFIER ::= {id-at 82}
// ```
//
//
var Id_at_permission asn1.ObjectIdentifier = []int{2, 5, 4, 82} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_permission */ /* START_OF_SYMBOL_DEFINITION Id_at_eeAttrCertificateRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-eeAttrCertificateRevocationList    OBJECT IDENTIFIER ::= {id-at 102}
// ```
//
//
var Id_at_eeAttrCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 102} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_eeAttrCertificateRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_ce_authorityAttributeIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38}
// ```
//
//
var Id_ce_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_authorityAttributeIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_roleSpecCertIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39}
// ```
//
//
var Id_ce_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_roleSpecCertIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_basicAttConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41}
// ```
//
//
var Id_ce_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_basicAttConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_delegatedNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42}
// ```
//
//
var Id_ce_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_delegatedNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_timeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43}
// ```
//
//
var Id_ce_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_timeSpecification */ /* START_OF_SYMBOL_DEFINITION Id_ce_attributeDescriptor */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48}
// ```
//
//
var Id_ce_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_attributeDescriptor */ /* START_OF_SYMBOL_DEFINITION Id_ce_userNotice */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49}
// ```
//
//
var Id_ce_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_userNotice */ /* START_OF_SYMBOL_DEFINITION Id_ce_sOAIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50}
// ```
//
//
var Id_ce_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_sOAIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_acceptableCertPolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52}
// ```
//
//
var Id_ce_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_acceptableCertPolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_targetingInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55}
// ```
//
//
var Id_ce_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_targetingInformation */ /* START_OF_SYMBOL_DEFINITION Id_ce_noRevAvail */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56}
// ```
//
//
var Id_ce_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_noRevAvail */ /* START_OF_SYMBOL_DEFINITION Id_ce_acceptablePrivilegePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57}
// ```
//
//
var Id_ce_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_acceptablePrivilegePolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_indirectIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61}
// ```
//
//
var Id_ce_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_indirectIssuer */ /* START_OF_SYMBOL_DEFINITION Id_ce_noAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62}
// ```
//
//
var Id_ce_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_noAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ce_issuedOnBehalfOf */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64}
// ```
//
//
var Id_ce_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_issuedOnBehalfOf */ /* START_OF_SYMBOL_DEFINITION Id_ce_singleUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65}
// ```
//
//
var Id_ce_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_singleUse */ /* START_OF_SYMBOL_DEFINITION Id_ce_groupAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66}
// ```
//
//
var Id_ce_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_groupAC */ /* START_OF_SYMBOL_DEFINITION Id_ce_allowedAttributeAssignments */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67}
// ```
//
//
var Id_ce_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_allowedAttributeAssignments */ /* START_OF_SYMBOL_DEFINITION Id_ce_attributeMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68}
// ```
//
//
var Id_ce_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_attributeMappings */ /* START_OF_SYMBOL_DEFINITION Id_ce_holderNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69}
// ```
//
//
var Id_ce_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_holderNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_mr_attributeCertificateMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-attributeCertificateMatch          OBJECT IDENTIFIER ::= {id-mr 42}
// ```
//
//
var Id_mr_attributeCertificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_attributeCertificateMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_attributeCertificateExactMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-attributeCertificateExactMatch     OBJECT IDENTIFIER ::= {id-mr 45}
// ```
//
//
var Id_mr_attributeCertificateExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_attributeCertificateExactMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_holderIssuerMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-holderIssuerMatch                  OBJECT IDENTIFIER ::= {id-mr 46}
// ```
//
//
var Id_mr_holderIssuerMatch asn1.ObjectIdentifier = []int{2, 5, 13, 46} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_holderIssuerMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_authAttIdMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-authAttIdMatch                     OBJECT IDENTIFIER ::= {id-mr 53}
// ```
//
//
var Id_mr_authAttIdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 53} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_authAttIdMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_roleSpecCertIdMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-roleSpecCertIdMatch                OBJECT IDENTIFIER ::= {id-mr 54}
// ```
//
//
var Id_mr_roleSpecCertIdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 54} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_roleSpecCertIdMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_basicAttConstraintsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-basicAttConstraintsMatch           OBJECT IDENTIFIER ::= {id-mr 55}
// ```
//
//
var Id_mr_basicAttConstraintsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 55} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_basicAttConstraintsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_delegatedNameConstraintsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-delegatedNameConstraintsMatch      OBJECT IDENTIFIER ::= {id-mr 56}
// ```
//
//
var Id_mr_delegatedNameConstraintsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 56} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_delegatedNameConstraintsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_timeSpecMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-timeSpecMatch                      OBJECT IDENTIFIER ::= {id-mr 57}
// ```
//
//
var Id_mr_timeSpecMatch asn1.ObjectIdentifier = []int{2, 5, 13, 57} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_timeSpecMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_attDescriptorMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-attDescriptorMatch                 OBJECT IDENTIFIER ::= {id-mr 58}
// ```
//
//
var Id_mr_attDescriptorMatch asn1.ObjectIdentifier = []int{2, 5, 13, 58} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_attDescriptorMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_acceptableCertPoliciesMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-acceptableCertPoliciesMatch        OBJECT IDENTIFIER ::= {id-mr 59}
// ```
//
//
var Id_mr_acceptableCertPoliciesMatch asn1.ObjectIdentifier = []int{2, 5, 13, 59} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_acceptableCertPoliciesMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_delegationPathMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-delegationPathMatch                OBJECT IDENTIFIER ::= {id-mr 61}
// ```
//
//
var Id_mr_delegationPathMatch asn1.ObjectIdentifier = []int{2, 5, 13, 61} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_delegationPathMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_sOAIdentifierMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-sOAIdentifierMatch                 OBJECT IDENTIFIER ::= {id-mr 66}
// ```
//
//
var Id_mr_sOAIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 66} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_sOAIdentifierMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_extensionPresenceMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-extensionPresenceMatch             OBJECT IDENTIFIER ::= {id-mr 67}
// ```
//
//
var Id_mr_extensionPresenceMatch asn1.ObjectIdentifier = []int{2, 5, 13, 67} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_extensionPresenceMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_dualStringMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-dualStringMatch                    OBJECT IDENTIFIER ::= {id-mr 69}
// ```
//
//
var Id_mr_dualStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 69} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_dualStringMatch */ /* START_OF_SYMBOL_DEFINITION ObjectDigestInfo_digestedObjectType */
// ### ASN.1 Definition:
//
// ```asn1
// ObjectDigestInfo-digestedObjectType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type ObjectDigestInfo_digestedObjectType = asn1.Enumerated

const (
	ObjectDigestInfo_digestedObjectType_PublicKey        ObjectDigestInfo_digestedObjectType = 0 // LONG_NAMED_ENUMERATED_VALUE,
	ObjectDigestInfo_digestedObjectType_PublicKeyCert    ObjectDigestInfo_digestedObjectType = 1 // LONG_NAMED_ENUMERATED_VALUE,
	ObjectDigestInfo_digestedObjectType_OtherObjectTypes ObjectDigestInfo_digestedObjectType = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION ObjectDigestInfo_digestedObjectType */ /* START_OF_SYMBOL_DEFINITION AllowedAttributeAssignments_Item_attributes_Item */
// ### ASN.1 Definition:
//
// ```asn1
// AllowedAttributeAssignments-Item-attributes-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type AllowedAttributeAssignments_Item_attributes_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AllowedAttributeAssignments_Item_attributes_Item */ /* START_OF_SYMBOL_DEFINITION AllowedAttributeAssignments_Item */
// ### ASN.1 Definition:
//
// ```asn1
// AllowedAttributeAssignments-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type AllowedAttributeAssignments_Item struct {
	Attributes   [](AllowedAttributeAssignments_Item_attributes_Item) `asn1:"tag:0,set"`
	HolderDomain GeneralName                                          `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION AllowedAttributeAssignments_Item */ /* START_OF_SYMBOL_DEFINITION AttributeMappings_Item_typeMappings */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeMappings-Item-typeMappings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type AttributeMappings_Item_typeMappings struct {
	Local  AttributeType `asn1:"tag:0"`
	Remote AttributeType `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION AttributeMappings_Item_typeMappings */ /* START_OF_SYMBOL_DEFINITION AttributeMappings_Item_typeValueMappings */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeMappings-Item-typeValueMappings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type AttributeMappings_Item_typeValueMappings struct {
	Local  pkix.AttributeTypeAndValue `asn1:"tag:0"`
	Remote pkix.AttributeTypeAndValue `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION AttributeMappings_Item_typeValueMappings */ /* START_OF_SYMBOL_DEFINITION AttributeMappings_Item */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeMappings-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type AttributeMappings_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AttributeMappings_Item */ /* START_OF_SYMBOL_DEFINITION AttributeCertificateAssertion_holder */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificateAssertion-holder ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type AttributeCertificateAssertion_holder = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AttributeCertificateAssertion_holder */
