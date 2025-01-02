package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
	"math/big"
	"time"
)

// # ASN.1 Definition:
//
//	AuthorityKeyIdentifier ::= SEQUENCE {
//	  keyIdentifier              [0]  KeyIdentifier OPTIONAL,
//	  authorityCertIssuer        [1]  GeneralNames OPTIONAL,
//	  authorityCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., authorityCertIssuer        PRESENT,
//	                         authorityCertSerialNumber  PRESENT } |
//	   WITH COMPONENTS {..., authorityCertIssuer        ABSENT,
//	                         authorityCertSerialNumber  ABSENT } )
type AuthorityKeyIdentifier struct {
	KeyIdentifier             KeyIdentifier           `asn1:"optional,tag:0"`
	AuthorityCertIssuer       GeneralNames            `asn1:"optional,tag:1"`
	AuthorityCertSerialNumber CertificateSerialNumber `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	KeyIdentifier ::= OCTET STRING
type KeyIdentifier = []byte

// # ASN.1 Definition:
//
//	SubjectKeyIdentifier ::= KeyIdentifier
type SubjectKeyIdentifier = KeyIdentifier

// # ASN.1 Definition:
//
//	KeyUsage ::= BIT STRING {
//	  digitalSignature  (0),
//	  contentCommitment (1),
//	  keyEncipherment   (2),
//	  dataEncipherment  (3),
//	  keyAgreement      (4),
//	  keyCertSign       (5),
//	  cRLSign           (6),
//	  encipherOnly      (7),
//	  decipherOnly      (8) }
type KeyUsage = asn1.BitString

const KeyUsage_DigitalSignature int32 = 0

const KeyUsage_ContentCommitment int32 = 1

const KeyUsage_KeyEncipherment int32 = 2

const KeyUsage_DataEncipherment int32 = 3

const KeyUsage_KeyAgreement int32 = 4

const KeyUsage_KeyCertSign int32 = 5

const KeyUsage_CRLSign int32 = 6

const KeyUsage_EncipherOnly int32 = 7

const KeyUsage_DecipherOnly int32 = 8

// # ASN.1 Definition:
//
//	KeyPurposeId ::= OBJECT IDENTIFIER
type KeyPurposeId = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	PrivateKeyUsagePeriod ::= SEQUENCE {
//	  notBefore  [0]  GeneralizedTime OPTIONAL,
//	  notAfter   [1]  GeneralizedTime OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., notBefore  PRESENT } |
//	   WITH COMPONENTS {..., notAfter   PRESENT } )
type PrivateKeyUsagePeriod struct {
	NotBefore time.Time `asn1:"optional,tag:0"`
	NotAfter  time.Time `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	CertificatePoliciesSyntax ::= SEQUENCE SIZE (1..MAX) OF PolicyInformation
type CertificatePoliciesSyntax = [](PolicyInformation)

// # ASN.1 Definition:
//
//	PolicyInformation ::= SEQUENCE {
//	  policyIdentifier  CertPolicyId,
//	  policyQualifiers  SEQUENCE SIZE (1..MAX) OF PolicyQualifierInfo OPTIONAL,
//	  ... }
type PolicyInformation struct {
	PolicyIdentifier CertPolicyId
	PolicyQualifiers [](PolicyQualifierInfo) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CertPolicyId ::= OBJECT IDENTIFIER
type CertPolicyId = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	PolicyQualifierInfo ::= SEQUENCE {
//	  policyQualifierId  CERT-POLICY-QUALIFIER.&id({SupportedPolicyQualifiers}),
//	  qualifier          CERT-POLICY-QUALIFIER.&Qualifier
//	              ({SupportedPolicyQualifiers}{@policyQualifierId}) OPTIONAL,
//	  ... }
type PolicyQualifierInfo struct {
	PolicyQualifierId asn1.ObjectIdentifier
	Qualifier         asn1.RawValue `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	anyPolicy OBJECT IDENTIFIER ::= {id-ce-certificatePolicies 0}
var AnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 32, 0}

// # ASN.1 Definition:
//
//	PolicyMappingsSyntax ::= SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//	  issuerDomainPolicy   CertPolicyId,
//	  subjectDomainPolicy  CertPolicyId,
//	  ... }
type PolicyMappingsSyntax = [](PolicyMappingsSyntax_Item)

// # ASN.1 Definition:
//
//	AvlId ::= SEQUENCE {
//	  issuer        Name,
//	  serialNumber  AvlSerialNumber OPTIONAL,
//	  ... }
type AvlId struct {
	Issuer       Name
	SerialNumber AvlSerialNumber `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
type GeneralNames = [](GeneralName)

// # ASN.1 Definition:
//
//	GeneralName ::= CHOICE {
//	  otherName                  [0]  INSTANCE OF OTHER-NAME,
//	  rfc822Name                 [1]  IA5String,
//	  dNSName                    [2]  IA5String,
//	  x400Address                [3]  ORAddress,
//	  directoryName              [4]  Name,
//	  ediPartyName               [5]  EDIPartyName,
//	  uniformResourceIdentifier  [6]  IA5String,
//	  iPAddress                  [7]  OCTET STRING,
//	  registeredID               [8]  OBJECT IDENTIFIER,
//	  ... }
type GeneralName = asn1.RawValue

// # ASN.1 Definition:
//
//	EDIPartyName ::= SEQUENCE {
//	  nameAssigner  [0]  UnboundedDirectoryString OPTIONAL,
//	  partyName     [1]  UnboundedDirectoryString,
//	  ... }
type EDIPartyName struct {
	NameAssigner UnboundedDirectoryString `asn1:"optional,tag:0"`
	PartyName    UnboundedDirectoryString `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
//	AttributesSyntax ::= SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
type AttributesSyntax = [](Attribute)

// # ASN.1 Definition:
//
//	BasicConstraintsSyntax ::= SEQUENCE {
//	  cA                 BOOLEAN DEFAULT FALSE,
//	  pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
//	  ... }
type BasicConstraintsSyntax struct {
	CA                bool `asn1:"optional"`
	PathLenConstraint int  `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	NameConstraintsSyntax ::= SEQUENCE {
//	  permittedSubtrees  [0]  GeneralSubtrees OPTIONAL,
//	  excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., permittedSubtrees  PRESENT } |
//	   WITH COMPONENTS {..., excludedSubtrees   PRESENT } )
type NameConstraintsSyntax struct {
	PermittedSubtrees GeneralSubtrees `asn1:"optional,tag:0"`
	ExcludedSubtrees  GeneralSubtrees `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree
type GeneralSubtrees = [](GeneralSubtree)

// # ASN.1 Definition:
//
//	GeneralSubtree ::= SEQUENCE {
//	  base          GeneralName,
//	  minimum  [0]  BaseDistance DEFAULT 0,
//	  maximum  [1]  BaseDistance OPTIONAL,
//	  ... }
type GeneralSubtree struct {
	Base    GeneralName
	Minimum BaseDistance `asn1:"optional,tag:0"`
	Maximum BaseDistance `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	PolicyConstraintsSyntax ::= SEQUENCE {
//	  requireExplicitPolicy  [0]  SkipCerts OPTIONAL,
//	  inhibitPolicyMapping   [1]  SkipCerts OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., requireExplicitPolicy PRESENT } |
//	   WITH COMPONENTS {..., inhibitPolicyMapping  PRESENT } )
type PolicyConstraintsSyntax struct {
	RequireExplicitPolicy SkipCerts `asn1:"optional,tag:0"`
	InhibitPolicyMapping  SkipCerts `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	SkipCerts ::= INTEGER(0..MAX)
type SkipCerts = int64

// # ASN.1 Definition:
//
//	CRLNumber ::= INTEGER(0..MAX)
type CRLNumber = int64

// # ASN.1 Definition:
//
//	CRLScopeSyntax ::= SEQUENCE SIZE (1..MAX) OF PerAuthorityScope
type CRLScopeSyntax = [](PerAuthorityScope)

// # ASN.1 Definition:
//
//	PerAuthorityScope ::= SEQUENCE {
//	  authorityName       [0]  GeneralName OPTIONAL,
//	  distributionPoint   [1]  DistributionPointName OPTIONAL,
//	  onlyContains        [2]  OnlyCertificateTypes OPTIONAL,
//	  onlySomeReasons     [4]  ReasonFlags OPTIONAL,
//	  serialNumberRange   [5]  NumberRange OPTIONAL,
//	  subjectKeyIdRange   [6]  NumberRange OPTIONAL,
//	  nameSubtrees        [7]  GeneralNames OPTIONAL,
//	  baseRevocationInfo  [9]  BaseRevocationInfo OPTIONAL,
//	  ... }
type PerAuthorityScope struct {
	AuthorityName      GeneralName           `asn1:"optional,tag:0"`
	DistributionPoint  DistributionPointName `asn1:"optional,tag:1"`
	OnlyContains       OnlyCertificateTypes  `asn1:"optional,tag:2"`
	OnlySomeReasons    ReasonFlags           `asn1:"optional,tag:4"`
	SerialNumberRange  NumberRange           `asn1:"optional,tag:5"`
	SubjectKeyIdRange  NumberRange           `asn1:"optional,tag:6"`
	NameSubtrees       GeneralNames          `asn1:"optional,tag:7"`
	BaseRevocationInfo BaseRevocationInfo    `asn1:"optional,tag:9"`
}

// # ASN.1 Definition:
//
//	OnlyCertificateTypes ::= BIT STRING {
//	  user      (0),
//	  authority (1),
//	  attribute (2)}
type OnlyCertificateTypes = asn1.BitString

const OnlyCertificateTypes_User int32 = 0

const OnlyCertificateTypes_Authority int32 = 1

const OnlyCertificateTypes_Attribute int32 = 2

// # ASN.1 Definition:
//
//	NumberRange ::= SEQUENCE {
//	  startingNumber  [0]  INTEGER OPTIONAL,
//	  endingNumber    [1]  INTEGER OPTIONAL,
//	  modulus              INTEGER OPTIONAL,
//	  ... }
type NumberRange struct {
	StartingNumber int `asn1:"optional,tag:0"`
	EndingNumber   int `asn1:"optional,tag:1"`
	Modulus        int `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	BaseRevocationInfo ::= SEQUENCE {
//	  cRLStreamIdentifier  [0]  CRLStreamIdentifier OPTIONAL,
//	  cRLNumber            [1]  CRLNumber,
//	  baseThisUpdate       [2]  GeneralizedTime,
//	  ... }
type BaseRevocationInfo struct {
	CRLStreamIdentifier CRLStreamIdentifier `asn1:"optional,tag:0"`
	CRLNumber           CRLNumber           `asn1:"tag:1"`
	BaseThisUpdate      time.Time           `asn1:"tag:2"`
}

// # ASN.1 Definition:
//
//	StatusReferrals ::= SEQUENCE SIZE (1..MAX) OF StatusReferral
type StatusReferrals = [](StatusReferral)

// # ASN.1 Definition:
//
//	StatusReferral ::= CHOICE {
//	  cRLReferral    [0]  CRLReferral,
//	  otherReferral  [1]  INSTANCE OF OTHER-REFERRAL,
//	  ... }
type StatusReferral = asn1.RawValue

// # ASN.1 Definition:
//
//	CRLReferral ::= SEQUENCE {
//	  issuer          [0]  GeneralName OPTIONAL,
//	  location        [1]  GeneralName OPTIONAL,
//	  deltaRefInfo    [2]  DeltaRefInfo OPTIONAL,
//	  cRLScope             CRLScopeSyntax,
//	  lastUpdate      [3]  GeneralizedTime OPTIONAL,
//	  lastChangedCRL  [4]  GeneralizedTime OPTIONAL,
//	  ...
//	}
type CRLReferral struct {
	Issuer         GeneralName  `asn1:"optional,tag:0"`
	Location       GeneralName  `asn1:"optional,tag:1"`
	DeltaRefInfo   DeltaRefInfo `asn1:"optional,tag:2"`
	CRLScope       CRLScopeSyntax
	LastUpdate     time.Time `asn1:"optional,tag:3"`
	LastChangedCRL time.Time `asn1:"optional,tag:4"`
}

// # ASN.1 Definition:
//
//	DeltaRefInfo ::= SEQUENCE {
//	  deltaLocation  GeneralName,
//	  lastDelta      GeneralizedTime OPTIONAL,
//	  ... }
type DeltaRefInfo struct {
	DeltaLocation GeneralName
	LastDelta     time.Time `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CRLStreamIdentifier ::= INTEGER (0..MAX)
type CRLStreamIdentifier = *big.Int

// # ASN.1 Definition:
//
//	OrderedListSyntax ::= ENUMERATED {
//	  ascSerialNum (0),
//	  ascRevDate   (1),
//	  ...}
type OrderedListSyntax = asn1.Enumerated

const (
	OrderedListSyntax_AscSerialNum OrderedListSyntax = 0
	OrderedListSyntax_AscRevDate   OrderedListSyntax = 1
)

// # ASN.1 Definition:
//
//	DeltaInformation ::= SEQUENCE {
//	  deltaLocation  GeneralName,
//	  nextDelta      GeneralizedTime OPTIONAL,
//	  ... }
type DeltaInformation struct {
	DeltaLocation GeneralName
	NextDelta     time.Time `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ToBeRevokedSyntax ::= SEQUENCE SIZE (1..MAX) OF ToBeRevokedGroup
type ToBeRevokedSyntax = [](ToBeRevokedGroup)

// # ASN.1 Definition:
//
//	ToBeRevokedGroup ::= SEQUENCE {
//	  certificateIssuer  [0]  GeneralName OPTIONAL,
//	  reasonInfo         [1]  ReasonInfo OPTIONAL,
//	  revocationTime          GeneralizedTime,
//	  certificateGroup        CertificateGroup,
//	  ... }
type ToBeRevokedGroup struct {
	CertificateIssuer GeneralName `asn1:"optional,tag:0"`
	ReasonInfo        ReasonInfo  `asn1:"optional,tag:1"`
	RevocationTime    time.Time
	CertificateGroup  CertificateGroup
}

// # ASN.1 Definition:
//
//	ReasonInfo ::= SEQUENCE {
//	  reasonCode           CRLReason,
//	  holdInstructionCode  HoldInstruction OPTIONAL,
//	  ... }
type ReasonInfo struct {
	ReasonCode          CRLReason
	HoldInstructionCode HoldInstruction `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CertificateGroup ::= CHOICE {
//	  serialNumbers      [0]  CertificateSerialNumbers,
//	  serialNumberRange  [1]  CertificateGroupNumberRange,
//	  nameSubtree        [2]  GeneralName,
//	  ... }
type CertificateGroup = asn1.RawValue

// # ASN.1 Definition:
//
//	CertificateGroupNumberRange ::= SEQUENCE {
//	  startingNumber  [0]  INTEGER,
//	  endingNumber    [1]  INTEGER,
//	  ... }
type CertificateGroupNumberRange struct {
	StartingNumber int `asn1:"tag:0"`
	EndingNumber   int `asn1:"tag:1"`
}

// # ASN.1 Definition:
//
//	CertificateSerialNumbers ::= SEQUENCE SIZE (1..MAX) OF CertificateSerialNumber
type CertificateSerialNumbers = [](CertificateSerialNumber)

// # ASN.1 Definition:
//
//	RevokedGroupsSyntax ::= SEQUENCE SIZE (1..MAX) OF RevokedGroup
type RevokedGroupsSyntax = [](RevokedGroup)

// # ASN.1 Definition:
//
//	RevokedGroup ::= SEQUENCE {
//	  certificateIssuer        [0]  GeneralName OPTIONAL,
//	  reasonInfo               [1]  ReasonInfo OPTIONAL,
//	  invalidityDate           [2]  GeneralizedTime OPTIONAL,
//	  revokedcertificateGroup  [3]  RevokedCertificateGroup,
//	  ... }
type RevokedGroup struct {
	CertificateIssuer       GeneralName             `asn1:"optional,tag:0"`
	ReasonInfo              ReasonInfo              `asn1:"optional,tag:1"`
	InvalidityDate          time.Time               `asn1:"optional,tag:2"`
	RevokedcertificateGroup RevokedCertificateGroup `asn1:"tag:3"`
}

// # ASN.1 Definition:
//
//	RevokedCertificateGroup ::= CHOICE {
//	  serialNumberRange  NumberRange,
//	  nameSubtree        GeneralName }
type RevokedCertificateGroup = asn1.RawValue

// # ASN.1 Definition:
//
//	ExpiredCertsOnCRL ::= GeneralizedTime
type ExpiredCertsOnCRL = time.Time

// # ASN.1 Definition:
//
//	CRLReason ::= ENUMERATED {
//	  unspecified          (0),
//	  keyCompromise        (1),
//	  cACompromise         (2),
//	  affiliationChanged   (3),
//	  superseded           (4),
//	  cessationOfOperation (5),
//	  certificateHold      (6),
//	  removeFromCRL        (8),
//	  privilegeWithdrawn   (9),
//	  aACompromise         (10),
//	  ...,
//	  weakAlgorithmOrKey   (11) }
type CRLReason = asn1.Enumerated

const (
	CRLReason_Unspecified          CRLReason = 0
	CRLReason_KeyCompromise        CRLReason = 1
	CRLReason_CACompromise         CRLReason = 2
	CRLReason_AffiliationChanged   CRLReason = 3
	CRLReason_Superseded           CRLReason = 4
	CRLReason_CessationOfOperation CRLReason = 5
	CRLReason_CertificateHold      CRLReason = 6
	CRLReason_RemoveFromCRL        CRLReason = 8
	CRLReason_PrivilegeWithdrawn   CRLReason = 9
	CRLReason_AACompromise         CRLReason = 10
	CRLReason_WeakAlgorithmOrKey   CRLReason = 11
)

// # ASN.1 Definition:
//
//	HoldInstruction ::= OBJECT IDENTIFIER
type HoldInstruction = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	CRLDistPointsSyntax ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint
type CRLDistPointsSyntax = [](DistributionPoint)

// # ASN.1 Definition:
//
//	DistributionPoint ::= SEQUENCE {
//	  distributionPoint  [0]  DistributionPointName OPTIONAL,
//	  reasons            [1]  ReasonFlags OPTIONAL,
//	  cRLIssuer          [2]  GeneralNames OPTIONAL,
//	  ... }
type DistributionPoint struct {
	DistributionPoint DistributionPointName `asn1:"optional,tag:0"`
	Reasons           ReasonFlags           `asn1:"optional,tag:1"`
	CRLIssuer         GeneralNames          `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	DistributionPointName ::= CHOICE {
//	  fullName                 [0]  GeneralNames,
//	  nameRelativeToCRLIssuer  [1]  RelativeDistinguishedName,
//	  ... }
type DistributionPointName = asn1.RawValue

// # ASN.1 Definition:
//
//	ReasonFlags ::= BIT STRING {
//	  unused                (0),
//	  keyCompromise         (1),
//	  cACompromise          (2),
//	  affiliationChanged    (3),
//	  superseded            (4),
//	  cessationOfOperation  (5),
//	  certificateHold       (6),
//	  privilegeWithdrawn    (7),
//	  aACompromise          (8),
//	  weakAlgorithmOrKey    (9) }
type ReasonFlags = asn1.BitString

const ReasonFlags_Unused int32 = 0

const ReasonFlags_KeyCompromise int32 = 1

const ReasonFlags_CACompromise int32 = 2

const ReasonFlags_AffiliationChanged int32 = 3

const ReasonFlags_Superseded int32 = 4

const ReasonFlags_CessationOfOperation int32 = 5

const ReasonFlags_CertificateHold int32 = 6

const ReasonFlags_PrivilegeWithdrawn int32 = 7

const ReasonFlags_AACompromise int32 = 8

const ReasonFlags_WeakAlgorithmOrKey int32 = 9

// # ASN.1 Definition:
//
//	IssuingDistPointSyntax ::= SEQUENCE {
//	  -- If onlyContainsUserPublicKeyCerts and onlyContainsCACerts are both FALSE,
//	  -- the CRL covers both public-key certificate types
//	  distributionPoint               [0]  DistributionPointName OPTIONAL,
//	  onlyContainsUserPublicKeyCerts  [1]  BOOLEAN DEFAULT FALSE,
//	  onlyContainsCACerts             [2]  BOOLEAN DEFAULT FALSE,
//	  onlySomeReasons                 [3]  ReasonFlags OPTIONAL,
//	  indirectCRL                     [4]  BOOLEAN DEFAULT FALSE,
//	  onlyContainsAttributeCerts      [5]  BOOLEAN OPTIONAL, -- Use is strongly deprecated
//	  ... }
type IssuingDistPointSyntax struct {
	DistributionPoint              DistributionPointName `asn1:"optional,tag:0"`
	OnlyContainsUserPublicKeyCerts bool                  `asn1:"optional,tag:1"`
	OnlyContainsCACerts            bool                  `asn1:"optional,tag:2"`
	OnlySomeReasons                ReasonFlags           `asn1:"optional,tag:3"`
	IndirectCRL                    bool                  `asn1:"optional,tag:4"`
	OnlyContainsAttributeCerts     bool                  `asn1:"optional,tag:5"`
}

// # ASN.1 Definition:
//
//	BaseCRLNumber ::= CRLNumber
type BaseCRLNumber = CRLNumber

// # ASN.1 Definition:
//
//	ProtRestriction ::= SEQUENCE (SIZE (1..MAX)) OF OBJECT IDENTIFIER
type ProtRestriction = [](asn1.ObjectIdentifier)

// # ASN.1 Definition:
//
//	SubjectAltPublicKeyInfo ::= SEQUENCE {
//	  algorithm              AlgorithmIdentifier{{SupportedAlgorithms}},
//	  subjectAltPublicKey    BIT STRING }
type SubjectAltPublicKeyInfo struct {
	Algorithm           pkix.AlgorithmIdentifier
	SubjectAltPublicKey asn1.BitString
}

// # ASN.1 Definition:
//
//	AltSignatureAlgorithm ::= AlgorithmIdentifier{{SupportedAlgorithms}}
type AltSignatureAlgorithm = pkix.AlgorithmIdentifier

// # ASN.1 Definition:
//
//	AltSignatureValue ::= BIT STRING
type AltSignatureValue = asn1.BitString

// # ASN.1 Definition:
//
//	AAIssuingDistPointSyntax ::= SEQUENCE {
//	  distributionPoint           [0]  DistributionPointName OPTIONAL,
//	  onlySomeReasons             [1]  ReasonFlags OPTIONAL,
//	  indirectCRL                 [2]  BOOLEAN DEFAULT FALSE,
//	  containsUserAttributeCerts  [3]  BOOLEAN DEFAULT TRUE,
//	  containsAACerts             [4]  BOOLEAN DEFAULT TRUE,
//	  containsSOAPublicKeyCerts   [5]  BOOLEAN DEFAULT TRUE,
//	  ... }
type AAIssuingDistPointSyntax struct {
	DistributionPoint          DistributionPointName `asn1:"optional,tag:0"`
	OnlySomeReasons            ReasonFlags           `asn1:"optional,tag:1"`
	IndirectCRL                bool                  `asn1:"optional,tag:2"`
	ContainsUserAttributeCerts bool                  `asn1:"optional,tag:3"`
	ContainsAACerts            bool                  `asn1:"optional,tag:4"`
	ContainsSOAPublicKeyCerts  bool                  `asn1:"optional,tag:5"`
}

// # ASN.1 Definition:
//
//	CertificateExactAssertion ::= SEQUENCE {
//	  serialNumber  CertificateSerialNumber,
//	  issuer        Name,
//	  ... }
type CertificateExactAssertion struct {
	SerialNumber CertificateSerialNumber
	Issuer       Name
}

// # ASN.1 Definition:
//
//	CertificateAssertion ::= SEQUENCE {
//	  serialNumber            [0]  CertificateSerialNumber OPTIONAL,
//	  issuer                  [1]  Name OPTIONAL,
//	  subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
//	  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//	  certificateValid        [4]  Time OPTIONAL,
//	  privateKeyValid         [5]  GeneralizedTime OPTIONAL,
//	  subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
//	  keyUsage                [7]  KeyUsage OPTIONAL,
//	  subjectAltName          [8]  AltNameType OPTIONAL,
//	  policy                  [9]  CertPolicySet OPTIONAL,
//	  pathToName              [10] Name OPTIONAL,
//	  subject                 [11] Name OPTIONAL,
//	  nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
//	  ... }
type CertificateAssertion struct {
	SerialNumber           CertificateSerialNumber `asn1:"optional,tag:0"`
	Issuer                 Name                    `asn1:"optional,tag:1"`
	SubjectKeyIdentifier   SubjectKeyIdentifier    `asn1:"optional,tag:2"`
	AuthorityKeyIdentifier AuthorityKeyIdentifier  `asn1:"optional,tag:3"`
	CertificateValid       Time                    `asn1:"optional,tag:4"`
	PrivateKeyValid        time.Time               `asn1:"optional,tag:5"`
	SubjectPublicKeyAlgID  asn1.ObjectIdentifier   `asn1:"optional,tag:6"`
	KeyUsage               KeyUsage                `asn1:"optional,tag:7"`
	SubjectAltName         AltNameType             `asn1:"optional,tag:8"`
	Policy                 CertPolicySet           `asn1:"optional,tag:9"`
	PathToName             Name                    `asn1:"optional,tag:10"`
	Subject                Name                    `asn1:"optional,tag:11"`
	NameConstraints        NameConstraintsSyntax   `asn1:"optional,tag:12"`
}

// # ASN.1 Definition:
//
//	AltNameType ::= CHOICE {
//	  builtinNameForm  ENUMERATED {
//	    rfc822Name                (1),
//	    dNSName                   (2),
//	    x400Address               (3),
//	    directoryName             (4),
//	    ediPartyName              (5),
//	    uniformResourceIdentifier (6),
//	    iPAddress                 (7),
//	    registeredId              (8),
//	    ...},
//	  otherNameForm    OBJECT IDENTIFIER,
//	  ... }
type AltNameType = asn1.RawValue

// # ASN.1 Definition:
//
//	CertPolicySet ::= SEQUENCE SIZE (1..MAX) OF CertPolicyId
type CertPolicySet = [](CertPolicyId)

// # ASN.1 Definition:
//
//	CertificatePairExactAssertion ::= SEQUENCE {
//	  issuedToThisCAAssertion  [0]  CertificateExactAssertion OPTIONAL,
//	  issuedByThisCAAssertion  [1]  CertificateExactAssertion OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS { ..., issuedToThisCAAssertion  PRESENT } |
//	   WITH COMPONENTS { ..., issuedByThisCAAssertion  PRESENT } )
type CertificatePairExactAssertion struct {
	IssuedToThisCAAssertion CertificateExactAssertion `asn1:"optional,tag:0"`
	IssuedByThisCAAssertion CertificateExactAssertion `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	CertificatePairAssertion ::= SEQUENCE {
//	  issuedToThisCAAssertion  [0]  CertificateAssertion OPTIONAL,
//	  issuedByThisCAAssertion  [1]  CertificateAssertion OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS {..., issuedToThisCAAssertion  PRESENT } |
//	   WITH COMPONENTS {..., issuedByThisCAAssertion  PRESENT } )
type CertificatePairAssertion struct {
	IssuedToThisCAAssertion CertificateAssertion `asn1:"optional,tag:0"`
	IssuedByThisCAAssertion CertificateAssertion `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	CertificateListExactAssertion ::= SEQUENCE {
//	  issuer             Name,
//	  thisUpdate         Time,
//	  distributionPoint  DistributionPointName OPTIONAL }
type CertificateListExactAssertion struct {
	Issuer            Name
	ThisUpdate        Time
	DistributionPoint DistributionPointName `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CertificateListAssertion ::= SEQUENCE {
//	  issuer                       Name                   OPTIONAL,
//	  minCRLNumber            [0]  CRLNumber              OPTIONAL,
//	  maxCRLNumber            [1]  CRLNumber              OPTIONAL,
//	  reasonFlags                  ReasonFlags            OPTIONAL,
//	  dateAndTime                  Time                   OPTIONAL,
//	  distributionPoint       [2]  DistributionPointName  OPTIONAL,
//	  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//	  ... }
type CertificateListAssertion struct {
	Issuer                 Name                   `asn1:"optional"`
	MinCRLNumber           CRLNumber              `asn1:"optional,tag:0"`
	MaxCRLNumber           CRLNumber              `asn1:"optional,tag:1"`
	ReasonFlags            ReasonFlags            `asn1:"optional"`
	DateAndTime            Time                   `asn1:"optional"`
	DistributionPoint      DistributionPointName  `asn1:"optional,tag:2"`
	AuthorityKeyIdentifier AuthorityKeyIdentifier `asn1:"optional,tag:3"`
}

// # ASN.1 Definition:
//
//	PkiPathMatchSyntax ::= SEQUENCE {
//	  firstIssuer  Name,
//	  lastSubject  Name,
//	  ... }
type PkiPathMatchSyntax struct {
	FirstIssuer Name
	LastSubject Name
}

// # ASN.1 Definition:
//
//	EnhancedCertificateAssertion ::= SEQUENCE {
//	  serialNumber            [0]  CertificateSerialNumber OPTIONAL,
//	  issuer                  [1]  Name OPTIONAL,
//	  subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
//	  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//	  certificateValid        [4]  Time OPTIONAL,
//	  privateKeyValid         [5]  GeneralizedTime OPTIONAL,
//	  subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
//	  keyUsage                [7]  KeyUsage OPTIONAL,
//	  subjectAltName          [8]  AltName OPTIONAL,
//	  policy                  [9]  CertPolicySet OPTIONAL,
//	  pathToName              [10] GeneralNames OPTIONAL,
//	  subject                 [11] Name OPTIONAL,
//	  nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
//	  ... }
//	  (ALL EXCEPT ({ -- none; at least one component shall be present --}))
type EnhancedCertificateAssertion struct {
	SerialNumber           CertificateSerialNumber `asn1:"optional,tag:0"`
	Issuer                 Name                    `asn1:"optional,tag:1"`
	SubjectKeyIdentifier   SubjectKeyIdentifier    `asn1:"optional,tag:2"`
	AuthorityKeyIdentifier AuthorityKeyIdentifier  `asn1:"optional,tag:3"`
	CertificateValid       Time                    `asn1:"optional,tag:4"`
	PrivateKeyValid        time.Time               `asn1:"optional,tag:5"`
	SubjectPublicKeyAlgID  asn1.ObjectIdentifier   `asn1:"optional,tag:6"`
	KeyUsage               KeyUsage                `asn1:"optional,tag:7"`
	SubjectAltName         AltName                 `asn1:"optional,tag:8"`
	Policy                 CertPolicySet           `asn1:"optional,tag:9"`
	PathToName             GeneralNames            `asn1:"optional,tag:10"`
	Subject                Name                    `asn1:"optional,tag:11"`
	NameConstraints        NameConstraintsSyntax   `asn1:"optional,tag:12"`
}

// # ASN.1 Definition:
//
//	AltName ::= SEQUENCE {
//	  altnameType   AltNameType,
//	  altNameValue  GeneralName OPTIONAL }
type AltName struct {
	AltnameType  AltNameType
	AltNameValue GeneralName `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	id-ce-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9}
var Id_ce_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9}

// # ASN.1 Definition:
//
//	id-ce-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14}
var Id_ce_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14}

// # ASN.1 Definition:
//
//	id-ce-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15}
var Id_ce_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15}

// # ASN.1 Definition:
//
//	id-ce-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16}
var Id_ce_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16}

// # ASN.1 Definition:
//
//	id-ce-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17}
var Id_ce_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17}

// # ASN.1 Definition:
//
//	id-ce-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18}
var Id_ce_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18}

// # ASN.1 Definition:
//
//	id-ce-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19}
var Id_ce_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19}

// # ASN.1 Definition:
//
//	id-ce-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20}
var Id_ce_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20}

// # ASN.1 Definition:
//
//	id-ce-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21}
var Id_ce_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21}

// # ASN.1 Definition:
//
//	id-ce-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23}
var Id_ce_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23}

// # ASN.1 Definition:
//
//	id-ce-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24}
var Id_ce_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24}

// # ASN.1 Definition:
//
//	id-ce-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27}
var Id_ce_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27}

// # ASN.1 Definition:
//
//	id-ce-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28}
var Id_ce_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28}

// # ASN.1 Definition:
//
//	id-ce-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29}
var Id_ce_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29}

// # ASN.1 Definition:
//
//	id-ce-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30}
var Id_ce_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30}

// # ASN.1 Definition:
//
//	id-ce-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31}
var Id_ce_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31}

// # ASN.1 Definition:
//
//	id-ce-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32}
var Id_ce_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32}

// # ASN.1 Definition:
//
//	id-ce-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33}
var Id_ce_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33}

// # ASN.1 Definition:
//
//	id-ce-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35}
var Id_ce_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35}

// # ASN.1 Definition:
//
//	id-ce-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36}
var Id_ce_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36}

// # ASN.1 Definition:
//
//	id-ce-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37}
var Id_ce_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37}

// # ASN.1 Definition:
//
//	id-ce-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40}
var Id_ce_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40}

// # ASN.1 Definition:
//
//	id-ce-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44}
var Id_ce_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44}

// # ASN.1 Definition:
//
//	id-ce-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45}
var Id_ce_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45}

// # ASN.1 Definition:
//
//	id-ce-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46}
var Id_ce_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46}

// # ASN.1 Definition:
//
//	id-ce-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47}
var Id_ce_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47}

// # ASN.1 Definition:
//
//	id-ce-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51}
var Id_ce_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51}

// # ASN.1 Definition:
//
//	id-ce-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53}
var Id_ce_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53}

// # ASN.1 Definition:
//
//	id-ce-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54}
var Id_ce_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54}

// # ASN.1 Definition:
//
//	id-ce-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58}
var Id_ce_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58}

// # ASN.1 Definition:
//
//	id-ce-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59}
var Id_ce_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59}

// # ASN.1 Definition:
//
//	id-ce-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60}
var Id_ce_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60}

// # ASN.1 Definition:
//
//	id-ce-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63}
var Id_ce_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63}

// # ASN.1 Definition:
//
//	id-ce-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70}
var Id_ce_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70}

// # ASN.1 Definition:
//
//	id-ce-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71}
var Id_ce_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71}

// # ASN.1 Definition:
//
//	id-ce-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72}
var Id_ce_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72}

// # ASN.1 Definition:
//
//	id-ce-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73}
var Id_ce_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73}

// # ASN.1 Definition:
//
//	id-ce-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74}
var Id_ce_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74}

// # ASN.1 Definition:
//
//	id-ce-associatedInformation              OBJECT IDENTIFIER ::= {id-ce 75}
var Id_ce_associatedInformation asn1.ObjectIdentifier = []int{2, 5, 29, 75}

// # ASN.1 Definition:
//
//	id-mr-certificateExactMatch       OBJECT IDENTIFIER ::= {id-mr 34}
var Id_mr_certificateExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 34}

// # ASN.1 Definition:
//
//	id-mr-certificateMatch            OBJECT IDENTIFIER ::= {id-mr 35}
var Id_mr_certificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 35}

// # ASN.1 Definition:
//
//	id-mr-certificatePairExactMatch   OBJECT IDENTIFIER ::= {id-mr 36}
var Id_mr_certificatePairExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 36}

// # ASN.1 Definition:
//
//	id-mr-certificatePairMatch        OBJECT IDENTIFIER ::= {id-mr 37}
var Id_mr_certificatePairMatch asn1.ObjectIdentifier = []int{2, 5, 13, 37}

// # ASN.1 Definition:
//
//	id-mr-certificateListExactMatch   OBJECT IDENTIFIER ::= {id-mr 38}
var Id_mr_certificateListExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 38}

// # ASN.1 Definition:
//
//	id-mr-certificateListMatch        OBJECT IDENTIFIER ::= {id-mr 39}
var Id_mr_certificateListMatch asn1.ObjectIdentifier = []int{2, 5, 13, 39}

// # ASN.1 Definition:
//
//	id-mr-algorithmIdentifierMatch    OBJECT IDENTIFIER ::= {id-mr 40}
var Id_mr_algorithmIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 40}

// # ASN.1 Definition:
//
//	id-mr-policyMatch                 OBJECT IDENTIFIER ::= {id-mr 60}
var Id_mr_policyMatch asn1.ObjectIdentifier = []int{2, 5, 13, 60}

// # ASN.1 Definition:
//
//	id-mr-pkiPathMatch                OBJECT IDENTIFIER ::= {id-mr 62}
var Id_mr_pkiPathMatch asn1.ObjectIdentifier = []int{2, 5, 13, 62}

// # ASN.1 Definition:
//
//	id-mr-enhancedCertificateMatch    OBJECT IDENTIFIER ::= {id-mr 65}
var Id_mr_enhancedCertificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 65}

// # ASN.1 Definition:
//
//	id-ldx-certExactAssertion         OBJECT IDENTIFIER ::= {id-ldx 1}
var Id_ldx_certExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 1}

// # ASN.1 Definition:
//
//	id-ldx-certAssertion              OBJECT IDENTIFIER ::= {id-ldx 2}
var Id_ldx_certAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 2}

// # ASN.1 Definition:
//
//	id-ldx-certPairExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 3}
var Id_ldx_certPairExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 3}

// # ASN.1 Definition:
//
//	id-ldx-certPairAssertion          OBJECT IDENTIFIER ::= {id-ldx 4}
var Id_ldx_certPairAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 4}

// # ASN.1 Definition:
//
//	id-ldx-certListExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 5}
var Id_ldx_certListExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 5}

// # ASN.1 Definition:
//
//	id-ldx-certListAssertion          OBJECT IDENTIFIER ::= {id-ldx 6}
var Id_ldx_certListAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 6}

// # ASN.1 Definition:
//
//	id-ldx-algorithmIdentifier        OBJECT IDENTIFIER ::= {id-ldx 7}
var Id_ldx_algorithmIdentifier asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 7}

// # ASN.1 Definition:
//
//	PolicyMappingsSyntax-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type PolicyMappingsSyntax_Item struct {
	IssuerDomainPolicy  CertPolicyId
	SubjectDomainPolicy CertPolicyId
}

// # ASN.1 Definition:
//
//	AltNameType-builtinNameForm ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type AltNameType_builtinNameForm = asn1.Enumerated

const (
	AltNameType_builtinNameForm_Rfc822Name                AltNameType_builtinNameForm = 1
	AltNameType_builtinNameForm_DNSName                   AltNameType_builtinNameForm = 2
	AltNameType_builtinNameForm_X400Address               AltNameType_builtinNameForm = 3
	AltNameType_builtinNameForm_DirectoryName             AltNameType_builtinNameForm = 4
	AltNameType_builtinNameForm_EdiPartyName              AltNameType_builtinNameForm = 5
	AltNameType_builtinNameForm_UniformResourceIdentifier AltNameType_builtinNameForm = 6
	AltNameType_builtinNameForm_IPAddress                 AltNameType_builtinNameForm = 7
	AltNameType_builtinNameForm_RegisteredId              AltNameType_builtinNameForm = 8
)
