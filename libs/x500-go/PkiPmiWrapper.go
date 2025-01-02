package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

// # ASN.1 Definition:
//
// PDU-wrapper  ::=  SIGNED{TBSPDU-wrapper}
type PDU_wrapper = SIGNED // DefinedType
// # ASN.1 Definition:
//
//	TBSPDU-wrapper ::= SEQUENCE  {
//	  version               Version DEFAULT v1,
//	  signatureAlgorithm    AlgorithmIdentifier {{SupportedSignatureAlgorithms}},
//	  certPath         [0]  IMPLICIT PkiPath,
//	  signedAttrs      [1]  IMPLICIT SignedAttributes OPTIONAL,
//	  conf                  CHOICE {
//	    clear            [2]  WrappedPDUInfo,
//	    protected        [3]  EncryptedInfo,
//	   ... },
//	  ... }
type TBSPDU_wrapper struct {
	Version            Version `asn1:"optional"`
	SignatureAlgorithm pkix.AlgorithmIdentifier
	CertPath           PkiPath          `asn1:"tag:0"`
	SignedAttrs        SignedAttributes `asn1:"optional,tag:1"`
	Conf               TBSPDU_wrapper_conf
}

// # ASN.1 Definition:
//
// SignedAttributes  ::=  SET SIZE (1..MAX) OF Attribute{{SupportedSignedAttributes}}
type SignedAttributes = [](Attribute) // SetOfType
// # ASN.1 Definition:
//
//	WrappedPDUInfo ::= SEQUENCE {
//	  pduType      WRAPPED-PDU.&id ({SupportedPduSet}),
//	  pduInfo      WRAPPED-PDU.&Type ({SupportedPduSet}{@pduType}),
//	  ... }
type WrappedPDUInfo struct {
	PduType asn1.ObjectIdentifier
	PduInfo asn1.RawValue
}

// # ASN.1 Definition:
//
//	EncryptedInfo ::= SEQUENCE {
//	  keyAgreement      KeyAgreement,
//	  encryptedPduInfo  EncryptedPduInfo,
//	  ... }
type EncryptedInfo struct {
	KeyAgreement     KeyAgreement
	EncryptedPduInfo EncryptedPduInfo
}

// # ASN.1 Definition:
//
//	KeyAgreement ::= SEQUENCE {
//	  senderDhInfo       [0] SenderDhInfo,
//	  keyEncryptionAlgorithm SEQUENCE {
//	    algorithm    ALGORITHM.&id ({SupportedKeyEncryptionAlgorithm}),
//	    parameters   ALGORITHM.&Type({SupportedKeyEncryptionAlgorithm}{@.algorithm}),
//	    ... },
//	  ... }
type KeyAgreement struct {
	SenderDhInfo           SenderDhInfo `asn1:"explicit,tag:0"`
	KeyEncryptionAlgorithm KeyAgreement_keyEncryptionAlgorithm
}

// # ASN.1 Definition:
//
//	SenderDhInfo  ::=  CHOICE {
//	  senderStaticInfo   [0] SenderStaticInfo,
//	  senderDhPublicKey  [1] SenderDhPublicKey,
//	  ... }
type SenderDhInfo = asn1.RawValue

// # ASN.1 Definition:
//
//	SenderStaticInfo ::= SEQUENCE {
//	  issuer       Name,
//	  serialNumber CertificateSerialNumber,
//	  partyAinfo   UserKeyingMaterial,
//	  ... }
type SenderStaticInfo struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
	PartyAinfo   UserKeyingMaterial
}

// # ASN.1 Definition:
//
//	SenderDhPublicKey ::= SEQUENCE {
//	  algorithm   AlgorithmIdentifier {{SupportedDHPublicKeyAlgorithms}},
//	  publicKey   BIT STRING,
//	  ... }
type SenderDhPublicKey struct {
	Algorithm pkix.AlgorithmIdentifier
	PublicKey asn1.BitString
}

// # ASN.1 Definition:
//
// UserKeyingMaterial  ::=  OCTET STRING (SIZE (64))
type UserKeyingMaterial = []byte // OctetStringType
// # ASN.1 Definition:
//
//	EncryptedPduInfo ::= SEQUENCE {
//	  pduType                 WRAPPED-PDU.&id ({SupportedPduSet}),
//	  encryptedKey            EncryptedKey OPTIONAL,
//	  pduEncryptionAlgorithm  SEQUENCE {
//	    algorithm               ALGORITHM.&id ({SymmetricEncryptionAlgorithms}),
//	    parameter               ALGORITHM.&Type
//	                  ({SymmetricEncryptionAlgorithms}{@.algorithm})} OPTIONAL,
//	  encryptedPdu        [0] EncryptedPdu,
//	  ... }
type EncryptedPduInfo struct {
	PduType                asn1.ObjectIdentifier
	EncryptedKey           EncryptedKey                            `asn1:"optional"`
	PduEncryptionAlgorithm EncryptedPduInfo_pduEncryptionAlgorithm `asn1:"optional"`
	EncryptedPdu           EncryptedPdu                            `asn1:"explicit,tag:0"`
}

// # ASN.1 Definition:
//
// EncryptedKey  ::=  OCTET STRING
type EncryptedKey = []byte // OctetStringType
// # ASN.1 Definition:
//
// EncryptedPdu  ::=  OCTET STRING
type EncryptedPdu = []byte // OctetStringType
// # ASN.1 Definition:
//
// AttributeCertificateV2  ::=  AttributeCertificate
type AttributeCertificateV2 = AttributeCertificate // DefinedType
// # ASN.1 Definition:
//
// id-contentType OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 3 }
var Id_contentType asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 9, 3} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-messageDigest OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 4 }
var Id_messageDigest asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 9, 4} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
//	PkiWaError  ::=  ENUMERATED {
//	  unsupportedWrapperVersion           (0),
//	  unsupportedSignatureAlgorithm       (1),
//	  incompleteCertPath                  (2),
//	  certificationPathFailure            (3),
//	  invalidSignature                    (4),
//	  missingMandatoryAttributes          (5),
//	  unwantedAttribute                   (6),
//	  unsupportedPduType                  (7),
//	  unexpectedPduType                   (8),
//	  invalidPduSyntax                    (9),
//	  unknownDHpkCetificate               (10),
//	  invalidKeyingMaterial               (11),
//	  dhAlgorithmMismatch                 (12),
//	  invalideDhPublickey                 (13),
//	  unsupportedKeyWrappingAlgorithm     (14),
//	  keyEncAlgorithmParametersMissing    (15),
//	  keyEncAlgorithmParametersNotAllowed (16),
//	  invalidParmsForSymEncryptAlgorithms (17),
//	  decryptionFailed                    (18),
//	  ... }
type PkiWaError = asn1.Enumerated

const (
	PkiWaError_UnsupportedWrapperVersion           PkiWaError = 0
	PkiWaError_UnsupportedSignatureAlgorithm       PkiWaError = 1
	PkiWaError_IncompleteCertPath                  PkiWaError = 2
	PkiWaError_CertificationPathFailure            PkiWaError = 3
	PkiWaError_InvalidSignature                    PkiWaError = 4
	PkiWaError_MissingMandatoryAttributes          PkiWaError = 5
	PkiWaError_UnwantedAttribute                   PkiWaError = 6
	PkiWaError_UnsupportedPduType                  PkiWaError = 7
	PkiWaError_UnexpectedPduType                   PkiWaError = 8
	PkiWaError_InvalidPduSyntax                    PkiWaError = 9
	PkiWaError_UnknownDHpkCetificate               PkiWaError = 10
	PkiWaError_InvalidKeyingMaterial               PkiWaError = 11
	PkiWaError_DhAlgorithmMismatch                 PkiWaError = 12
	PkiWaError_InvalideDhPublickey                 PkiWaError = 13
	PkiWaError_UnsupportedKeyWrappingAlgorithm     PkiWaError = 14
	PkiWaError_KeyEncAlgorithmParametersMissing    PkiWaError = 15
	PkiWaError_KeyEncAlgorithmParametersNotAllowed PkiWaError = 16
	PkiWaError_InvalidParmsForSymEncryptAlgorithms PkiWaError = 17
	PkiWaError_DecryptionFailed                    PkiWaError = 18
)

// # ASN.1 Definition:
//
// TBSPDU-wrapper-conf ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type TBSPDU_wrapper_conf = asn1.RawValue

// # ASN.1 Definition:
//
// KeyAgreement-keyEncryptionAlgorithm ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type KeyAgreement_keyEncryptionAlgorithm struct {
	Algorithm  asn1.ObjectIdentifier
	Parameters asn1.RawValue
}

// # ASN.1 Definition:
//
// EncryptedPduInfo-pduEncryptionAlgorithm ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type EncryptedPduInfo_pduEncryptionAlgorithm struct {
	Algorithm asn1.ObjectIdentifier
	Parameter asn1.RawValue
}
