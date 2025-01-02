package x500_go

import (
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
// AttributeCertificate  ::=  SIGNED{TBSAttributeCertificate}
type AttributeCertificate = SIGNED // DefinedType
// # ASN.1 Definition:
//
//	TBSAttributeCertificate ::= SEQUENCE {
//	  version                 AttCertVersion, -- version is v2
//	  holder                  Holder,
//	  issuer                  AttCertIssuer,
//	  signature               AlgorithmIdentifier{{SupportedAlgorithms}},
//	  serialNumber            CertificateSerialNumber,
//	  attrCertValidityPeriod  AttCertValidityPeriod,
//	  attributes              SEQUENCE OF Attribute{{SupportedAttributes}},
//	  issuerUniqueID          UniqueIdentifier OPTIONAL,
//	  ...,
//	  ...,
//	  extensions              Extensions OPTIONAL
//	 }  (CONSTRAINED BY { -- shall be DER encoded -- } )
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

// # ASN.1 Definition:
//
// AttCertVersion  ::=  INTEGER {v2(1)}
type AttCertVersion = int64

const AttCertVersion_V2 AttCertVersion = 1

// # ASN.1 Definition:
//
//	Holder ::= SEQUENCE {
//	  baseCertificateID  [0]  IssuerSerial OPTIONAL,
//	  entityName         [1]  GeneralNames OPTIONAL,
//	  objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
//	  (WITH COMPONENTS {..., baseCertificateID  PRESENT } |
//	   WITH COMPONENTS {..., entityName  PRESENT } |
//	   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )
type Holder struct {
	BaseCertificateID IssuerSerial     `asn1:"optional,tag:0"`
	EntityName        GeneralNames     `asn1:"optional,tag:1"`
	ObjectDigestInfo  ObjectDigestInfo `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	IssuerSerial ::= SEQUENCE {
//	  issuer     GeneralNames,
//	  serial     CertificateSerialNumber,
//	  issuerUID  UniqueIdentifier OPTIONAL,
//	  ... }
type IssuerSerial struct {
	Issuer    GeneralNames
	Serial    CertificateSerialNumber
	IssuerUID UniqueIdentifier `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ObjectDigestInfo ::= SEQUENCE {
//	  digestedObjectType   ENUMERATED {
//	    publicKey        (0),
//	    publicKeyCert    (1),
//	    otherObjectTypes (2)},
//	  otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
//	  digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
//	  objectDigest        BIT STRING,
//	  ... }
type ObjectDigestInfo struct {
	DigestedObjectType ObjectDigestInfo_digestedObjectType
	OtherObjectTypeID  asn1.ObjectIdentifier `asn1:"optional"`
	DigestAlgorithm    pkix.AlgorithmIdentifier
	ObjectDigest       asn1.BitString
}

// # ASN.1 Definition:
//
//	AttCertIssuer ::= [0]  SEQUENCE {
//	  issuerName              GeneralNames OPTIONAL,
//	  baseCertificateID  [0]  IssuerSerial OPTIONAL,
//	  objectDigestInfo   [1]  ObjectDigestInfo OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., issuerName  PRESENT } |
//	   WITH COMPONENTS {..., baseCertificateID  PRESENT } |
//	   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )
type AttCertIssuer struct {
	IssuerName        GeneralNames     `asn1:"optional"`
	BaseCertificateID IssuerSerial     `asn1:"optional,tag:0"`
	ObjectDigestInfo  ObjectDigestInfo `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	AttCertValidityPeriod ::= SEQUENCE {
//	  notBeforeTime  GeneralizedTime,
//	  notAfterTime   GeneralizedTime,
//	  ... }
type AttCertValidityPeriod struct {
	NotBeforeTime time.Time
	NotAfterTime  time.Time
}

// # ASN.1 Definition:
//
//	AttributeCertificationPath ::= SEQUENCE {
//	  attributeCertificate  AttributeCertificate,
//	  acPath                SEQUENCE OF ACPathData OPTIONAL,
//	  ... }
type AttributeCertificationPath struct {
	AttributeCertificate AttributeCertificate
	AcPath               [](ACPathData) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ACPathData ::= SEQUENCE {
//	  certificate           [0]  Certificate OPTIONAL,
//	  attributeCertificate  [1]  AttributeCertificate OPTIONAL,
//	  ... }
type ACPathData struct {
	Certificate          x509.Certificate     `asn1:"optional,tag:0"`
	AttributeCertificate AttributeCertificate `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
// PrivilegePolicy  ::=  OBJECT IDENTIFIER
type PrivilegePolicy = asn1.ObjectIdentifier // ObjectIdentifierType
// # ASN.1 Definition:
//
//	RoleSyntax ::= SEQUENCE {
//	  roleAuthority  [0]  GeneralNames OPTIONAL,
//	  roleName       [1]  GeneralName,
//	  ... }
type RoleSyntax struct {
	RoleAuthority GeneralNames `asn1:"optional,tag:0"`
	RoleName      GeneralName  `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
//	DualStringSyntax ::= SEQUENCE {
//	  operation  [0]  UnboundedDirectoryString,
//	  object     [1]  UnboundedDirectoryString,
//	  ... }
type DualStringSyntax struct {
	Operation UnboundedDirectoryString `asn1:"tag:0"`
	Object    UnboundedDirectoryString `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
// Targets  ::=  SEQUENCE SIZE (1..MAX) OF Target
type Targets = [](Target) // SequenceOfType
// # ASN.1 Definition:
//
//	Target  ::=  CHOICE {
//	  targetName   [0]  GeneralName,
//	  targetGroup  [1]  GeneralName,
//	  targetCert   [2]  TargetCert,
//	  ... }
type Target = asn1.RawValue

// # ASN.1 Definition:
//
//	TargetCert ::= SEQUENCE {
//	  targetCertificate  IssuerSerial,
//	  targetName         GeneralName OPTIONAL,
//	  certDigestInfo     ObjectDigestInfo OPTIONAL }
type TargetCert struct {
	TargetCertificate IssuerSerial
	TargetName        GeneralName      `asn1:"optional"`
	CertDigestInfo    ObjectDigestInfo `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	UserNotice ::= SEQUENCE {
//	  noticeRef     NoticeReference OPTIONAL,
//	  explicitText  DisplayText OPTIONAL }
type UserNotice struct {
	NoticeRef    NoticeReference `asn1:"optional"`
	ExplicitText DisplayText     `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	NoticeReference ::= SEQUENCE {
//	  organization   DisplayText,
//	  noticeNumbers  SEQUENCE OF INTEGER }
type NoticeReference struct {
	Organization  DisplayText
	NoticeNumbers [](int)
}

// # ASN.1 Definition:
//
// DisplayText  ::=  CHOICE {
//   visibleString  VisibleString(SIZE (1..200)),
//   bmpString      BMPString(SIZE (1..200)),
//   utf8String     UTF8String(SIZE (1..200)) }
// type DisplayText = asn1.RawValue

// # ASN.1 Definition:
//
// AcceptablePrivilegePoliciesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF PrivilegePolicy
type AcceptablePrivilegePoliciesSyntax = [](PrivilegePolicy) // SequenceOfType
// # ASN.1 Definition:
//
//	AttributeDescriptorSyntax ::= SEQUENCE {
//	  identifier             AttributeIdentifier,
//	  attributeSyntax        OCTET STRING(SIZE (1..MAX)),
//	  name              [0]  AttributeName OPTIONAL,
//	  description       [1]  AttributeDescription OPTIONAL,
//	  dominationRule         PrivilegePolicyIdentifier,
//	  ... }
type AttributeDescriptorSyntax struct {
	Identifier      AttributeIdentifier
	AttributeSyntax []byte
	Name            AttributeName        `asn1:"optional,tag:0"`
	Description     AttributeDescription `asn1:"optional,tag:1"`
	DominationRule  PrivilegePolicyIdentifier
}

// # ASN.1 Definition:
//
// AttributeIdentifier  ::=  ATTRIBUTE.&id({AttributeIDs})
type AttributeIdentifier = asn1.ObjectIdentifier // ObjectClassFieldType
// # ASN.1 Definition:
//
// AttributeName  ::=  UTF8String(SIZE (1..MAX))
type AttributeName = string // UTF8String
// # ASN.1 Definition:
//
// AttributeDescription  ::=  UTF8String(SIZE (1..MAX))
type AttributeDescription = string // UTF8String
// # ASN.1 Definition:
//
//	PrivilegePolicyIdentifier ::= SEQUENCE {
//	  privilegePolicy  PrivilegePolicy,
//	  privPolSyntax    InfoSyntax,
//	  ... }
type PrivilegePolicyIdentifier struct {
	PrivilegePolicy PrivilegePolicy
	PrivPolSyntax   InfoSyntax
}

// # ASN.1 Definition:
//
// RoleSpecCertIdentifierSyntax  ::=
//
//	SEQUENCE SIZE (1..MAX) OF RoleSpecCertIdentifier
type RoleSpecCertIdentifierSyntax = [](RoleSpecCertIdentifier) // SequenceOfType
// # ASN.1 Definition:
//
//	RoleSpecCertIdentifier ::= SEQUENCE {
//	  roleName              [0]  GeneralName,
//	  roleCertIssuer        [1]  GeneralName,
//	  roleCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
//	  roleCertLocator       [3]  GeneralNames OPTIONAL,
//	  ... }
type RoleSpecCertIdentifier struct {
	RoleName             GeneralName             `asn1:"tag:0"`
	RoleCertIssuer       GeneralName             `asn1:"tag:1"`
	RoleCertSerialNumber CertificateSerialNumber `asn1:"optional,tag:2"`
	RoleCertLocator      GeneralNames            `asn1:"optional,tag:3"`
}

// # ASN.1 Definition:
//
//	BasicAttConstraintsSyntax ::= SEQUENCE {
//	  authority          BOOLEAN DEFAULT FALSE,
//	  pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
//	  ... }
type BasicAttConstraintsSyntax struct {
	Authority         bool `asn1:"optional"`
	PathLenConstraint int  `asn1:"optional"`
}

// # ASN.1 Definition:
//
// AcceptableCertPoliciesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF CertPolicyId
type AcceptableCertPoliciesSyntax = [](CertPolicyId) // SequenceOfType
// # ASN.1 Definition:
//
// CertPolicyId  ::=  OBJECT IDENTIFIER
// type CertPolicyId = asn1.ObjectIdentifier // ObjectIdentifierType
// # ASN.1 Definition:
//
// AuthorityAttributeIdentifierSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AuthAttId
type AuthorityAttributeIdentifierSyntax = [](AuthAttId) // SequenceOfType
// # ASN.1 Definition:
//
// AuthAttId  ::=  IssuerSerial
type AuthAttId = IssuerSerial // DefinedType
// # ASN.1 Definition:
//
//	AllowedAttributeAssignments  ::=  SET OF SEQUENCE {
//	  attributes              [0]  SET OF CHOICE {
//	    attributeType           [0]  AttributeType,
//	    attributeTypeandValues  [1]  Attribute{{SupportedAttributes}},
//	    ... },
//	  holderDomain            [1]  GeneralName,
//	  ... }
type AllowedAttributeAssignments = [](AllowedAttributeAssignments_Item) // SetOfType
// # ASN.1 Definition:
//
//	AttributeMappings  ::=  SET OF CHOICE {
//	  typeMappings      [0]  SEQUENCE {
//	    local             [0]  AttributeType,
//	    remote            [1]  AttributeType,
//	    ... },
//	  typeValueMappings [1]  SEQUENCE {
//	    local             [0]  AttributeTypeAndValue,
//	    remote            [1]  AttributeTypeAndValue,
//	    ... } }
type AttributeMappings = [](AttributeMappings_Item) // SetOfType
// # ASN.1 Definition:
//
//	HolderNameConstraintsSyntax ::= SEQUENCE {
//	  permittedSubtrees  [0]  GeneralSubtrees,
//	  excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
//	  ... }
type HolderNameConstraintsSyntax struct {
	PermittedSubtrees GeneralSubtrees `asn1:"tag:0"`
	ExcludedSubtrees  GeneralSubtrees `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
// GeneralSubtrees  ::=  SEQUENCE SIZE (1..MAX) OF GeneralSubtree
// type GeneralSubtrees = [](GeneralSubtree) // SequenceOfType
// # ASN.1 Definition:
//
// GeneralSubtree ::= SEQUENCE {
//   base          GeneralName,
//   minimum  [0]  BaseDistance DEFAULT 0,
//   maximum  [1]  BaseDistance OPTIONAL,
//   ... }
//
//
// type GeneralSubtree struct {
// 	Base    GeneralName
// 	Minimum BaseDistance `asn1:"optional,tag:0"`
// 	Maximum BaseDistance `asn1:"optional,tag:1"`
// }

// # ASN.1 Definition:
//
// BaseDistance  ::=  INTEGER(0..MAX)
// type BaseDistance = int64

// # ASN.1 Definition:
//
// AttCertPath  ::=  SEQUENCE OF AttributeCertificate
type AttCertPath = [](AttributeCertificate) // SequenceOfType
// # ASN.1 Definition:
//
//	AttributeCertificateExactAssertion ::= SEQUENCE {
//	  serialNumber  CertificateSerialNumber,
//	  issuer        AttCertIssuer,
//	  ... }
type AttributeCertificateExactAssertion struct {
	SerialNumber CertificateSerialNumber
	Issuer       AttCertIssuer
}

// # ASN.1 Definition:
//
//	AttributeCertificateAssertion ::= SEQUENCE {
//	  holder             [0]  CHOICE {
//	    baseCertificateID  [0]  IssuerSerial,
//	    holderName         [1]  GeneralNames,
//	    ...} OPTIONAL,
//	  issuer             [1]  GeneralNames OPTIONAL,
//	  attCertValidity    [2]  GeneralizedTime OPTIONAL,
//	  attType            [3]  SET OF AttributeType OPTIONAL,
//	  ... }
type AttributeCertificateAssertion struct {
	Holder          AttributeCertificateAssertion_holder `asn1:"optional,tag:0"`
	Issuer          GeneralNames                         `asn1:"optional,tag:1"`
	AttCertValidity time.Time                            `asn1:"optional,tag:2"`
	AttType         [](AttributeType)                    `asn1:"optional,tag:3,set"`
}

// # ASN.1 Definition:
//
//	HolderIssuerAssertion ::= SEQUENCE {
//	  holder  [0]  Holder OPTIONAL,
//	  issuer  [1]  AttCertIssuer OPTIONAL,
//	  ... }
type HolderIssuerAssertion struct {
	Holder Holder        `asn1:"optional,tag:0"`
	Issuer AttCertIssuer `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	DelMatchSyntax ::= SEQUENCE {
//	  firstIssuer  AttCertIssuer,
//	  lastHolder   Holder,
//	  ... }
type DelMatchSyntax struct {
	FirstIssuer AttCertIssuer
	LastHolder  Holder
}

// # ASN.1 Definition:
//
// id-oc-pmiUser                            OBJECT IDENTIFIER ::= {id-oc 24}
var Id_oc_pmiUser asn1.ObjectIdentifier = []int{2, 5, 6, 24} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-pmiAA                              OBJECT IDENTIFIER ::= {id-oc 25}
var Id_oc_pmiAA asn1.ObjectIdentifier = []int{2, 5, 6, 25} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-pmiSOA                             OBJECT IDENTIFIER ::= {id-oc 26}
var Id_oc_pmiSOA asn1.ObjectIdentifier = []int{2, 5, 6, 26} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-attCertCRLDistributionPts          OBJECT IDENTIFIER ::= {id-oc 27}
var Id_oc_attCertCRLDistributionPts asn1.ObjectIdentifier = []int{2, 5, 6, 27} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-privilegePolicy                    OBJECT IDENTIFIER ::= {id-oc 32}
var Id_oc_privilegePolicy asn1.ObjectIdentifier = []int{2, 5, 6, 32} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-pmiDelegationPath                  OBJECT IDENTIFIER ::= {id-oc 33}
var Id_oc_pmiDelegationPath asn1.ObjectIdentifier = []int{2, 5, 6, 33} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oc-protectedPrivilegePolicy           OBJECT IDENTIFIER ::= {id-oc 34}
var Id_oc_protectedPrivilegePolicy asn1.ObjectIdentifier = []int{2, 5, 6, 34} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-attributeCertificate               OBJECT IDENTIFIER ::= {id-at 58}
var Id_at_attributeCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 58} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-attributeCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 59}
var Id_at_attributeCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 59} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-aACertificate                      OBJECT IDENTIFIER ::= {id-at 61}
var Id_at_aACertificate asn1.ObjectIdentifier = []int{2, 5, 4, 61} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-attributeDescriptorCertificate     OBJECT IDENTIFIER ::= {id-at 62}
var Id_at_attributeDescriptorCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 62} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-attributeAuthorityRevocationList   OBJECT IDENTIFIER ::= {id-at 63}
var Id_at_attributeAuthorityRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 63} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-privPolicy                         OBJECT IDENTIFIER ::= {id-at 71}
var Id_at_privPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 71} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-role                               OBJECT IDENTIFIER ::= {id-at 72}
var Id_at_role asn1.ObjectIdentifier = []int{2, 5, 4, 72} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-delegationPath                     OBJECT IDENTIFIER ::= {id-at 73}
var Id_at_delegationPath asn1.ObjectIdentifier = []int{2, 5, 4, 73} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-protPrivPolicy                     OBJECT IDENTIFIER ::= {id-at 74}
var Id_at_protPrivPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 74} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-xMLPrivilegeInfo                   OBJECT IDENTIFIER ::= {id-at 75}
var Id_at_xMLPrivilegeInfo asn1.ObjectIdentifier = []int{2, 5, 4, 75} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-xmlPrivPolicy                      OBJECT IDENTIFIER ::= {id-at 76}
var Id_at_xmlPrivPolicy asn1.ObjectIdentifier = []int{2, 5, 4, 76} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-permission                         OBJECT IDENTIFIER ::= {id-at 82}
var Id_at_permission asn1.ObjectIdentifier = []int{2, 5, 4, 82} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-at-eeAttrCertificateRevocationList    OBJECT IDENTIFIER ::= {id-at 102}
var Id_at_eeAttrCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 102} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38}
var Id_ce_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39}
var Id_ce_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41}
var Id_ce_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42}
var Id_ce_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43}
var Id_ce_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48}
var Id_ce_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49}
var Id_ce_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50}
var Id_ce_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52}
var Id_ce_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55}
var Id_ce_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56}
var Id_ce_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57}
var Id_ce_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61}
var Id_ce_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62}
var Id_ce_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64}
var Id_ce_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65}
var Id_ce_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66}
var Id_ce_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67}
var Id_ce_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68}
var Id_ce_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69}
var Id_ce_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-attributeCertificateMatch          OBJECT IDENTIFIER ::= {id-mr 42}
var Id_mr_attributeCertificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 42} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-attributeCertificateExactMatch     OBJECT IDENTIFIER ::= {id-mr 45}
var Id_mr_attributeCertificateExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 45} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-holderIssuerMatch                  OBJECT IDENTIFIER ::= {id-mr 46}
var Id_mr_holderIssuerMatch asn1.ObjectIdentifier = []int{2, 5, 13, 46} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-authAttIdMatch                     OBJECT IDENTIFIER ::= {id-mr 53}
var Id_mr_authAttIdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 53} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-roleSpecCertIdMatch                OBJECT IDENTIFIER ::= {id-mr 54}
var Id_mr_roleSpecCertIdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 54} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-basicAttConstraintsMatch           OBJECT IDENTIFIER ::= {id-mr 55}
var Id_mr_basicAttConstraintsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 55} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-delegatedNameConstraintsMatch      OBJECT IDENTIFIER ::= {id-mr 56}
var Id_mr_delegatedNameConstraintsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 56} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-timeSpecMatch                      OBJECT IDENTIFIER ::= {id-mr 57}
var Id_mr_timeSpecMatch asn1.ObjectIdentifier = []int{2, 5, 13, 57} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-attDescriptorMatch                 OBJECT IDENTIFIER ::= {id-mr 58}
var Id_mr_attDescriptorMatch asn1.ObjectIdentifier = []int{2, 5, 13, 58} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-acceptableCertPoliciesMatch        OBJECT IDENTIFIER ::= {id-mr 59}
var Id_mr_acceptableCertPoliciesMatch asn1.ObjectIdentifier = []int{2, 5, 13, 59} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-delegationPathMatch                OBJECT IDENTIFIER ::= {id-mr 61}
var Id_mr_delegationPathMatch asn1.ObjectIdentifier = []int{2, 5, 13, 61} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-sOAIdentifierMatch                 OBJECT IDENTIFIER ::= {id-mr 66}
var Id_mr_sOAIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 66} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-extensionPresenceMatch             OBJECT IDENTIFIER ::= {id-mr 67}
var Id_mr_extensionPresenceMatch asn1.ObjectIdentifier = []int{2, 5, 13, 67} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-mr-dualStringMatch                    OBJECT IDENTIFIER ::= {id-mr 69}
var Id_mr_dualStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 69} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// ObjectDigestInfo-digestedObjectType ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type ObjectDigestInfo_digestedObjectType = asn1.Enumerated

const (
	ObjectDigestInfo_digestedObjectType_PublicKey        ObjectDigestInfo_digestedObjectType = 0
	ObjectDigestInfo_digestedObjectType_PublicKeyCert    ObjectDigestInfo_digestedObjectType = 1
	ObjectDigestInfo_digestedObjectType_OtherObjectTypes ObjectDigestInfo_digestedObjectType = 2
)

// # ASN.1 Definition:
//
// AllowedAttributeAssignments-Item-attributes-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type AllowedAttributeAssignments_Item_attributes_Item = asn1.RawValue

// # ASN.1 Definition:
//
// AllowedAttributeAssignments-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AllowedAttributeAssignments_Item struct {
	Attributes   [](AllowedAttributeAssignments_Item_attributes_Item) `asn1:"tag:0,set"`
	HolderDomain GeneralName                                          `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
// AttributeMappings-Item-typeMappings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AttributeMappings_Item_typeMappings struct {
	Local  AttributeType `asn1:"tag:0"`
	Remote AttributeType `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
// AttributeMappings-Item-typeValueMappings ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AttributeMappings_Item_typeValueMappings struct {
	Local  pkix.AttributeTypeAndValue `asn1:"tag:0"`
	Remote pkix.AttributeTypeAndValue `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
// AttributeMappings-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type AttributeMappings_Item = asn1.RawValue

// # ASN.1 Definition:
//
// AttributeCertificateAssertion-holder ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type AttributeCertificateAssertion_holder = asn1.RawValue
