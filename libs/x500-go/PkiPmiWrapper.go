package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION PDU_wrapper */
// ### ASN.1 Definition:
//
// ```asn1
// PDU-wrapper  ::=  SIGNED{TBSPDU-wrapper}
// ```
type PDU_wrapper = SIGNED // DefinedType
/* END_OF_SYMBOL_DEFINITION PDU_wrapper */ /* START_OF_SYMBOL_DEFINITION TBSPDU_wrapper */
// ### ASN.1 Definition:
//
// ```asn1
// TBSPDU-wrapper ::= SEQUENCE  {
//   version               Version DEFAULT v1,
//   signatureAlgorithm    AlgorithmIdentifier {{SupportedSignatureAlgorithms}},
//   certPath         [0]  IMPLICIT PkiPath,
//   signedAttrs      [1]  IMPLICIT SignedAttributes OPTIONAL,
//   conf                  CHOICE {
//     clear            [2]  WrappedPDUInfo,
//     protected        [3]  EncryptedInfo,
//    ... },
//   ... }
// ```
//
//
type TBSPDU_wrapper struct {
	Version            Version `asn1:"optional"`
	SignatureAlgorithm pkix.AlgorithmIdentifier
	CertPath           PkiPath          `asn1:"tag:0"`
	SignedAttrs        SignedAttributes `asn1:"optional,tag:1"`
	Conf               TBSPDU_wrapper_conf
}

/* END_OF_SYMBOL_DEFINITION TBSPDU_wrapper */ /* START_OF_SYMBOL_DEFINITION SignedAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// SignedAttributes  ::=  SET SIZE (1..MAX) OF Attribute{{SupportedSignedAttributes}}
// ```
type SignedAttributes = [](Attribute) // SetOfType
/* END_OF_SYMBOL_DEFINITION SignedAttributes */ /* START_OF_SYMBOL_DEFINITION WrappedPDUInfo */
// ### ASN.1 Definition:
//
// ```asn1
// WrappedPDUInfo ::= SEQUENCE {
//   pduType      WRAPPED-PDU.&id ({SupportedPduSet}),
//   pduInfo      WRAPPED-PDU.&Type ({SupportedPduSet}{@pduType}),
//   ... }
// ```
//
//
type WrappedPDUInfo struct {
	PduType asn1.ObjectIdentifier
	PduInfo asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION WrappedPDUInfo */ /* START_OF_SYMBOL_DEFINITION EncryptedInfo */
// ### ASN.1 Definition:
//
// ```asn1
// EncryptedInfo ::= SEQUENCE {
//   keyAgreement      KeyAgreement,
//   encryptedPduInfo  EncryptedPduInfo,
//   ... }
// ```
//
//
type EncryptedInfo struct {
	KeyAgreement     KeyAgreement
	EncryptedPduInfo EncryptedPduInfo
}

/* END_OF_SYMBOL_DEFINITION EncryptedInfo */ /* START_OF_SYMBOL_DEFINITION KeyAgreement */
// ### ASN.1 Definition:
//
// ```asn1
// KeyAgreement ::= SEQUENCE {
//   senderDhInfo       [0] SenderDhInfo,
//   keyEncryptionAlgorithm SEQUENCE {
//     algorithm    ALGORITHM.&id ({SupportedKeyEncryptionAlgorithm}),
//     parameters   ALGORITHM.&Type({SupportedKeyEncryptionAlgorithm}{@.algorithm}),
//     ... },
//   ... }
// ```
//
//
type KeyAgreement struct {
	SenderDhInfo           SenderDhInfo `asn1:"explicit,tag:0"`
	KeyEncryptionAlgorithm KeyAgreement_keyEncryptionAlgorithm
}

/* END_OF_SYMBOL_DEFINITION KeyAgreement */ /* START_OF_SYMBOL_DEFINITION SenderDhInfo */
// ### ASN.1 Definition:
//
// ```asn1
// SenderDhInfo  ::=  CHOICE {
//   senderStaticInfo   [0] SenderStaticInfo,
//   senderDhPublicKey  [1] SenderDhPublicKey,
//   ... }
// ```
type SenderDhInfo = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SenderDhInfo */ /* START_OF_SYMBOL_DEFINITION SenderStaticInfo */
// ### ASN.1 Definition:
//
// ```asn1
// SenderStaticInfo ::= SEQUENCE {
//   issuer       Name,
//   serialNumber CertificateSerialNumber,
//   partyAinfo   UserKeyingMaterial,
//   ... }
// ```
//
//
type SenderStaticInfo struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
	PartyAinfo   UserKeyingMaterial
}

/* END_OF_SYMBOL_DEFINITION SenderStaticInfo */ /* START_OF_SYMBOL_DEFINITION SenderDhPublicKey */
// ### ASN.1 Definition:
//
// ```asn1
// SenderDhPublicKey ::= SEQUENCE {
//   algorithm   AlgorithmIdentifier {{SupportedDHPublicKeyAlgorithms}},
//   publicKey   BIT STRING,
//   ... }
// ```
//
//
type SenderDhPublicKey struct {
	Algorithm pkix.AlgorithmIdentifier
	PublicKey asn1.BitString
}

/* END_OF_SYMBOL_DEFINITION SenderDhPublicKey */ /* START_OF_SYMBOL_DEFINITION UserKeyingMaterial */
// ### ASN.1 Definition:
//
// ```asn1
// UserKeyingMaterial  ::=  OCTET STRING (SIZE (64))
// ```
type UserKeyingMaterial = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION UserKeyingMaterial */ /* START_OF_SYMBOL_DEFINITION EncryptedPduInfo */
// ### ASN.1 Definition:
//
// ```asn1
// EncryptedPduInfo ::= SEQUENCE {
//   pduType                 WRAPPED-PDU.&id ({SupportedPduSet}),
//   encryptedKey            EncryptedKey OPTIONAL,
//   pduEncryptionAlgorithm  SEQUENCE {
//     algorithm               ALGORITHM.&id ({SymmetricEncryptionAlgorithms}),
//     parameter               ALGORITHM.&Type
//                   ({SymmetricEncryptionAlgorithms}{@.algorithm})} OPTIONAL,
//   encryptedPdu        [0] EncryptedPdu,
//   ... }
// ```
//
//
type EncryptedPduInfo struct {
	PduType                asn1.ObjectIdentifier
	EncryptedKey           EncryptedKey                            `asn1:"optional"`
	PduEncryptionAlgorithm EncryptedPduInfo_pduEncryptionAlgorithm `asn1:"optional"`
	EncryptedPdu           EncryptedPdu                            `asn1:"explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION EncryptedPduInfo */ /* START_OF_SYMBOL_DEFINITION EncryptedKey */
// ### ASN.1 Definition:
//
// ```asn1
// EncryptedKey  ::=  OCTET STRING
// ```
type EncryptedKey = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION EncryptedKey */ /* START_OF_SYMBOL_DEFINITION EncryptedPdu */
// ### ASN.1 Definition:
//
// ```asn1
// EncryptedPdu  ::=  OCTET STRING
// ```
type EncryptedPdu = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION EncryptedPdu */ /* START_OF_SYMBOL_DEFINITION AttributeCertificateV2 */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeCertificateV2  ::=  AttributeCertificate
// ```
type AttributeCertificateV2 = AttributeCertificate // DefinedType
/* END_OF_SYMBOL_DEFINITION AttributeCertificateV2 */ /* START_OF_SYMBOL_DEFINITION Id_contentType */
// ### ASN.1 Definition:
//
// ```asn1
// id-contentType OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 3 }
// ```
//
//
var Id_contentType asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 9, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_contentType */ /* START_OF_SYMBOL_DEFINITION Id_messageDigest */
// ### ASN.1 Definition:
//
// ```asn1
// id-messageDigest OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 4 }
// ```
//
//
var Id_messageDigest asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 9, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_messageDigest */ /* START_OF_SYMBOL_DEFINITION PkiWaError */
// ### ASN.1 Definition:
//
// ```asn1
// PkiWaError  ::=  ENUMERATED {
//   unsupportedWrapperVersion           (0),
//   unsupportedSignatureAlgorithm       (1),
//   incompleteCertPath                  (2),
//   certificationPathFailure            (3),
//   invalidSignature                    (4),
//   missingMandatoryAttributes          (5),
//   unwantedAttribute                   (6),
//   unsupportedPduType                  (7),
//   unexpectedPduType                   (8),
//   invalidPduSyntax                    (9),
//   unknownDHpkCetificate               (10),
//   invalidKeyingMaterial               (11),
//   dhAlgorithmMismatch                 (12),
//   invalideDhPublickey                 (13),
//   unsupportedKeyWrappingAlgorithm     (14),
//   keyEncAlgorithmParametersMissing    (15),
//   keyEncAlgorithmParametersNotAllowed (16),
//   invalidParmsForSymEncryptAlgorithms (17),
//   decryptionFailed                    (18),
//   ... }
// ```
type PkiWaError = asn1.Enumerated

const (
	PkiWaError_UnsupportedWrapperVersion           PkiWaError = 0  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnsupportedSignatureAlgorithm       PkiWaError = 1  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_IncompleteCertPath                  PkiWaError = 2  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_CertificationPathFailure            PkiWaError = 3  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_InvalidSignature                    PkiWaError = 4  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_MissingMandatoryAttributes          PkiWaError = 5  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnwantedAttribute                   PkiWaError = 6  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnsupportedPduType                  PkiWaError = 7  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnexpectedPduType                   PkiWaError = 8  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_InvalidPduSyntax                    PkiWaError = 9  // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnknownDHpkCetificate               PkiWaError = 10 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_InvalidKeyingMaterial               PkiWaError = 11 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_DhAlgorithmMismatch                 PkiWaError = 12 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_InvalideDhPublickey                 PkiWaError = 13 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_UnsupportedKeyWrappingAlgorithm     PkiWaError = 14 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_KeyEncAlgorithmParametersMissing    PkiWaError = 15 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_KeyEncAlgorithmParametersNotAllowed PkiWaError = 16 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_InvalidParmsForSymEncryptAlgorithms PkiWaError = 17 // LONG_NAMED_ENUMERATED_VALUE,
	PkiWaError_DecryptionFailed                    PkiWaError = 18 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION PkiWaError */ /* START_OF_SYMBOL_DEFINITION TBSPDU_wrapper_conf */
// ### ASN.1 Definition:
//
// ```asn1
// TBSPDU-wrapper-conf ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type TBSPDU_wrapper_conf = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TBSPDU_wrapper_conf */ /* START_OF_SYMBOL_DEFINITION KeyAgreement_keyEncryptionAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// KeyAgreement-keyEncryptionAlgorithm ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type KeyAgreement_keyEncryptionAlgorithm struct {
	Algorithm  asn1.ObjectIdentifier
	Parameters asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION KeyAgreement_keyEncryptionAlgorithm */ /* START_OF_SYMBOL_DEFINITION EncryptedPduInfo_pduEncryptionAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// EncryptedPduInfo-pduEncryptionAlgorithm ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type EncryptedPduInfo_pduEncryptionAlgorithm struct {
	Algorithm asn1.ObjectIdentifier
	Parameter asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION EncryptedPduInfo_pduEncryptionAlgorithm */
