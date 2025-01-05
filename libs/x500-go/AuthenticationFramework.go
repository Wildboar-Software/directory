package x500_go

import (
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"math/big"
)

// # ASN.1 Definition:
//
//	SIGNATURE ::= SEQUENCE {
//	  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//	  signature            BIT STRING,
//	  ... }
type SIGNATURE struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Signature           asn1.BitString
}

// # ASN.1 Definition:
//
//	SIGNED{ToBeSigned} ::= SEQUENCE {
//	  toBeSigned              ToBeSigned,
//	  algorithmIdentifier     AlgorithmIdentifier{{SupportedAlgorithms}},
//	  signature               BIT STRING,
//	  ...,
//
// [[4:
//
//	altAlgorithmIdentifier  AlgorithmIdentifier{{SupportedAltAlgorithms}} OPTIONAL,
//	altSignature            BIT STRING OPTIONAL]]
//	} (WITH COMPONENTS {..., altAlgorithmIdentifier PRESENT, altSignature PRESENT } |
//	   WITH COMPONENTS {..., altAlgorithmIdentifier ABSENT,  altSignature ABSENT } )
type SIGNED struct {
	ToBeSigned          asn1.RawValue
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Signature           asn1.BitString
}

// # ASN.1 Definition:
//
//	HASH{ToBeHashed} ::= SEQUENCE {
//	  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//	  hashValue            BIT STRING (CONSTRAINED BY {
//	   -- shall be the result of applying a hashing procedure to the DER-encoded
//	   -- octets of a value of -- ToBeHashed } ),
//	  ... }
type HASH struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	HashValue           asn1.BitString
}

// # ASN.1 Definition:
//
//	ENCRYPTED{ToBeEnciphered} ::= BIT STRING (CONSTRAINED BY {
//	   -- shall be the result of applying an encipherment procedure
//	   -- to the BER-encoded octets of a value of -- ToBeEnciphered } )
type ENCRYPTED = asn1.BitString

// # ASN.1 Definition:
//
//	ENCRYPTED-HASH{ToBeSigned} ::= BIT STRING (CONSTRAINED BY {
//	  -- shall be the result of applying a hashing procedure to the DER-encoded (see 6.2)
//	  -- octets of a value of -- ToBeSigned -- and then applying an encipherment procedure
//	  -- to those octets -- } )
type ENCRYPTED_HASH = asn1.BitString

// # ASN.1 Definition:
//
//	FingerPrint {ToBeFingerprinted} ::= SEQUENCE {
//	  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//	  fingerprint          BIT STRING,
//	  ... }
type FingerPrint struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Fingerprint         asn1.BitString
}

// # ASN.1 Definition:
//
//	SupportedCurves OBJECT IDENTIFIER ::= {dummyCurv, ...}
type SupportedCurves = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	dummyCurv OBJECT IDENTIFIER ::= {2 5 5}
var DummyCurv asn1.ObjectIdentifier = []int{2, 5, 5}

// # ASN.1 Definition:
//
//	Version ::= INTEGER {v1(0), v2(1), v3(2)}
type Version = int64

const Version_V1 Version = 0

const Version_V2 Version = 1

const Version_V3 Version = 2

// # ASN.1 Definition:
//
//	CertificateSerialNumber ::= INTEGER
type CertificateSerialNumber = *big.Int

// # ASN.1 Definition:
//
//	Validity ::= SEQUENCE {
//	  notBefore  Time,
//	  notAfter   Time,
//	  ... }
type Validity struct {
	NotBefore X509Time
	NotAfter  X509Time
}

// # ASN.1 Definition:
//
//	SubjectPublicKeyInfo ::= SEQUENCE {
//	  algorithm         AlgorithmIdentifier{{SupportedAlgorithms}},
//	  subjectPublicKey  PublicKey,
//	  ... }
type SubjectPublicKeyInfo struct {
	Algorithm        pkix.AlgorithmIdentifier
	SubjectPublicKey PublicKey
}

// # ASN.1 Definition:
//
//	PublicKey ::= BIT STRING
type PublicKey = asn1.BitString

// # ASN.1 Definition:
//
//	Time ::= CHOICE {
//	  utcTime          UTCTime,
//	  generalizedTime  GeneralizedTime }
type X509Time = asn1.RawValue

// # ASN.1 Definition:
//
//	Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension
type Extensions = [](pkix.Extension)

// # ASN.1 Definition:
//
//	Certificates ::= SEQUENCE {
//	  userCertificate    Certificate,
//	  certificationPath  ForwardCertificationPath OPTIONAL,
//	  ... }
type Certificates struct {
	UserCertificate   x509.Certificate
	CertificationPath ForwardCertificationPath `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ForwardCertificationPath ::= SEQUENCE SIZE (1..MAX) OF CrossCertificates
type ForwardCertificationPath = [](CrossCertificates)

// # ASN.1 Definition:
//
//	CrossCertificates ::= SET SIZE (1..MAX) OF Certificate
type CrossCertificates = [](x509.Certificate)

// NOTE: `encoding/asn1` fails to re-encode Certificate fields.
// Use `CertificationPathRaw` instead.
//
// # ASN.1 Definition:
//
//	CertificationPath ::= SEQUENCE {
//	  userCertificate    Certificate,
//	  theCACertificates  SEQUENCE SIZE (1..MAX) OF CertificatePair OPTIONAL,
//	  ... }
type CertificationPath struct {
	UserCertificate   x509.Certificate
	TheCACertificates [](CertificatePair) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CertificationPath ::= SEQUENCE {
//	  userCertificate    Certificate,
//	  theCACertificates  SEQUENCE SIZE (1..MAX) OF CertificatePair OPTIONAL,
//	  ... }
type CertificationPathRaw struct {
	UserCertificate   asn1.RawValue
	TheCACertificates [](CertificatePairRaw) `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	PkiPath ::= SEQUENCE SIZE (1..MAX) OF Certificate
type PkiPath = [](x509.Certificate)

// # ASN.1 Definition:
//
//	CertAVL ::= SIGNED {TBSCertAVL}
type CertAVL = SIGNED

// # ASN.1 Definition:
//
//	TBSCertAVL ::= SEQUENCE {
//	  version               [0]  IMPLICIT Version DEFAULT v1,
//	  serialNumber               AvlSerialNumber OPTIONAL,
//	  signature                  AlgorithmIdentifier {{SupportedAlgorithms}},
//	  issuer                     Name,
//	  constrained                BOOLEAN,
//	  entries                    SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//	    idType                     CHOICE {
//	      certIdentifier        [0]  PKCertIdentifier,
//	      entityGroup                DistinguishedName, -- only for constrained = FALSE
//	      ... },
//	    scope                 [0]  IMPLICIT ScopeRestrictions OPTIONAL,
//	    entryExtensions       [1]  IMPLICIT Extensions OPTIONAL,
//	    ... },
//	  ...,
//	  ...,
//	  avlExtensions              Extensions OPTIONAL }
type TBSCertAVL struct {
	Version       Version         `asn1:"optional,tag:0"`
	SerialNumber  AvlSerialNumber `asn1:"optional"`
	Signature     pkix.AlgorithmIdentifier
	Issuer        Name
	Constrained   bool
	Entries       [](TBSCertAVL_entries_Item)
	AvlExtensions Extensions `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	AvlSerialNumber ::= INTEGER (0..MAX)
type AvlSerialNumber = *big.Int

// # ASN.1 Definition:
//
//	PKCertIdentifier ::= CHOICE {
//	  issuerSerialNumber         IssuerSerialNumber,
//	  fingerprintPKC        [0]  IMPLICIT FingerPrint {Certificate},
//	  fingerprintPK         [1]  IMPLICIT FingerPrint {PublicKey},
//	  ... }
type PKCertIdentifier = asn1.RawValue

// # ASN.1 Definition:
//
//	IssuerSerialNumber ::= SEQUENCE {
//	  issuer        Name,
//	  serialNumber  CertificateSerialNumber,
//	  ... }
type IssuerSerialNumber struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	ScopeRestrictions ::= SEQUENCE OF ScopeRestriction
type ScopeRestrictions = [](ScopeRestriction)

// # ASN.1 Definition:
//
//	ScopeRestriction ::= SEQUENCE {
//	  id            SCOPE-RESTRICTION.&id,
//	  restriction   SCOPE-RESTRICTION.&Type,
//	  ... }
type ScopeRestriction struct {
	Id          asn1.ObjectIdentifier
	Restriction asn1.RawValue
}

// NOTE: `encoding/asn1` fails to re-encode Certificate fields.
// Use `CertificatePairRaw` instead.
//
// # ASN.1 Definition:
//
//	CertificatePair ::= SEQUENCE {
//	  issuedToThisCA  [0]  Certificate OPTIONAL,
//	  issuedByThisCA  [1]  Certificate OPTIONAL,
//	  ... }
//	  (WITH COMPONENTS { ..., issuedToThisCA PRESENT} |
//	   WITH COMPONENTS { ..., issuedByThisCA PRESENT})
type CertificatePair struct {
	IssuedToThisCA x509.Certificate `asn1:"optional,explicit,tag:0"`
	IssuedByThisCA x509.Certificate `asn1:"optional,explicit,tag:1"`
}

type CertificatePairRaw struct {
	IssuedToThisCA asn1.RawValue `asn1:"optional,explicit,tag:0"`
	IssuedByThisCA asn1.RawValue `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	SupportedAlgorithm ::= SEQUENCE {
//	  algorithmIdentifier              AlgorithmIdentifier{{SupportedAlgorithms}},
//	  intendedUsage               [0]  KeyUsage OPTIONAL,
//	  intendedCertificatePolicies [1]  CertificatePoliciesSyntax OPTIONAL,
//	  ... }
type SupportedAlgorithm struct {
	AlgorithmIdentifier         pkix.AlgorithmIdentifier
	IntendedUsage               KeyUsage                  `asn1:"optional,explicit,tag:0"`
	IntendedCertificatePolicies CertificatePoliciesSyntax `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	InfoSyntax ::= CHOICE {
//	  content  UnboundedDirectoryString,
//	  pointer  SEQUENCE {
//	    name     GeneralNames,
//	    hash     HASH{HashedPolicyInfo} OPTIONAL,
//	    ... },
//	  ... }
type InfoSyntax = asn1.RawValue

// # ASN.1 Definition:
//
//	HashedPolicyInfo ::= POLICY.&Type({Policies})
type HashedPolicyInfo = asn1.RawValue

// # ASN.1 Definition:
//
//	PolicySyntax ::= SEQUENCE {
//	  policyIdentifier  PolicyID,
//	  policySyntax      InfoSyntax,
//	  ... }
type PolicySyntax struct {
	PolicyIdentifier PolicyID
	PolicySyntax     InfoSyntax
}

// # ASN.1 Definition:
//
//	PolicyID ::= CertPolicyId
type PolicyID = CertPolicyId

// # ASN.1 Definition:
//
//	SupportedPublicKeyAlgorithms ::= SEQUENCE {
//	  algorithmIdentifier      AlgorithmIdentifier{{SupportedPublicKeyAlgos}},
//	  minKeySize               INTEGER,
//	  extensions          [0]  SEQUENCE SIZE (1..MAX) OF OidOrAttr OPTIONAL,
//	  ... }
type SupportedPublicKeyAlgorithms struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	MinKeySize          int
	Extensions          [](OidOrAttr) `asn1:"optional,explicit,tag:0"`
}

// # ASN.1 Definition:
//
//	OidOrAttr ::= CHOICE {
//	  oid       ATTRIBUTE.&id ({ ExtAttributes }),
//	  attribute Attribute {{ ExtAttributes }},
//	  ... }
type OidOrAttr = asn1.RawValue

// # ASN.1 Definition:
//
//	id-oc-cRLDistributionPoint          OBJECT IDENTIFIER ::= {id-oc 19}
var Id_oc_cRLDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 6, 19}

// # ASN.1 Definition:
//
//	id-oc-pkiUser                       OBJECT IDENTIFIER ::= {id-oc 21}
var Id_oc_pkiUser asn1.ObjectIdentifier = []int{2, 5, 6, 21}

// # ASN.1 Definition:
//
//	id-oc-pkiCA                         OBJECT IDENTIFIER ::= {id-oc 22}
var Id_oc_pkiCA asn1.ObjectIdentifier = []int{2, 5, 6, 22}

// # ASN.1 Definition:
//
//	id-oc-deltaCRL                      OBJECT IDENTIFIER ::= {id-oc 23}
var Id_oc_deltaCRL asn1.ObjectIdentifier = []int{2, 5, 6, 23}

// # ASN.1 Definition:
//
//	id-oc-cpCps                         OBJECT IDENTIFIER ::= {id-oc 30}
var Id_oc_cpCps asn1.ObjectIdentifier = []int{2, 5, 6, 30}

// # ASN.1 Definition:
//
//	id-oc-pkiCertPath                   OBJECT IDENTIFIER ::= {id-oc 31}
var Id_oc_pkiCertPath asn1.ObjectIdentifier = []int{2, 5, 6, 31}

// # ASN.1 Definition:
//
//	id-nf-cRLDistPtNameForm             OBJECT IDENTIFIER ::= {id-nf 14}
var Id_nf_cRLDistPtNameForm asn1.ObjectIdentifier = []int{2, 5, 15, 14}

// # ASN.1 Definition:
//
//	id-at-userPassword                  OBJECT IDENTIFIER ::= {id-at 35}
var Id_at_userPassword asn1.ObjectIdentifier = []int{2, 5, 4, 35}

// # ASN.1 Definition:
//
//	id-at-userCertificate               OBJECT IDENTIFIER ::= {id-at 36}
var Id_at_userCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 36}

// # ASN.1 Definition:
//
//	id-at-cAcertificate                 OBJECT IDENTIFIER ::= {id-at 37}
var Id_at_cAcertificate asn1.ObjectIdentifier = []int{2, 5, 4, 37}

// # ASN.1 Definition:
//
//	id-at-authorityRevocationList       OBJECT IDENTIFIER ::= {id-at 38}
var Id_at_authorityRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 38}

// # ASN.1 Definition:
//
//	id-at-certificateRevocationList     OBJECT IDENTIFIER ::= {id-at 39}
var Id_at_certificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 39}

// # ASN.1 Definition:
//
//	id-at-crossCertificatePair          OBJECT IDENTIFIER ::= {id-at 40}
var Id_at_crossCertificatePair asn1.ObjectIdentifier = []int{2, 5, 4, 40}

// # ASN.1 Definition:
//
//	id-at-supportedAlgorithms           OBJECT IDENTIFIER ::= {id-at 52}
var Id_at_supportedAlgorithms asn1.ObjectIdentifier = []int{2, 5, 4, 52}

// # ASN.1 Definition:
//
//	id-at-deltaRevocationList           OBJECT IDENTIFIER ::= {id-at 53}
var Id_at_deltaRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 53}

// # ASN.1 Definition:
//
//	id-at-certificationPracticeStmt     OBJECT IDENTIFIER ::= {id-at 68}
var Id_at_certificationPracticeStmt asn1.ObjectIdentifier = []int{2, 5, 4, 68}

// # ASN.1 Definition:
//
//	id-at-certificatePolicy             OBJECT IDENTIFIER ::= {id-at 69}
var Id_at_certificatePolicy asn1.ObjectIdentifier = []int{2, 5, 4, 69}

// # ASN.1 Definition:
//
//	id-at-pkiPath                       OBJECT IDENTIFIER ::= {id-at 70}
var Id_at_pkiPath asn1.ObjectIdentifier = []int{2, 5, 4, 70}

// # ASN.1 Definition:
//
//	id-at-eepkCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 101}
var Id_at_eepkCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 101}

// # ASN.1 Definition:
//
//	id-at-supportedPublicKeyAlgorithms  OBJECT IDENTIFIER ::= {id-at 103}
var Id_at_supportedPublicKeyAlgorithms asn1.ObjectIdentifier = []int{2, 5, 4, 103}

// # ASN.1 Definition:
//
//	id-asx-x509SupportedPublicKeyAlgos  OBJECT IDENTIFIER ::= {id-asx 10}
var Id_asx_x509SupportedPublicKeyAlgos asn1.ObjectIdentifier = []int{2, 5, 40, 10}

// # ASN.1 Definition:
//
//	id-lsx-x509Certificate              OBJECT IDENTIFIER ::= {id-lsx 8}
var Id_lsx_x509Certificate asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 8}

// # ASN.1 Definition:
//
//	id-lsx-x509CertificateList          OBJECT IDENTIFIER ::= {id-lsx 9}
var Id_lsx_x509CertificateList asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 9}

// # ASN.1 Definition:
//
//	id-lsx-x509CertificatePair          OBJECT IDENTIFIER ::= {id-lsx 10}
var Id_lsx_x509CertificatePair asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 10}

// # ASN.1 Definition:
//
//	id-lsx-x509SupportedAlgorithm       OBJECT IDENTIFIER ::= {id-lsx 49}
var Id_lsx_x509SupportedAlgorithm asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 49}

// # ASN.1 Definition:
//
// TBSCertAVL-entries-Item-idType ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type TBSCertAVL_entries_Item_idType = asn1.RawValue

// # ASN.1 Definition:
//
// TBSCertAVL-entries-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type TBSCertAVL_entries_Item struct {
	IdType          TBSCertAVL_entries_Item_idType
	Scope           ScopeRestrictions `asn1:"optional,tag:0"`
	EntryExtensions Extensions        `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
// InfoSyntax-pointer ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type InfoSyntax_pointer struct {
	Name GeneralNames
	Hash HASH `asn1:"optional"`
}
