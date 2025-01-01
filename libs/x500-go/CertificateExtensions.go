package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION AuthorityKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// AuthorityKeyIdentifier ::= SEQUENCE {
//   keyIdentifier              [0]  KeyIdentifier OPTIONAL,
//   authorityCertIssuer        [1]  GeneralNames OPTIONAL,
//   authorityCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., authorityCertIssuer        PRESENT,
//                          authorityCertSerialNumber  PRESENT } |
//    WITH COMPONENTS {..., authorityCertIssuer        ABSENT,
//                          authorityCertSerialNumber  ABSENT } )
// ```
//
//
type AuthorityKeyIdentifier struct {
	KeyIdentifier             KeyIdentifier           `asn1:"optional,tag:0"`
	AuthorityCertIssuer       GeneralNames            `asn1:"optional,tag:1"`
	AuthorityCertSerialNumber CertificateSerialNumber `asn1:"optional,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION AuthorityKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION KeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// KeyIdentifier  ::=  OCTET STRING
// ```
type KeyIdentifier = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION KeyIdentifier */ /* START_OF_SYMBOL_DEFINITION SubjectKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// SubjectKeyIdentifier  ::=  KeyIdentifier
// ```
type SubjectKeyIdentifier = KeyIdentifier // DefinedType
/* END_OF_SYMBOL_DEFINITION SubjectKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION KeyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// KeyUsage  ::=  BIT STRING {
//   digitalSignature  (0),
//   contentCommitment (1),
//   keyEncipherment   (2),
//   dataEncipherment  (3),
//   keyAgreement      (4),
//   keyCertSign       (5),
//   cRLSign           (6),
//   encipherOnly      (7),
//   decipherOnly      (8) }
// ```
type KeyUsage = asn1.BitString

/* END_OF_SYMBOL_DEFINITION KeyUsage */

/* START_OF_SYMBOL_DEFINITION KeyUsage_DigitalSignature */
const KeyUsage_DigitalSignature int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_DigitalSignature */

/* START_OF_SYMBOL_DEFINITION KeyUsage_ContentCommitment */
const KeyUsage_ContentCommitment int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_ContentCommitment */

/* START_OF_SYMBOL_DEFINITION KeyUsage_KeyEncipherment */
const KeyUsage_KeyEncipherment int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_KeyEncipherment */

/* START_OF_SYMBOL_DEFINITION KeyUsage_DataEncipherment */
const KeyUsage_DataEncipherment int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_DataEncipherment */

/* START_OF_SYMBOL_DEFINITION KeyUsage_KeyAgreement */
const KeyUsage_KeyAgreement int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_KeyAgreement */

/* START_OF_SYMBOL_DEFINITION KeyUsage_KeyCertSign */
const KeyUsage_KeyCertSign int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_KeyCertSign */

/* START_OF_SYMBOL_DEFINITION KeyUsage_CRLSign */
const KeyUsage_CRLSign int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_CRLSign */

/* START_OF_SYMBOL_DEFINITION KeyUsage_EncipherOnly */
const KeyUsage_EncipherOnly int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_EncipherOnly */

/* START_OF_SYMBOL_DEFINITION KeyUsage_DecipherOnly */
const KeyUsage_DecipherOnly int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION KeyUsage_DecipherOnly */ /* START_OF_SYMBOL_DEFINITION KeyPurposeId */
// ### ASN.1 Definition:
//
// ```asn1
// KeyPurposeId  ::=  OBJECT IDENTIFIER
// ```
type KeyPurposeId = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION KeyPurposeId */ /* START_OF_SYMBOL_DEFINITION PrivateKeyUsagePeriod */
// ### ASN.1 Definition:
//
// ```asn1
// PrivateKeyUsagePeriod ::= SEQUENCE {
//   notBefore  [0]  GeneralizedTime OPTIONAL,
//   notAfter   [1]  GeneralizedTime OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., notBefore  PRESENT } |
//    WITH COMPONENTS {..., notAfter   PRESENT } )
// ```
//
//
type PrivateKeyUsagePeriod struct {
	NotBefore time.Time `asn1:"optional,tag:0"`
	NotAfter  time.Time `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION PrivateKeyUsagePeriod */ /* START_OF_SYMBOL_DEFINITION CertificatePoliciesSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// CertificatePoliciesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF PolicyInformation
// ```
type CertificatePoliciesSyntax = [](PolicyInformation) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertificatePoliciesSyntax */ /* START_OF_SYMBOL_DEFINITION PolicyInformation */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyInformation ::= SEQUENCE {
//   policyIdentifier  CertPolicyId,
//   policyQualifiers  SEQUENCE SIZE (1..MAX) OF PolicyQualifierInfo OPTIONAL,
//   ... }
// ```
//
//
type PolicyInformation struct {
	PolicyIdentifier CertPolicyId
	PolicyQualifiers [](PolicyQualifierInfo) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION PolicyInformation */ /* START_OF_SYMBOL_DEFINITION CertPolicyId */
// ### ASN.1 Definition:
//
// ```asn1
// CertPolicyId  ::=  OBJECT IDENTIFIER
// ```
type CertPolicyId = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION CertPolicyId */ /* START_OF_SYMBOL_DEFINITION PolicyQualifierInfo */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyQualifierInfo ::= SEQUENCE {
//   policyQualifierId  CERT-POLICY-QUALIFIER.&id({SupportedPolicyQualifiers}),
//   qualifier          CERT-POLICY-QUALIFIER.&Qualifier
//               ({SupportedPolicyQualifiers}{@policyQualifierId}) OPTIONAL,
//   ... }
// ```
//
//
type PolicyQualifierInfo struct {
	PolicyQualifierId asn1.ObjectIdentifier
	Qualifier         asn1.RawValue `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION PolicyQualifierInfo */ /* START_OF_SYMBOL_DEFINITION AnyPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// anyPolicy OBJECT IDENTIFIER ::= {id-ce-certificatePolicies 0}
// ```
//
//
var AnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 32, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AnyPolicy */ /* START_OF_SYMBOL_DEFINITION PolicyMappingsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyMappingsSyntax  ::=  SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//   issuerDomainPolicy   CertPolicyId,
//   subjectDomainPolicy  CertPolicyId,
//   ... }
// ```
type PolicyMappingsSyntax = [](PolicyMappingsSyntax_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION PolicyMappingsSyntax */ /* START_OF_SYMBOL_DEFINITION AvlId */
// ### ASN.1 Definition:
//
// ```asn1
// AvlId ::= SEQUENCE {
//   issuer        Name,
//   serialNumber  AvlSerialNumber OPTIONAL,
//   ... }
// ```
//
//
type AvlId struct {
	Issuer       Name
	SerialNumber AvlSerialNumber `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AvlId */ /* START_OF_SYMBOL_DEFINITION GeneralNames */
// ### ASN.1 Definition:
//
// ```asn1
// GeneralNames  ::=  SEQUENCE SIZE (1..MAX) OF GeneralName
// ```
type GeneralNames = [](GeneralName) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION GeneralNames */ /* START_OF_SYMBOL_DEFINITION GeneralName */
// ### ASN.1 Definition:
//
// ```asn1
// GeneralName  ::=  CHOICE {
//   otherName                  [0]  INSTANCE OF OTHER-NAME,
//   rfc822Name                 [1]  IA5String,
//   dNSName                    [2]  IA5String,
//   x400Address                [3]  ORAddress,
//   directoryName              [4]  Name,
//   ediPartyName               [5]  EDIPartyName,
//   uniformResourceIdentifier  [6]  IA5String,
//   iPAddress                  [7]  OCTET STRING,
//   registeredID               [8]  OBJECT IDENTIFIER,
//   ... }
// ```
type GeneralName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION GeneralName */ /* START_OF_SYMBOL_DEFINITION EDIPartyName */
// ### ASN.1 Definition:
//
// ```asn1
// EDIPartyName ::= SEQUENCE {
//   nameAssigner  [0]  UnboundedDirectoryString OPTIONAL,
//   partyName     [1]  UnboundedDirectoryString,
//   ... }
// ```
//
//
type EDIPartyName struct {
	NameAssigner UnboundedDirectoryString `asn1:"optional,tag:0"`
	PartyName    UnboundedDirectoryString `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION EDIPartyName */ /* START_OF_SYMBOL_DEFINITION AttributesSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AttributesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
// ```
type AttributesSyntax = [](Attribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AttributesSyntax */ /* START_OF_SYMBOL_DEFINITION BasicConstraintsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// BasicConstraintsSyntax ::= SEQUENCE {
//   cA                 BOOLEAN DEFAULT FALSE,
//   pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
//   ... }
// ```
//
//
type BasicConstraintsSyntax struct {
	CA                bool `asn1:"optional"`
	PathLenConstraint int  `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION BasicConstraintsSyntax */ /* START_OF_SYMBOL_DEFINITION NameConstraintsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// NameConstraintsSyntax ::= SEQUENCE {
//   permittedSubtrees  [0]  GeneralSubtrees OPTIONAL,
//   excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., permittedSubtrees  PRESENT } |
//    WITH COMPONENTS {..., excludedSubtrees   PRESENT } )
// ```
//
//
type NameConstraintsSyntax struct {
	PermittedSubtrees GeneralSubtrees `asn1:"optional,tag:0"`
	ExcludedSubtrees  GeneralSubtrees `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION NameConstraintsSyntax */ /* START_OF_SYMBOL_DEFINITION GeneralSubtrees */
// ### ASN.1 Definition:
//
// ```asn1
// GeneralSubtrees  ::=  SEQUENCE SIZE (1..MAX) OF GeneralSubtree
// ```
type GeneralSubtrees = [](GeneralSubtree) // SequenceOfType
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
type GeneralSubtree struct {
	Base    GeneralName
	Minimum BaseDistance `asn1:"optional,tag:0"`
	Maximum BaseDistance `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION GeneralSubtree */ /* START_OF_SYMBOL_DEFINITION BaseDistance */
// ### ASN.1 Definition:
//
// ```asn1
// BaseDistance  ::=  INTEGER(0..MAX)
// ```
// type BaseDistance = int64
/* END_OF_SYMBOL_DEFINITION BaseDistance */ /* START_OF_SYMBOL_DEFINITION PolicyConstraintsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyConstraintsSyntax ::= SEQUENCE {
//   requireExplicitPolicy  [0]  SkipCerts OPTIONAL,
//   inhibitPolicyMapping   [1]  SkipCerts OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., requireExplicitPolicy PRESENT } |
//    WITH COMPONENTS {..., inhibitPolicyMapping  PRESENT } )
// ```
//
//
type PolicyConstraintsSyntax struct {
	RequireExplicitPolicy SkipCerts `asn1:"optional,tag:0"`
	InhibitPolicyMapping  SkipCerts `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION PolicyConstraintsSyntax */ /* START_OF_SYMBOL_DEFINITION SkipCerts */
// ### ASN.1 Definition:
//
// ```asn1
// SkipCerts  ::=  INTEGER(0..MAX)
// ```
type SkipCerts = int64

/* END_OF_SYMBOL_DEFINITION SkipCerts */ /* START_OF_SYMBOL_DEFINITION CRLNumber */
// ### ASN.1 Definition:
//
// ```asn1
// CRLNumber  ::=  INTEGER(0..MAX)
// ```
type CRLNumber = int64

/* END_OF_SYMBOL_DEFINITION CRLNumber */ /* START_OF_SYMBOL_DEFINITION CRLScopeSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// CRLScopeSyntax  ::=  SEQUENCE SIZE (1..MAX) OF PerAuthorityScope
// ```
type CRLScopeSyntax = [](PerAuthorityScope) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CRLScopeSyntax */ /* START_OF_SYMBOL_DEFINITION PerAuthorityScope */
// ### ASN.1 Definition:
//
// ```asn1
// PerAuthorityScope ::= SEQUENCE {
//   authorityName       [0]  GeneralName OPTIONAL,
//   distributionPoint   [1]  DistributionPointName OPTIONAL,
//   onlyContains        [2]  OnlyCertificateTypes OPTIONAL,
//   onlySomeReasons     [4]  ReasonFlags OPTIONAL,
//   serialNumberRange   [5]  NumberRange OPTIONAL,
//   subjectKeyIdRange   [6]  NumberRange OPTIONAL,
//   nameSubtrees        [7]  GeneralNames OPTIONAL,
//   baseRevocationInfo  [9]  BaseRevocationInfo OPTIONAL,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION PerAuthorityScope */ /* START_OF_SYMBOL_DEFINITION OnlyCertificateTypes */
// ### ASN.1 Definition:
//
// ```asn1
// OnlyCertificateTypes  ::=  BIT STRING {
//   user      (0),
//   authority (1),
//   attribute (2)}
// ```
type OnlyCertificateTypes = asn1.BitString

/* END_OF_SYMBOL_DEFINITION OnlyCertificateTypes */

/* START_OF_SYMBOL_DEFINITION OnlyCertificateTypes_User */
const OnlyCertificateTypes_User int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION OnlyCertificateTypes_User */

/* START_OF_SYMBOL_DEFINITION OnlyCertificateTypes_Authority */
const OnlyCertificateTypes_Authority int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION OnlyCertificateTypes_Authority */

/* START_OF_SYMBOL_DEFINITION OnlyCertificateTypes_Attribute */
const OnlyCertificateTypes_Attribute int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION OnlyCertificateTypes_Attribute */ /* START_OF_SYMBOL_DEFINITION NumberRange */
// ### ASN.1 Definition:
//
// ```asn1
// NumberRange ::= SEQUENCE {
//   startingNumber  [0]  INTEGER OPTIONAL,
//   endingNumber    [1]  INTEGER OPTIONAL,
//   modulus              INTEGER OPTIONAL,
//   ... }
// ```
//
//
type NumberRange struct {
	StartingNumber int `asn1:"optional,tag:0"`
	EndingNumber   int `asn1:"optional,tag:1"`
	Modulus        int `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION NumberRange */ /* START_OF_SYMBOL_DEFINITION BaseRevocationInfo */
// ### ASN.1 Definition:
//
// ```asn1
// BaseRevocationInfo ::= SEQUENCE {
//   cRLStreamIdentifier  [0]  CRLStreamIdentifier OPTIONAL,
//   cRLNumber            [1]  CRLNumber,
//   baseThisUpdate       [2]  GeneralizedTime,
//   ... }
// ```
//
//
type BaseRevocationInfo struct {
	CRLStreamIdentifier CRLStreamIdentifier `asn1:"optional,tag:0"`
	CRLNumber           CRLNumber           `asn1:"tag:1"`
	BaseThisUpdate      time.Time           `asn1:"tag:2"`
}

/* END_OF_SYMBOL_DEFINITION BaseRevocationInfo */ /* START_OF_SYMBOL_DEFINITION StatusReferrals */
// ### ASN.1 Definition:
//
// ```asn1
// StatusReferrals  ::=  SEQUENCE SIZE (1..MAX) OF StatusReferral
// ```
type StatusReferrals = [](StatusReferral) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION StatusReferrals */ /* START_OF_SYMBOL_DEFINITION StatusReferral */
// ### ASN.1 Definition:
//
// ```asn1
// StatusReferral  ::=  CHOICE {
//   cRLReferral    [0]  CRLReferral,
//   otherReferral  [1]  INSTANCE OF OTHER-REFERRAL,
//   ... }
// ```
type StatusReferral = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION StatusReferral */ /* START_OF_SYMBOL_DEFINITION CRLReferral */
// ### ASN.1 Definition:
//
// ```asn1
// CRLReferral ::= SEQUENCE {
//   issuer          [0]  GeneralName OPTIONAL,
//   location        [1]  GeneralName OPTIONAL,
//   deltaRefInfo    [2]  DeltaRefInfo OPTIONAL,
//   cRLScope             CRLScopeSyntax,
//   lastUpdate      [3]  GeneralizedTime OPTIONAL,
//   lastChangedCRL  [4]  GeneralizedTime OPTIONAL,
//   ...
// }
// ```
//
//
type CRLReferral struct {
	Issuer         GeneralName  `asn1:"optional,tag:0"`
	Location       GeneralName  `asn1:"optional,tag:1"`
	DeltaRefInfo   DeltaRefInfo `asn1:"optional,tag:2"`
	CRLScope       CRLScopeSyntax
	LastUpdate     time.Time `asn1:"optional,tag:3"`
	LastChangedCRL time.Time `asn1:"optional,tag:4"`
}

/* END_OF_SYMBOL_DEFINITION CRLReferral */ /* START_OF_SYMBOL_DEFINITION DeltaRefInfo */
// ### ASN.1 Definition:
//
// ```asn1
// DeltaRefInfo ::= SEQUENCE {
//   deltaLocation  GeneralName,
//   lastDelta      GeneralizedTime OPTIONAL,
//   ... }
// ```
//
//
type DeltaRefInfo struct {
	DeltaLocation GeneralName
	LastDelta     time.Time `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION DeltaRefInfo */ /* START_OF_SYMBOL_DEFINITION CRLStreamIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// CRLStreamIdentifier  ::=  INTEGER (0..MAX)
// ```
type CRLStreamIdentifier = int64

/* END_OF_SYMBOL_DEFINITION CRLStreamIdentifier */ /* START_OF_SYMBOL_DEFINITION OrderedListSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// OrderedListSyntax  ::=  ENUMERATED {
//   ascSerialNum (0),
//   ascRevDate   (1),
//   ...}
// ```
type OrderedListSyntax = asn1.Enumerated

const (
	OrderedListSyntax_AscSerialNum OrderedListSyntax = 0 // LONG_NAMED_ENUMERATED_VALUE,
	OrderedListSyntax_AscRevDate   OrderedListSyntax = 1 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION OrderedListSyntax */ /* START_OF_SYMBOL_DEFINITION DeltaInformation */
// ### ASN.1 Definition:
//
// ```asn1
// DeltaInformation ::= SEQUENCE {
//   deltaLocation  GeneralName,
//   nextDelta      GeneralizedTime OPTIONAL,
//   ... }
// ```
//
//
type DeltaInformation struct {
	DeltaLocation GeneralName
	NextDelta     time.Time `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION DeltaInformation */ /* START_OF_SYMBOL_DEFINITION ToBeRevokedSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// ToBeRevokedSyntax  ::=  SEQUENCE SIZE (1..MAX) OF ToBeRevokedGroup
// ```
type ToBeRevokedSyntax = [](ToBeRevokedGroup) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ToBeRevokedSyntax */ /* START_OF_SYMBOL_DEFINITION ToBeRevokedGroup */
// ### ASN.1 Definition:
//
// ```asn1
// ToBeRevokedGroup ::= SEQUENCE {
//   certificateIssuer  [0]  GeneralName OPTIONAL,
//   reasonInfo         [1]  ReasonInfo OPTIONAL,
//   revocationTime          GeneralizedTime,
//   certificateGroup        CertificateGroup,
//   ... }
// ```
//
//
type ToBeRevokedGroup struct {
	CertificateIssuer GeneralName `asn1:"optional,tag:0"`
	ReasonInfo        ReasonInfo  `asn1:"optional,tag:1"`
	RevocationTime    time.Time
	CertificateGroup  CertificateGroup
}

/* END_OF_SYMBOL_DEFINITION ToBeRevokedGroup */ /* START_OF_SYMBOL_DEFINITION ReasonInfo */
// ### ASN.1 Definition:
//
// ```asn1
// ReasonInfo ::= SEQUENCE {
//   reasonCode           CRLReason,
//   holdInstructionCode  HoldInstruction OPTIONAL,
//   ... }
// ```
//
//
type ReasonInfo struct {
	ReasonCode          CRLReason
	HoldInstructionCode HoldInstruction `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION ReasonInfo */ /* START_OF_SYMBOL_DEFINITION CertificateGroup */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateGroup  ::=  CHOICE {
//   serialNumbers      [0]  CertificateSerialNumbers,
//   serialNumberRange  [1]  CertificateGroupNumberRange,
//   nameSubtree        [2]  GeneralName,
//   ... }
// ```
type CertificateGroup = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertificateGroup */ /* START_OF_SYMBOL_DEFINITION CertificateGroupNumberRange */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateGroupNumberRange ::= SEQUENCE {
//   startingNumber  [0]  INTEGER,
//   endingNumber    [1]  INTEGER,
//   ... }
// ```
//
//
type CertificateGroupNumberRange struct {
	StartingNumber int `asn1:"tag:0"`
	EndingNumber   int `asn1:"tag:1"`
}

/* END_OF_SYMBOL_DEFINITION CertificateGroupNumberRange */ /* START_OF_SYMBOL_DEFINITION CertificateSerialNumbers */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateSerialNumbers  ::=  SEQUENCE SIZE (1..MAX) OF CertificateSerialNumber
// ```
type CertificateSerialNumbers = [](CertificateSerialNumber) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertificateSerialNumbers */ /* START_OF_SYMBOL_DEFINITION RevokedGroupsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// RevokedGroupsSyntax  ::=  SEQUENCE SIZE (1..MAX) OF RevokedGroup
// ```
type RevokedGroupsSyntax = [](RevokedGroup) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION RevokedGroupsSyntax */ /* START_OF_SYMBOL_DEFINITION RevokedGroup */
// ### ASN.1 Definition:
//
// ```asn1
// RevokedGroup ::= SEQUENCE {
//   certificateIssuer        [0]  GeneralName OPTIONAL,
//   reasonInfo               [1]  ReasonInfo OPTIONAL,
//   invalidityDate           [2]  GeneralizedTime OPTIONAL,
//   revokedcertificateGroup  [3]  RevokedCertificateGroup,
//   ... }
// ```
//
//
type RevokedGroup struct {
	CertificateIssuer       GeneralName             `asn1:"optional,tag:0"`
	ReasonInfo              ReasonInfo              `asn1:"optional,tag:1"`
	InvalidityDate          time.Time               `asn1:"optional,tag:2"`
	RevokedcertificateGroup RevokedCertificateGroup `asn1:"tag:3"`
}

/* END_OF_SYMBOL_DEFINITION RevokedGroup */ /* START_OF_SYMBOL_DEFINITION RevokedCertificateGroup */
// ### ASN.1 Definition:
//
// ```asn1
// RevokedCertificateGroup  ::=  CHOICE {
//   serialNumberRange  NumberRange,
//   nameSubtree        GeneralName }
// ```
type RevokedCertificateGroup = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION RevokedCertificateGroup */ /* START_OF_SYMBOL_DEFINITION ExpiredCertsOnCRL */
// ### ASN.1 Definition:
//
// ```asn1
// ExpiredCertsOnCRL  ::=  GeneralizedTime
// ```
type ExpiredCertsOnCRL = time.Time // GeneralizedTime
/* END_OF_SYMBOL_DEFINITION ExpiredCertsOnCRL */ /* START_OF_SYMBOL_DEFINITION CRLReason */
// ### ASN.1 Definition:
//
// ```asn1
// CRLReason  ::=  ENUMERATED {
//   unspecified          (0),
//   keyCompromise        (1),
//   cACompromise         (2),
//   affiliationChanged   (3),
//   superseded           (4),
//   cessationOfOperation (5),
//   certificateHold      (6),
//   removeFromCRL        (8),
//   privilegeWithdrawn   (9),
//   aACompromise         (10),
//   ...,
//   weakAlgorithmOrKey   (11) }
// ```
type CRLReason = asn1.Enumerated

const (
	CRLReason_Unspecified          CRLReason = 0  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_KeyCompromise        CRLReason = 1  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_CACompromise         CRLReason = 2  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_AffiliationChanged   CRLReason = 3  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_Superseded           CRLReason = 4  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_CessationOfOperation CRLReason = 5  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_CertificateHold      CRLReason = 6  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_RemoveFromCRL        CRLReason = 8  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_PrivilegeWithdrawn   CRLReason = 9  // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_AACompromise         CRLReason = 10 // LONG_NAMED_ENUMERATED_VALUE,
	CRLReason_WeakAlgorithmOrKey   CRLReason = 11 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CRLReason */ /* START_OF_SYMBOL_DEFINITION HoldInstruction */
// ### ASN.1 Definition:
//
// ```asn1
// HoldInstruction  ::=  OBJECT IDENTIFIER
// ```
type HoldInstruction = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION HoldInstruction */ /* START_OF_SYMBOL_DEFINITION CRLDistPointsSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// CRLDistPointsSyntax  ::=  SEQUENCE SIZE (1..MAX) OF DistributionPoint
// ```
type CRLDistPointsSyntax = [](DistributionPoint) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CRLDistPointsSyntax */ /* START_OF_SYMBOL_DEFINITION DistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// DistributionPoint ::= SEQUENCE {
//   distributionPoint  [0]  DistributionPointName OPTIONAL,
//   reasons            [1]  ReasonFlags OPTIONAL,
//   cRLIssuer          [2]  GeneralNames OPTIONAL,
//   ... }
// ```
//
//
type DistributionPoint struct {
	DistributionPoint DistributionPointName `asn1:"optional,tag:0"`
	Reasons           ReasonFlags           `asn1:"optional,tag:1"`
	CRLIssuer         GeneralNames          `asn1:"optional,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION DistributionPoint */ /* START_OF_SYMBOL_DEFINITION DistributionPointName */
// ### ASN.1 Definition:
//
// ```asn1
// DistributionPointName  ::=  CHOICE {
//   fullName                 [0]  GeneralNames,
//   nameRelativeToCRLIssuer  [1]  RelativeDistinguishedName,
//   ... }
// ```
type DistributionPointName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DistributionPointName */ /* START_OF_SYMBOL_DEFINITION ReasonFlags */
// ### ASN.1 Definition:
//
// ```asn1
// ReasonFlags  ::=  BIT STRING {
//   unused                (0),
//   keyCompromise         (1),
//   cACompromise          (2),
//   affiliationChanged    (3),
//   superseded            (4),
//   cessationOfOperation  (5),
//   certificateHold       (6),
//   privilegeWithdrawn    (7),
//   aACompromise          (8),
//   weakAlgorithmOrKey    (9) }
// ```
type ReasonFlags = asn1.BitString

/* END_OF_SYMBOL_DEFINITION ReasonFlags */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_Unused */
const ReasonFlags_Unused int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_Unused */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_KeyCompromise */
const ReasonFlags_KeyCompromise int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_KeyCompromise */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_CACompromise */
const ReasonFlags_CACompromise int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_CACompromise */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_AffiliationChanged */
const ReasonFlags_AffiliationChanged int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_AffiliationChanged */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_Superseded */
const ReasonFlags_Superseded int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_Superseded */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_CessationOfOperation */
const ReasonFlags_CessationOfOperation int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_CessationOfOperation */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_CertificateHold */
const ReasonFlags_CertificateHold int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_CertificateHold */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_PrivilegeWithdrawn */
const ReasonFlags_PrivilegeWithdrawn int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_PrivilegeWithdrawn */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_AACompromise */
const ReasonFlags_AACompromise int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_AACompromise */

/* START_OF_SYMBOL_DEFINITION ReasonFlags_WeakAlgorithmOrKey */
const ReasonFlags_WeakAlgorithmOrKey int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ReasonFlags_WeakAlgorithmOrKey */ /* START_OF_SYMBOL_DEFINITION IssuingDistPointSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// IssuingDistPointSyntax ::= SEQUENCE {
//   -- If onlyContainsUserPublicKeyCerts and onlyContainsCACerts are both FALSE,
//   -- the CRL covers both public-key certificate types
//   distributionPoint               [0]  DistributionPointName OPTIONAL,
//   onlyContainsUserPublicKeyCerts  [1]  BOOLEAN DEFAULT FALSE,
//   onlyContainsCACerts             [2]  BOOLEAN DEFAULT FALSE,
//   onlySomeReasons                 [3]  ReasonFlags OPTIONAL,
//   indirectCRL                     [4]  BOOLEAN DEFAULT FALSE,
//   onlyContainsAttributeCerts      [5]  BOOLEAN OPTIONAL, -- Use is strongly deprecated
//   ... }
// ```
//
//
type IssuingDistPointSyntax struct {
	DistributionPoint              DistributionPointName `asn1:"optional,tag:0"`
	OnlyContainsUserPublicKeyCerts bool                  `asn1:"optional,tag:1"`
	OnlyContainsCACerts            bool                  `asn1:"optional,tag:2"`
	OnlySomeReasons                ReasonFlags           `asn1:"optional,tag:3"`
	IndirectCRL                    bool                  `asn1:"optional,tag:4"`
	OnlyContainsAttributeCerts     bool                  `asn1:"optional,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION IssuingDistPointSyntax */ /* START_OF_SYMBOL_DEFINITION BaseCRLNumber */
// ### ASN.1 Definition:
//
// ```asn1
// BaseCRLNumber  ::=  CRLNumber
// ```
type BaseCRLNumber = CRLNumber // DefinedType
/* END_OF_SYMBOL_DEFINITION BaseCRLNumber */ /* START_OF_SYMBOL_DEFINITION ProtRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// ProtRestriction  ::=  SEQUENCE (SIZE (1..MAX)) OF OBJECT IDENTIFIER
// ```
type ProtRestriction = [](asn1.ObjectIdentifier) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ProtRestriction */ /* START_OF_SYMBOL_DEFINITION SubjectAltPublicKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// SubjectAltPublicKeyInfo ::= SEQUENCE {
//   algorithm              AlgorithmIdentifier{{SupportedAlgorithms}},
//   subjectAltPublicKey    BIT STRING }
// ```
//
//
type SubjectAltPublicKeyInfo struct {
	Algorithm           pkix.AlgorithmIdentifier
	SubjectAltPublicKey asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION SubjectAltPublicKeyInfo */ /* START_OF_SYMBOL_DEFINITION AltSignatureAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// AltSignatureAlgorithm  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
// ```
type AltSignatureAlgorithm = pkix.AlgorithmIdentifier // DefinedType
/* END_OF_SYMBOL_DEFINITION AltSignatureAlgorithm */ /* START_OF_SYMBOL_DEFINITION AltSignatureValue */
// ### ASN.1 Definition:
//
// ```asn1
// AltSignatureValue  ::=  BIT STRING
// ```
type AltSignatureValue = asn1.BitString

/* END_OF_SYMBOL_DEFINITION AltSignatureValue */ /* START_OF_SYMBOL_DEFINITION AAIssuingDistPointSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AAIssuingDistPointSyntax ::= SEQUENCE {
//   distributionPoint           [0]  DistributionPointName OPTIONAL,
//   onlySomeReasons             [1]  ReasonFlags OPTIONAL,
//   indirectCRL                 [2]  BOOLEAN DEFAULT FALSE,
//   containsUserAttributeCerts  [3]  BOOLEAN DEFAULT TRUE,
//   containsAACerts             [4]  BOOLEAN DEFAULT TRUE,
//   containsSOAPublicKeyCerts   [5]  BOOLEAN DEFAULT TRUE,
//   ... }
// ```
//
//
type AAIssuingDistPointSyntax struct {
	DistributionPoint          DistributionPointName `asn1:"optional,tag:0"`
	OnlySomeReasons            ReasonFlags           `asn1:"optional,tag:1"`
	IndirectCRL                bool                  `asn1:"optional,tag:2"`
	ContainsUserAttributeCerts bool                  `asn1:"optional,tag:3"`
	ContainsAACerts            bool                  `asn1:"optional,tag:4"`
	ContainsSOAPublicKeyCerts  bool                  `asn1:"optional,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION AAIssuingDistPointSyntax */ /* START_OF_SYMBOL_DEFINITION CertificateExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateExactAssertion ::= SEQUENCE {
//   serialNumber  CertificateSerialNumber,
//   issuer        Name,
//   ... }
// ```
//
//
type CertificateExactAssertion struct {
	SerialNumber CertificateSerialNumber
	Issuer       Name
}

/* END_OF_SYMBOL_DEFINITION CertificateExactAssertion */ /* START_OF_SYMBOL_DEFINITION CertificateAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateAssertion ::= SEQUENCE {
//   serialNumber            [0]  CertificateSerialNumber OPTIONAL,
//   issuer                  [1]  Name OPTIONAL,
//   subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
//   authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//   certificateValid        [4]  Time OPTIONAL,
//   privateKeyValid         [5]  GeneralizedTime OPTIONAL,
//   subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
//   keyUsage                [7]  KeyUsage OPTIONAL,
//   subjectAltName          [8]  AltNameType OPTIONAL,
//   policy                  [9]  CertPolicySet OPTIONAL,
//   pathToName              [10] Name OPTIONAL,
//   subject                 [11] Name OPTIONAL,
//   nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION CertificateAssertion */ /* START_OF_SYMBOL_DEFINITION AltNameType */
// ### ASN.1 Definition:
//
// ```asn1
// AltNameType  ::=  CHOICE {
//   builtinNameForm  ENUMERATED {
//     rfc822Name                (1),
//     dNSName                   (2),
//     x400Address               (3),
//     directoryName             (4),
//     ediPartyName              (5),
//     uniformResourceIdentifier (6),
//     iPAddress                 (7),
//     registeredId              (8),
//     ...},
//   otherNameForm    OBJECT IDENTIFIER,
//   ... }
// ```
type AltNameType = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AltNameType */ /* START_OF_SYMBOL_DEFINITION CertPolicySet */
// ### ASN.1 Definition:
//
// ```asn1
// CertPolicySet  ::=  SEQUENCE SIZE (1..MAX) OF CertPolicyId
// ```
type CertPolicySet = [](CertPolicyId) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertPolicySet */ /* START_OF_SYMBOL_DEFINITION CertificatePairExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificatePairExactAssertion ::= SEQUENCE {
//   issuedToThisCAAssertion  [0]  CertificateExactAssertion OPTIONAL,
//   issuedByThisCAAssertion  [1]  CertificateExactAssertion OPTIONAL,
//   ... }
//   (WITH COMPONENTS { ..., issuedToThisCAAssertion  PRESENT } |
//    WITH COMPONENTS { ..., issuedByThisCAAssertion  PRESENT } )
// ```
//
//
type CertificatePairExactAssertion struct {
	IssuedToThisCAAssertion CertificateExactAssertion `asn1:"optional,tag:0"`
	IssuedByThisCAAssertion CertificateExactAssertion `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION CertificatePairExactAssertion */ /* START_OF_SYMBOL_DEFINITION CertificatePairAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificatePairAssertion ::= SEQUENCE {
//   issuedToThisCAAssertion  [0]  CertificateAssertion OPTIONAL,
//   issuedByThisCAAssertion  [1]  CertificateAssertion OPTIONAL,
//   ... }
//   (WITH COMPONENTS {..., issuedToThisCAAssertion  PRESENT } |
//    WITH COMPONENTS {..., issuedByThisCAAssertion  PRESENT } )
// ```
//
//
type CertificatePairAssertion struct {
	IssuedToThisCAAssertion CertificateAssertion `asn1:"optional,tag:0"`
	IssuedByThisCAAssertion CertificateAssertion `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION CertificatePairAssertion */ /* START_OF_SYMBOL_DEFINITION CertificateListExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateListExactAssertion ::= SEQUENCE {
//   issuer             Name,
//   thisUpdate         Time,
//   distributionPoint  DistributionPointName OPTIONAL }
// ```
//
//
type CertificateListExactAssertion struct {
	Issuer            Name
	ThisUpdate        Time
	DistributionPoint DistributionPointName `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION CertificateListExactAssertion */ /* START_OF_SYMBOL_DEFINITION CertificateListAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateListAssertion ::= SEQUENCE {
//   issuer                       Name                   OPTIONAL,
//   minCRLNumber            [0]  CRLNumber              OPTIONAL,
//   maxCRLNumber            [1]  CRLNumber              OPTIONAL,
//   reasonFlags                  ReasonFlags            OPTIONAL,
//   dateAndTime                  Time                   OPTIONAL,
//   distributionPoint       [2]  DistributionPointName  OPTIONAL,
//   authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//   ... }
// ```
//
//
type CertificateListAssertion struct {
	Issuer                 Name                   `asn1:"optional"`
	MinCRLNumber           CRLNumber              `asn1:"optional,tag:0"`
	MaxCRLNumber           CRLNumber              `asn1:"optional,tag:1"`
	ReasonFlags            ReasonFlags            `asn1:"optional"`
	DateAndTime            Time                   `asn1:"optional"`
	DistributionPoint      DistributionPointName  `asn1:"optional,tag:2"`
	AuthorityKeyIdentifier AuthorityKeyIdentifier `asn1:"optional,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION CertificateListAssertion */ /* START_OF_SYMBOL_DEFINITION PkiPathMatchSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// PkiPathMatchSyntax ::= SEQUENCE {
//   firstIssuer  Name,
//   lastSubject  Name,
//   ... }
// ```
//
//
type PkiPathMatchSyntax struct {
	FirstIssuer Name
	LastSubject Name
}

/* END_OF_SYMBOL_DEFINITION PkiPathMatchSyntax */ /* START_OF_SYMBOL_DEFINITION EnhancedCertificateAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// EnhancedCertificateAssertion ::= SEQUENCE {
//   serialNumber            [0]  CertificateSerialNumber OPTIONAL,
//   issuer                  [1]  Name OPTIONAL,
//   subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
//   authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
//   certificateValid        [4]  Time OPTIONAL,
//   privateKeyValid         [5]  GeneralizedTime OPTIONAL,
//   subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
//   keyUsage                [7]  KeyUsage OPTIONAL,
//   subjectAltName          [8]  AltName OPTIONAL,
//   policy                  [9]  CertPolicySet OPTIONAL,
//   pathToName              [10] GeneralNames OPTIONAL,
//   subject                 [11] Name OPTIONAL,
//   nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
//   ... }
//   (ALL EXCEPT ({ -- none; at least one component shall be present --}))
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION EnhancedCertificateAssertion */ /* START_OF_SYMBOL_DEFINITION AltName */
// ### ASN.1 Definition:
//
// ```asn1
// AltName ::= SEQUENCE {
//   altnameType   AltNameType,
//   altNameValue  GeneralName OPTIONAL }
// ```
//
//
type AltName struct {
	AltnameType  AltNameType
	AltNameValue GeneralName `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AltName */ /* START_OF_SYMBOL_DEFINITION Id_ce_subjectDirectoryAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9}
// ```
//
//
var Id_ce_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_subjectDirectoryAttributes */ /* START_OF_SYMBOL_DEFINITION Id_ce_subjectKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14}
// ```
//
//
var Id_ce_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_subjectKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_keyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15}
// ```
//
//
var Id_ce_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_keyUsage */ /* START_OF_SYMBOL_DEFINITION Id_ce_privateKeyUsagePeriod */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16}
// ```
//
//
var Id_ce_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_privateKeyUsagePeriod */ /* START_OF_SYMBOL_DEFINITION Id_ce_subjectAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17}
// ```
//
//
var Id_ce_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_subjectAltName */ /* START_OF_SYMBOL_DEFINITION Id_ce_issuerAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18}
// ```
//
//
var Id_ce_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_issuerAltName */ /* START_OF_SYMBOL_DEFINITION Id_ce_basicConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19}
// ```
//
//
var Id_ce_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_basicConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_cRLNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20}
// ```
//
//
var Id_ce_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_cRLNumber */ /* START_OF_SYMBOL_DEFINITION Id_ce_reasonCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21}
// ```
//
//
var Id_ce_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_reasonCode */ /* START_OF_SYMBOL_DEFINITION Id_ce_holdInstructionCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23}
// ```
//
//
var Id_ce_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_holdInstructionCode */ /* START_OF_SYMBOL_DEFINITION Id_ce_invalidityDate */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24}
// ```
//
//
var Id_ce_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_invalidityDate */ /* START_OF_SYMBOL_DEFINITION Id_ce_deltaCRLIndicator */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27}
// ```
//
//
var Id_ce_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_deltaCRLIndicator */ /* START_OF_SYMBOL_DEFINITION Id_ce_issuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28}
// ```
//
//
var Id_ce_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_issuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_ce_certificateIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29}
// ```
//
//
var Id_ce_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_certificateIssuer */ /* START_OF_SYMBOL_DEFINITION Id_ce_nameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30}
// ```
//
//
var Id_ce_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_nameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_cRLDistributionPoints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31}
// ```
//
//
var Id_ce_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_cRLDistributionPoints */ /* START_OF_SYMBOL_DEFINITION Id_ce_certificatePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32}
// ```
//
//
var Id_ce_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_certificatePolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_policyMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33}
// ```
//
//
var Id_ce_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_policyMappings */ /* START_OF_SYMBOL_DEFINITION Id_ce_authorityKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35}
// ```
//
//
var Id_ce_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_authorityKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_policyConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36}
// ```
//
//
var Id_ce_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_policyConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_extKeyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37}
// ```
//
//
var Id_ce_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_extKeyUsage */ /* START_OF_SYMBOL_DEFINITION Id_ce_cRLStreamIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40}
// ```
//
//
var Id_ce_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_cRLStreamIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_cRLScope */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44}
// ```
//
//
var Id_ce_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_cRLScope */ /* START_OF_SYMBOL_DEFINITION Id_ce_statusReferrals */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45}
// ```
//
//
var Id_ce_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_statusReferrals */ /* START_OF_SYMBOL_DEFINITION Id_ce_freshestCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46}
// ```
//
//
var Id_ce_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_freshestCRL */ /* START_OF_SYMBOL_DEFINITION Id_ce_orderedList */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47}
// ```
//
//
var Id_ce_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_orderedList */ /* START_OF_SYMBOL_DEFINITION Id_ce_baseUpdateTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51}
// ```
//
//
var Id_ce_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_baseUpdateTime */ /* START_OF_SYMBOL_DEFINITION Id_ce_deltaInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53}
// ```
//
//
var Id_ce_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_deltaInfo */ /* START_OF_SYMBOL_DEFINITION Id_ce_inhibitAnyPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54}
// ```
//
//
var Id_ce_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_inhibitAnyPolicy */ /* START_OF_SYMBOL_DEFINITION Id_ce_toBeRevoked */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58}
// ```
//
//
var Id_ce_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_toBeRevoked */ /* START_OF_SYMBOL_DEFINITION Id_ce_revokedGroups */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59}
// ```
//
//
var Id_ce_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_revokedGroups */ /* START_OF_SYMBOL_DEFINITION Id_ce_expiredCertsOnCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60}
// ```
//
//
var Id_ce_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_expiredCertsOnCRL */ /* START_OF_SYMBOL_DEFINITION Id_ce_aAissuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63}
// ```
//
//
var Id_ce_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_aAissuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_ce_authorizationValidation */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70}
// ```
//
//
var Id_ce_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_authorizationValidation */ /* START_OF_SYMBOL_DEFINITION Id_ce_protRestrict */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71}
// ```
//
//
var Id_ce_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_protRestrict */ /* START_OF_SYMBOL_DEFINITION Id_ce_subjectAltPublicKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72}
// ```
//
//
var Id_ce_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_subjectAltPublicKeyInfo */ /* START_OF_SYMBOL_DEFINITION Id_ce_altSignatureAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73}
// ```
//
//
var Id_ce_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_altSignatureAlgorithm */ /* START_OF_SYMBOL_DEFINITION Id_ce_altSignatureValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74}
// ```
//
//
var Id_ce_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_altSignatureValue */ /* START_OF_SYMBOL_DEFINITION Id_ce_associatedInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-associatedInformation              OBJECT IDENTIFIER ::= {id-ce 75}
// ```
//
//
var Id_ce_associatedInformation asn1.ObjectIdentifier = []int{2, 5, 29, 75} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_associatedInformation */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificateExactMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificateExactMatch       OBJECT IDENTIFIER ::= {id-mr 34}
// ```
//
//
var Id_mr_certificateExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificateExactMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificateMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificateMatch            OBJECT IDENTIFIER ::= {id-mr 35}
// ```
//
//
var Id_mr_certificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificateMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificatePairExactMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificatePairExactMatch   OBJECT IDENTIFIER ::= {id-mr 36}
// ```
//
//
var Id_mr_certificatePairExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificatePairExactMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificatePairMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificatePairMatch        OBJECT IDENTIFIER ::= {id-mr 37}
// ```
//
//
var Id_mr_certificatePairMatch asn1.ObjectIdentifier = []int{2, 5, 13, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificatePairMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificateListExactMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificateListExactMatch   OBJECT IDENTIFIER ::= {id-mr 38}
// ```
//
//
var Id_mr_certificateListExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificateListExactMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_certificateListMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-certificateListMatch        OBJECT IDENTIFIER ::= {id-mr 39}
// ```
//
//
var Id_mr_certificateListMatch asn1.ObjectIdentifier = []int{2, 5, 13, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_certificateListMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_algorithmIdentifierMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-algorithmIdentifierMatch    OBJECT IDENTIFIER ::= {id-mr 40}
// ```
//
//
var Id_mr_algorithmIdentifierMatch asn1.ObjectIdentifier = []int{2, 5, 13, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_algorithmIdentifierMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_policyMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-policyMatch                 OBJECT IDENTIFIER ::= {id-mr 60}
// ```
//
//
var Id_mr_policyMatch asn1.ObjectIdentifier = []int{2, 5, 13, 60} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_policyMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_pkiPathMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-pkiPathMatch                OBJECT IDENTIFIER ::= {id-mr 62}
// ```
//
//
var Id_mr_pkiPathMatch asn1.ObjectIdentifier = []int{2, 5, 13, 62} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_pkiPathMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_enhancedCertificateMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-enhancedCertificateMatch    OBJECT IDENTIFIER ::= {id-mr 65}
// ```
//
//
var Id_mr_enhancedCertificateMatch asn1.ObjectIdentifier = []int{2, 5, 13, 65} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_enhancedCertificateMatch */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certExactAssertion         OBJECT IDENTIFIER ::= {id-ldx 1}
// ```
//
//
var Id_ldx_certExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certExactAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certAssertion              OBJECT IDENTIFIER ::= {id-ldx 2}
// ```
//
//
var Id_ldx_certAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certPairExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certPairExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 3}
// ```
//
//
var Id_ldx_certPairExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certPairExactAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certPairAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certPairAssertion          OBJECT IDENTIFIER ::= {id-ldx 4}
// ```
//
//
var Id_ldx_certPairAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certPairAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certListExactAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certListExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 5}
// ```
//
//
var Id_ldx_certListExactAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certListExactAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_certListAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-certListAssertion          OBJECT IDENTIFIER ::= {id-ldx 6}
// ```
//
//
var Id_ldx_certListAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_certListAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ldx_algorithmIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx-algorithmIdentifier        OBJECT IDENTIFIER ::= {id-ldx 7}
// ```
//
//
var Id_ldx_algorithmIdentifier asn1.ObjectIdentifier = []int{1, 3, 6, 1, 1, 15, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ldx_algorithmIdentifier */ /* START_OF_SYMBOL_DEFINITION PolicyMappingsSyntax_Item */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyMappingsSyntax-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type PolicyMappingsSyntax_Item struct {
	IssuerDomainPolicy  CertPolicyId
	SubjectDomainPolicy CertPolicyId
}

/* END_OF_SYMBOL_DEFINITION PolicyMappingsSyntax_Item */ /* START_OF_SYMBOL_DEFINITION AltNameType_builtinNameForm */
// ### ASN.1 Definition:
//
// ```asn1
// AltNameType-builtinNameForm ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type AltNameType_builtinNameForm = asn1.Enumerated

const (
	AltNameType_builtinNameForm_Rfc822Name                AltNameType_builtinNameForm = 1 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_DNSName                   AltNameType_builtinNameForm = 2 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_X400Address               AltNameType_builtinNameForm = 3 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_DirectoryName             AltNameType_builtinNameForm = 4 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_EdiPartyName              AltNameType_builtinNameForm = 5 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_UniformResourceIdentifier AltNameType_builtinNameForm = 6 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_IPAddress                 AltNameType_builtinNameForm = 7 // LONG_NAMED_ENUMERATED_VALUE,
	AltNameType_builtinNameForm_RegisteredId              AltNameType_builtinNameForm = 8 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AltNameType_builtinNameForm */
