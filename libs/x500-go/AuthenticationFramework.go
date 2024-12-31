package x500_go

import (
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION SIGNATURE */
// ### ASN.1 Definition:
//
// ```asn1
// SIGNATURE ::= SEQUENCE {
//   algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//   signature            BIT STRING,
//   ... }
// ```
//
//
type SIGNATURE struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Signature           asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION SIGNATURE */ /* START_OF_SYMBOL_DEFINITION SIGNED */
// ### ASN.1 Definition:
//
// ```asn1
// SIGNED{ToBeSigned} ::= SEQUENCE {
//   toBeSigned              ToBeSigned,
//   algorithmIdentifier     AlgorithmIdentifier{{SupportedAlgorithms}},
//   signature               BIT STRING,
//   ...,
// [[4:
//   altAlgorithmIdentifier  AlgorithmIdentifier{{SupportedAltAlgorithms}} OPTIONAL,
//   altSignature            BIT STRING OPTIONAL]]
//   } (WITH COMPONENTS {..., altAlgorithmIdentifier PRESENT, altSignature PRESENT } |
//      WITH COMPONENTS {..., altAlgorithmIdentifier ABSENT,  altSignature ABSENT } )
// ```
//
//
type SIGNED struct {
	ToBeSigned          asn1.RawValue
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Signature           asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION SIGNED */ /* START_OF_SYMBOL_DEFINITION HASH */
// ### ASN.1 Definition:
//
// ```asn1
// HASH{ToBeHashed} ::= SEQUENCE {
//   algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//   hashValue            BIT STRING (CONSTRAINED BY {
//    -- shall be the result of applying a hashing procedure to the DER-encoded
//    -- octets of a value of -- ToBeHashed } ),
//   ... }
// ```
//
//
type HASH struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	HashValue           asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION HASH */ /* START_OF_SYMBOL_DEFINITION ENCRYPTED */
// ### ASN.1 Definition:
//
// ```asn1
// ENCRYPTED{ToBeEnciphered}  ::=  BIT STRING (CONSTRAINED BY {
//    -- shall be the result of applying an encipherment procedure
//    -- to the BER-encoded octets of a value of -- ToBeEnciphered } )
// ```
type ENCRYPTED = asn1.BitString

/* END_OF_SYMBOL_DEFINITION ENCRYPTED */ /* START_OF_SYMBOL_DEFINITION ENCRYPTED_HASH */
// ### ASN.1 Definition:
//
// ```asn1
// ENCRYPTED-HASH{ToBeSigned}  ::=  BIT STRING (CONSTRAINED BY {
//   -- shall be the result of applying a hashing procedure to the DER-encoded (see 6.2)
//   -- octets of a value of -- ToBeSigned -- and then applying an encipherment procedure
//   -- to those octets -- } )
// ```
type ENCRYPTED_HASH = asn1.BitString

/* END_OF_SYMBOL_DEFINITION AlgorithmIdentifier */ /* START_OF_SYMBOL_DEFINITION FingerPrint */
// ### ASN.1 Definition:
//
// ```asn1
// FingerPrint {ToBeFingerprinted} ::= SEQUENCE {
//   algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//   fingerprint          BIT STRING,
//   ... }
// ```
//
//
type FingerPrint struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	Fingerprint         asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION FingerPrint */ /* START_OF_SYMBOL_DEFINITION Id_ecPublicKey */
// ### ASN.1 Definition:
//
// ```asn1
// id-ecPublicKey OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840) ansi-X9-62(10045)
//                                       keyType(2) 1 }
// ```
//
//
// var Id_ecPublicKey asn1.ObjectIdentifier = []int{ 1, 2, 840, 10045, 2, 1 } /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ecPublicKey */ /* START_OF_SYMBOL_DEFINITION SupportedCurves */
// ### ASN.1 Definition:
//
// ```asn1
// SupportedCurves OBJECT IDENTIFIER ::= {dummyCurv, ...}
// ```
//
//
type SupportedCurves = asn1.ObjectIdentifier

/* END_OF_SYMBOL_DEFINITION SupportedCurves */ /* START_OF_SYMBOL_DEFINITION DummyCurv */
// ### ASN.1 Definition:
//
// ```asn1
// dummyCurv OBJECT IDENTIFIER ::= {2 5 5}
// ```
//
//
var DummyCurv asn1.ObjectIdentifier = []int{2, 5, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DummyCurv */
/* START_OF_SYMBOL_DEFINITION Version */
// ### ASN.1 Definition:
//
// ```asn1
// Version  ::=  INTEGER {v1(0), v2(1), v3(2)}
// ```
type Version = int64

/* END_OF_SYMBOL_DEFINITION Version */

/* START_OF_SYMBOL_DEFINITION Version_V1 */
const Version_V1 Version = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION Version_V1 */

/* START_OF_SYMBOL_DEFINITION Version_V2 */
const Version_V2 Version = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION Version_V2 */

/* START_OF_SYMBOL_DEFINITION Version_V3 */
const Version_V3 Version = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION Version_V3 */ /* START_OF_SYMBOL_DEFINITION CertificateSerialNumber */
// ### ASN.1 Definition:
//
// ```asn1
// CertificateSerialNumber  ::=  INTEGER
// ```
type CertificateSerialNumber = int64

/* END_OF_SYMBOL_DEFINITION CertificateSerialNumber */ /* START_OF_SYMBOL_DEFINITION Validity */
// ### ASN.1 Definition:
//
// ```asn1
// Validity ::= SEQUENCE {
//   notBefore  Time,
//   notAfter   Time,
//   ... }
// ```
//
//
type Validity struct {
	NotBefore X509Time
	NotAfter  X509Time
}

/* END_OF_SYMBOL_DEFINITION Validity */ /* START_OF_SYMBOL_DEFINITION SubjectPublicKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// SubjectPublicKeyInfo ::= SEQUENCE {
//   algorithm         AlgorithmIdentifier{{SupportedAlgorithms}},
//   subjectPublicKey  PublicKey,
//   ... }
// ```
//
//
type SubjectPublicKeyInfo struct {
	Algorithm        pkix.AlgorithmIdentifier
	SubjectPublicKey PublicKey
}

/* END_OF_SYMBOL_DEFINITION SubjectPublicKeyInfo */ /* START_OF_SYMBOL_DEFINITION PublicKey */
// ### ASN.1 Definition:
//
// ```asn1
// PublicKey  ::=  BIT STRING
// ```
type PublicKey = asn1.BitString

/* END_OF_SYMBOL_DEFINITION PublicKey */ /* START_OF_SYMBOL_DEFINITION Time */
// ### ASN.1 Definition:
//
// ```asn1
// Time  ::=  CHOICE {
//   utcTime          UTCTime,
//   generalizedTime  GeneralizedTime }
// ```
type X509Time = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Time */ /* START_OF_SYMBOL_DEFINITION Extensions */
// ### ASN.1 Definition:
//
// ```asn1
// Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
// ```
type Extensions = [](pkix.Extension) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Extensions */
/* START_OF_SYMBOL_DEFINITION Der */
// ### ASN.1 Definition:
//
// ```asn1
// der OBJECT IDENTIFIER ::= {joint-iso-itu-t asn1(1) ber-derived(2) distinguished-encoding(1)}
// ```
//
//
// var Der asn1.ObjectIdentifier = []int{2, 1, 2, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Der */ /* START_OF_SYMBOL_DEFINITION Certificates */
// ### ASN.1 Definition:
//
// ```asn1
// Certificates ::= SEQUENCE {
//   userCertificate    Certificate,
//   certificationPath  ForwardCertificationPath OPTIONAL,
//   ... }
// ```
//
//
type Certificates struct {
	UserCertificate   x509.Certificate
	CertificationPath ForwardCertificationPath `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION Certificates */ /* START_OF_SYMBOL_DEFINITION ForwardCertificationPath */
// ### ASN.1 Definition:
//
// ```asn1
// ForwardCertificationPath  ::=  SEQUENCE SIZE (1..MAX) OF CrossCertificates
// ```
type ForwardCertificationPath = [](CrossCertificates) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ForwardCertificationPath */ /* START_OF_SYMBOL_DEFINITION CrossCertificates */
// ### ASN.1 Definition:
//
// ```asn1
// CrossCertificates  ::=  SET SIZE (1..MAX) OF Certificate
// ```
type CrossCertificates = [](x509.Certificate) // SetOfType
/* END_OF_SYMBOL_DEFINITION CrossCertificates */ /* START_OF_SYMBOL_DEFINITION CertificationPath */
// ### ASN.1 Definition:
//
// ```asn1
// CertificationPath ::= SEQUENCE {
//   userCertificate    Certificate,
//   theCACertificates  SEQUENCE SIZE (1..MAX) OF CertificatePair OPTIONAL,
//   ... }
// ```
//
//
type CertificationPath struct {
	UserCertificate   x509.Certificate
	TheCACertificates [](CertificatePair) `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION CertificationPath */ /* START_OF_SYMBOL_DEFINITION PkiPath */
// ### ASN.1 Definition:
//
// ```asn1
// PkiPath  ::=  SEQUENCE SIZE (1..MAX) OF Certificate
// ```
type PkiPath = [](x509.Certificate) // SequenceOfType
// ### ASN.1 Definition:
//
// ```asn1
// CertAVL  ::=  SIGNED {TBSCertAVL}
// ```
type CertAVL = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION CertAVL */ /* START_OF_SYMBOL_DEFINITION TBSCertAVL */
// ### ASN.1 Definition:
//
// ```asn1
// TBSCertAVL ::= SEQUENCE {
//   version               [0]  IMPLICIT Version DEFAULT v1,
//   serialNumber               AvlSerialNumber OPTIONAL,
//   signature                  AlgorithmIdentifier {{SupportedAlgorithms}},
//   issuer                     Name,
//   constrained                BOOLEAN,
//   entries                    SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//     idType                     CHOICE {
//       certIdentifier        [0]  PKCertIdentifier,
//       entityGroup                DistinguishedName, -- only for constrained = FALSE
//       ... },
//     scope                 [0]  IMPLICIT ScopeRestrictions OPTIONAL,
//     entryExtensions       [1]  IMPLICIT Extensions OPTIONAL,
//     ... },
//   ...,
//   ...,
//   avlExtensions              Extensions OPTIONAL }
// ```
//
//
type TBSCertAVL struct {
	Version       Version         `asn1:"optional,tag:0"`
	SerialNumber  AvlSerialNumber `asn1:"optional"`
	Signature     pkix.AlgorithmIdentifier
	Issuer        Name
	Constrained   bool
	Entries       [](TBSCertAVL_entries_Item)
	AvlExtensions Extensions `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TBSCertAVL */ /* START_OF_SYMBOL_DEFINITION AvlSerialNumber */
// ### ASN.1 Definition:
//
// ```asn1
// AvlSerialNumber  ::=  INTEGER (0..MAX)
// ```
type AvlSerialNumber = int64

/* END_OF_SYMBOL_DEFINITION AvlSerialNumber */ /* START_OF_SYMBOL_DEFINITION PKCertIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// PKCertIdentifier  ::=  CHOICE {
//   issuerSerialNumber         IssuerSerialNumber,
//   fingerprintPKC        [0]  IMPLICIT FingerPrint {Certificate},
//   fingerprintPK         [1]  IMPLICIT FingerPrint {PublicKey},
//   ... }
// ```
type PKCertIdentifier = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PKCertIdentifier */ /* START_OF_SYMBOL_DEFINITION IssuerSerialNumber */
// ### ASN.1 Definition:
//
// ```asn1
// IssuerSerialNumber ::= SEQUENCE {
//   issuer        Name,
//   serialNumber  CertificateSerialNumber,
//   ... }
// ```
//
//
type IssuerSerialNumber struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION IssuerSerialNumber */ /* START_OF_SYMBOL_DEFINITION ScopeRestrictions */
// ### ASN.1 Definition:
//
// ```asn1
// ScopeRestrictions  ::=  SEQUENCE OF ScopeRestriction
// ```
type ScopeRestrictions = [](ScopeRestriction) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ScopeRestrictions */ /* START_OF_SYMBOL_DEFINITION ScopeRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// ScopeRestriction ::= SEQUENCE {
//   id            SCOPE-RESTRICTION.&id,
//   restriction   SCOPE-RESTRICTION.&Type,
//   ... }
// ```
//
//
type ScopeRestriction struct {
	Id          asn1.ObjectIdentifier
	Restriction asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION ScopeRestriction */ /* START_OF_SYMBOL_DEFINITION CertificatePair */
// ### ASN.1 Definition:
//
// ```asn1
// CertificatePair ::= SEQUENCE {
//   issuedToThisCA  [0]  Certificate OPTIONAL,
//   issuedByThisCA  [1]  Certificate OPTIONAL,
//   ... }
//   (WITH COMPONENTS { ..., issuedToThisCA PRESENT} |
//    WITH COMPONENTS { ..., issuedByThisCA PRESENT})
// ```
//
//
type CertificatePair struct {
	IssuedToThisCA x509.Certificate `asn1:"optional,explicit,tag:0"`
	IssuedByThisCA x509.Certificate `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION CertificatePair */ /* START_OF_SYMBOL_DEFINITION SupportedAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// SupportedAlgorithm ::= SEQUENCE {
//   algorithmIdentifier              AlgorithmIdentifier{{SupportedAlgorithms}},
//   intendedUsage               [0]  KeyUsage OPTIONAL,
//   intendedCertificatePolicies [1]  CertificatePoliciesSyntax OPTIONAL,
//   ... }
// ```
//
//
type SupportedAlgorithm struct {
	AlgorithmIdentifier         pkix.AlgorithmIdentifier
	IntendedUsage               KeyUsage                  `asn1:"optional,explicit,tag:0"`
	IntendedCertificatePolicies CertificatePoliciesSyntax `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION SupportedAlgorithm */ /* START_OF_SYMBOL_DEFINITION InfoSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// InfoSyntax  ::=  CHOICE {
//   content  UnboundedDirectoryString,
//   pointer  SEQUENCE {
//     name     GeneralNames,
//     hash     HASH{HashedPolicyInfo} OPTIONAL,
//     ... },
//   ... }
// ```
type InfoSyntax = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION InfoSyntax */ /* START_OF_SYMBOL_DEFINITION HashedPolicyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// HashedPolicyInfo  ::=  POLICY.&Type({Policies})
// ```
type HashedPolicyInfo = asn1.RawValue // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION HashedPolicyInfo */ /* START_OF_SYMBOL_DEFINITION PolicySyntax */
// ### ASN.1 Definition:
//
// ```asn1
// PolicySyntax ::= SEQUENCE {
//   policyIdentifier  PolicyID,
//   policySyntax      InfoSyntax,
//   ... }
// ```
//
//
type PolicySyntax struct {
	PolicyIdentifier PolicyID
	PolicySyntax     InfoSyntax
}

/* END_OF_SYMBOL_DEFINITION PolicySyntax */ /* START_OF_SYMBOL_DEFINITION PolicyID */
// ### ASN.1 Definition:
//
// ```asn1
// PolicyID  ::=  CertPolicyId
// ```
type PolicyID = CertPolicyId // DefinedType
/* END_OF_SYMBOL_DEFINITION PolicyID */ /* START_OF_SYMBOL_DEFINITION SupportedPublicKeyAlgorithms */
// ### ASN.1 Definition:
//
// ```asn1
// SupportedPublicKeyAlgorithms ::= SEQUENCE {
//   algorithmIdentifier      AlgorithmIdentifier{{SupportedPublicKeyAlgos}},
//   minKeySize               INTEGER,
//   extensions          [0]  SEQUENCE SIZE (1..MAX) OF OidOrAttr OPTIONAL,
//   ... }
// ```
//
//
type SupportedPublicKeyAlgorithms struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	MinKeySize          int
	Extensions          [](OidOrAttr) `asn1:"optional,explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION SupportedPublicKeyAlgorithms */ /* START_OF_SYMBOL_DEFINITION OidOrAttr */
// ### ASN.1 Definition:
//
// ```asn1
// OidOrAttr  ::=  CHOICE {
//   oid       ATTRIBUTE.&id ({ ExtAttributes }),
//   attribute Attribute {{ ExtAttributes }},
//   ... }
// ```
type OidOrAttr = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION OidOrAttr */ /* START_OF_SYMBOL_DEFINITION Id_oc_cRLDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-cRLDistributionPoint          OBJECT IDENTIFIER ::= {id-oc 19}
// ```
//
//
var Id_oc_cRLDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 6, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_cRLDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_oc_pkiUser */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pkiUser                       OBJECT IDENTIFIER ::= {id-oc 21}
// ```
//
//
var Id_oc_pkiUser asn1.ObjectIdentifier = []int{2, 5, 6, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pkiUser */ /* START_OF_SYMBOL_DEFINITION Id_oc_pkiCA */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pkiCA                         OBJECT IDENTIFIER ::= {id-oc 22}
// ```
//
//
var Id_oc_pkiCA asn1.ObjectIdentifier = []int{2, 5, 6, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pkiCA */ /* START_OF_SYMBOL_DEFINITION Id_oc_deltaCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-deltaCRL                      OBJECT IDENTIFIER ::= {id-oc 23}
// ```
//
//
var Id_oc_deltaCRL asn1.ObjectIdentifier = []int{2, 5, 6, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_deltaCRL */ /* START_OF_SYMBOL_DEFINITION Id_oc_cpCps */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-cpCps                         OBJECT IDENTIFIER ::= {id-oc 30}
// ```
//
//
var Id_oc_cpCps asn1.ObjectIdentifier = []int{2, 5, 6, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_cpCps */ /* START_OF_SYMBOL_DEFINITION Id_oc_pkiCertPath */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc-pkiCertPath                   OBJECT IDENTIFIER ::= {id-oc 31}
// ```
//
//
var Id_oc_pkiCertPath asn1.ObjectIdentifier = []int{2, 5, 6, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oc_pkiCertPath */ /* START_OF_SYMBOL_DEFINITION Id_nf_cRLDistPtNameForm */
// ### ASN.1 Definition:
//
// ```asn1
// id-nf-cRLDistPtNameForm             OBJECT IDENTIFIER ::= {id-nf 14}
// ```
//
//
var Id_nf_cRLDistPtNameForm asn1.ObjectIdentifier = []int{2, 5, 15, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_nf_cRLDistPtNameForm */ /* START_OF_SYMBOL_DEFINITION Id_at_userPassword */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-userPassword                  OBJECT IDENTIFIER ::= {id-at 35}
// ```
//
//
var Id_at_userPassword asn1.ObjectIdentifier = []int{2, 5, 4, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_userPassword */ /* START_OF_SYMBOL_DEFINITION Id_at_userCertificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-userCertificate               OBJECT IDENTIFIER ::= {id-at 36}
// ```
//
//
var Id_at_userCertificate asn1.ObjectIdentifier = []int{2, 5, 4, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_userCertificate */ /* START_OF_SYMBOL_DEFINITION Id_at_cAcertificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-cAcertificate                 OBJECT IDENTIFIER ::= {id-at 37}
// ```
//
//
var Id_at_cAcertificate asn1.ObjectIdentifier = []int{2, 5, 4, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_cAcertificate */ /* START_OF_SYMBOL_DEFINITION Id_at_authorityRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-authorityRevocationList       OBJECT IDENTIFIER ::= {id-at 38}
// ```
//
//
var Id_at_authorityRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_authorityRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_certificateRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-certificateRevocationList     OBJECT IDENTIFIER ::= {id-at 39}
// ```
//
//
var Id_at_certificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_certificateRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_crossCertificatePair */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-crossCertificatePair          OBJECT IDENTIFIER ::= {id-at 40}
// ```
//
//
var Id_at_crossCertificatePair asn1.ObjectIdentifier = []int{2, 5, 4, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_crossCertificatePair */ /* START_OF_SYMBOL_DEFINITION Id_at_supportedAlgorithms */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-supportedAlgorithms           OBJECT IDENTIFIER ::= {id-at 52}
// ```
//
//
var Id_at_supportedAlgorithms asn1.ObjectIdentifier = []int{2, 5, 4, 52} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_supportedAlgorithms */ /* START_OF_SYMBOL_DEFINITION Id_at_deltaRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-deltaRevocationList           OBJECT IDENTIFIER ::= {id-at 53}
// ```
//
//
var Id_at_deltaRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 53} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_deltaRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_certificationPracticeStmt */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-certificationPracticeStmt     OBJECT IDENTIFIER ::= {id-at 68}
// ```
//
//
var Id_at_certificationPracticeStmt asn1.ObjectIdentifier = []int{2, 5, 4, 68} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_certificationPracticeStmt */ /* START_OF_SYMBOL_DEFINITION Id_at_certificatePolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-certificatePolicy             OBJECT IDENTIFIER ::= {id-at 69}
// ```
//
//
var Id_at_certificatePolicy asn1.ObjectIdentifier = []int{2, 5, 4, 69} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_certificatePolicy */ /* START_OF_SYMBOL_DEFINITION Id_at_pkiPath */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-pkiPath                       OBJECT IDENTIFIER ::= {id-at 70}
// ```
//
//
var Id_at_pkiPath asn1.ObjectIdentifier = []int{2, 5, 4, 70} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_pkiPath */ /* START_OF_SYMBOL_DEFINITION Id_at_eepkCertificateRevocationList */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-eepkCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 101}
// ```
//
//
var Id_at_eepkCertificateRevocationList asn1.ObjectIdentifier = []int{2, 5, 4, 101} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_eepkCertificateRevocationList */ /* START_OF_SYMBOL_DEFINITION Id_at_supportedPublicKeyAlgorithms */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-supportedPublicKeyAlgorithms  OBJECT IDENTIFIER ::= {id-at 103}
// ```
//
//
var Id_at_supportedPublicKeyAlgorithms asn1.ObjectIdentifier = []int{2, 5, 4, 103} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_supportedPublicKeyAlgorithms */ /* START_OF_SYMBOL_DEFINITION Id_asx_x509SupportedPublicKeyAlgos */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-x509SupportedPublicKeyAlgos  OBJECT IDENTIFIER ::= {id-asx 10}
// ```
//
//
var Id_asx_x509SupportedPublicKeyAlgos asn1.ObjectIdentifier = []int{2, 5, 40, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_x509SupportedPublicKeyAlgos */ /* START_OF_SYMBOL_DEFINITION Id_lsx_x509Certificate */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-x509Certificate              OBJECT IDENTIFIER ::= {id-lsx 8}
// ```
//
//
var Id_lsx_x509Certificate asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_x509Certificate */ /* START_OF_SYMBOL_DEFINITION Id_lsx_x509CertificateList */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-x509CertificateList          OBJECT IDENTIFIER ::= {id-lsx 9}
// ```
//
//
var Id_lsx_x509CertificateList asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_x509CertificateList */ /* START_OF_SYMBOL_DEFINITION Id_lsx_x509CertificatePair */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-x509CertificatePair          OBJECT IDENTIFIER ::= {id-lsx 10}
// ```
//
//
var Id_lsx_x509CertificatePair asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_x509CertificatePair */ /* START_OF_SYMBOL_DEFINITION Id_lsx_x509SupportedAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-x509SupportedAlgorithm       OBJECT IDENTIFIER ::= {id-lsx 49}
// ```
//
//
var Id_lsx_x509SupportedAlgorithm asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 49} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_x509SupportedAlgorithm */
/* START_OF_SYMBOL_DEFINITION TBSCertAVL_entries_Item_idType */
// ### ASN.1 Definition:
//
// ```asn1
// TBSCertAVL-entries-Item-idType ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type TBSCertAVL_entries_Item_idType = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TBSCertAVL_entries_Item_idType */ /* START_OF_SYMBOL_DEFINITION TBSCertAVL_entries_Item */
// ### ASN.1 Definition:
//
// ```asn1
// TBSCertAVL-entries-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type TBSCertAVL_entries_Item struct {
	IdType          TBSCertAVL_entries_Item_idType
	Scope           ScopeRestrictions `asn1:"optional,tag:0"`
	EntryExtensions Extensions        `asn1:"optional,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION TBSCertAVL_entries_Item */ /* START_OF_SYMBOL_DEFINITION InfoSyntax_pointer */
// ### ASN.1 Definition:
//
// ```asn1
// InfoSyntax-pointer ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type InfoSyntax_pointer struct {
	Name GeneralNames
	Hash HASH `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION InfoSyntax_pointer */
