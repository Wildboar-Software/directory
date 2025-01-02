package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
	"math/big"
)

// # ASN.1 Definition:
//
// ID ::= OBJECT IDENTIFIER
// type ID = asn1.ObjectIdentifier
// # ASN.1 Definition:
//
//	nullAlgorithm           ID ::= {algorithm 0}
var NullAlgorithm ID = []int{2, 5, 8, 0}

// # ASN.1 Definition:
//
//	encryptionAlgorithm     ID ::= {algorithm 1}
var EncryptionAlgorithm ID = []int{2, 5, 8, 1}

// # ASN.1 Definition:
//
//	hashAlgorithm           ID ::= {algorithm 2}
var HashAlgorithm ID = []int{2, 5, 8, 2}

// # ASN.1 Definition:
//
//	signatureAlgorithm      ID ::= {algorithm 3}
var SignatureAlgorithm ID = []int{2, 5, 8, 3}

// # ASN.1 Definition:
//
//	id-ea                   ID ::= encryptionAlgorithm
var Id_ea ID = EncryptionAlgorithm

// # ASN.1 Definition:
//
//	id-ha                   ID ::= hashAlgorithm
var Id_ha ID = HashAlgorithm

// # ASN.1 Definition:
//
//	id-sa                   ID ::= signatureAlgorithm
var Id_sa ID = SignatureAlgorithm

// # ASN.1 Definition:
//
//	id-ea-rsa               ID ::= {id-ea 1}
var Id_ea_rsa ID = []int{2, 5, 8, 1, 1}

// # ASN.1 Definition:
//
//	id-ha-sqMod-n           ID ::= {id-ha 1}
var Id_ha_sqMod_n ID = []int{2, 5, 8, 2, 1}

// # ASN.1 Definition:
//
//	id-sa-sqMod-nWithRSA    ID ::= {id-sa 1}
var Id_sa_sqMod_nWithRSA ID = []int{2, 5, 8, 3, 1}

// # ASN.1 Definition:
//
//	us-iso                  ID ::= { iso(1) member-body(2) us(840) }
var Us_iso ID = []int{1, 2, 840}

// # ASN.1 Definition:
//
//	ansi-x9-57              ID ::= { us-iso ansi-x9-57(10040) }
var Ansi_x9_57 ID = []int{1, 2, 840, 10040}

// # ASN.1 Definition:
//
//	ansi-x9-62              ID ::= { us-iso ansi-x962(10045) }
var Ansi_x9_62 ID = []int{1, 2, 840, 10045}

// # ASN.1 Definition:
//
//	ansi-x9-42              ID ::= { us-iso ansi-x942(10046) }
var Ansi_x9_42 ID = []int{1, 2, 840, 10046}

// # ASN.1 Definition:
//
//	iso-standard            ID ::= { iso(1) standard(0) }
var Iso_standard ID = []int{1, 0}

// # ASN.1 Definition:
//
//	iso9797                 ID ::= { iso-standard message-authentication-codes(9797) }
var Iso9797 ID = []int{1, 0, 9797}

// # ASN.1 Definition:
//
//	iso-organization        ID ::= { iso(1) identified-organization(3) }
var Iso_organization ID = []int{1, 3}

// # ASN.1 Definition:
//
//	certicom                ID ::= { iso-organization certicom(132) }
var Certicom ID = []int{1, 3, 132}

// # ASN.1 Definition:
//
//	certicom-curve          ID ::= { certicom curve(0) }
var Certicom_curve ID = []int{1, 3, 132, 0}

// # ASN.1 Definition:
//
//	teletrust               ID ::= { iso-organization teletrust(36) }
var Teletrust ID = []int{1, 3, 36}

// # ASN.1 Definition:
//
//	ecStdCurvesAndGen       ID ::= { teletrust algorithm(3) signature-algorithm(3) ecSign(2) 8}
var EcStdCurvesAndGen ID = []int{1, 3, 36, 3, 3, 2, 8}

// # ASN.1 Definition:
//
//	versionOne              ID ::= { ecStdCurvesAndGen ellipticCurve(1) versionOne(1) }
var VersionOne ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1}

// # ASN.1 Definition:
//
//	us-joint                ID ::= { joint-iso-itu-t(2) country(16) us(840) }
var Us_joint ID = []int{2, 16, 840}

// # ASN.1 Definition:
//
//	usgov                   ID ::= { us-joint organization(1) gov(101) }
var Usgov ID = []int{2, 16, 840, 1, 101}

// # ASN.1 Definition:
//
//	dodAlgorithms           ID ::= { usgov dod(2) infosec(1) algorithms(1) }
var DodAlgorithms ID = []int{2, 16, 840, 1, 101, 2, 1, 1}

// # ASN.1 Definition:
//
//	csor                    ID ::= { usgov csor(3) }
var Csor ID = []int{2, 16, 840, 1, 101, 3}

// # ASN.1 Definition:
//
//	nistAlgorithms          ID ::= { csor nistAlgorithm(4) }
var NistAlgorithms ID = []int{2, 16, 840, 1, 101, 3, 4}

// # ASN.1 Definition:
//
//	aes                     ID ::= { nistAlgorithms 1 }
var Aes ID = []int{2, 16, 840, 1, 101, 3, 4, 1}

// # ASN.1 Definition:
//
//	hashAlgs                ID ::= { nistAlgorithms hashalgs(2) }
var HashAlgs ID = []int{2, 16, 840, 1, 101, 3, 4, 2}

// # ASN.1 Definition:
//
//	sigAlgs                 ID ::= { nistAlgorithms 3 }
var SigAlgs ID = []int{2, 16, 840, 1, 101, 3, 4, 3}

// # ASN.1 Definition:
//
//	rsadsi                  ID ::= { iso(1) member-body(2) us(840) rsadsi(113549) }
var Rsadsi ID = []int{1, 2, 840, 113549}

// # ASN.1 Definition:
//
//	pkcs-1                  ID ::= { rsadsi pkcs(1) pkcs-1(1) }
var Pkcs_1 ID = []int{1, 2, 840, 113549, 1, 1}

// # ASN.1 Definition:
//
//	digestAlgorithm         ID ::= { rsadsi digestAlgorithm(2) }
var DigestAlgorithm ID = []int{1, 2, 840, 113549, 2}

// # ASN.1 Definition:
//
//	id-aes128-CBC           ID ::= { aes 2 }
var Id_aes128_CBC ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 2}

// # ASN.1 Definition:
//
//	id-aes192-CBC           ID ::= { aes 22 }
var Id_aes192_CBC ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 22}

// # ASN.1 Definition:
//
//	id-aes256-CBC           ID ::= { aes 42 }
var Id_aes256_CBC ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 42}

// # ASN.1 Definition:
//
//	id-aes128-wrap          ID ::= { aes 5 }
var Id_aes128_wrap ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 5}

// # ASN.1 Definition:
//
//	id-aes192-wrap          ID ::= { aes 25 }
var Id_aes192_wrap ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 25}

// # ASN.1 Definition:
//
//	id-aes256-wrap          ID ::= { aes 45 }
var Id_aes256_wrap ID = []int{2, 16, 840, 1, 101, 3, 4, 1, 45}

// # ASN.1 Definition:
//
//	rsaEncryption           ID ::= { pkcs-1 rsaEncryption(1)}
var RsaEncryption ID = []int{1, 2, 840, 113549, 1, 1, 1}

// # ASN.1 Definition:
//
//	id-keyExchangeAlgorithm ID ::= { dodAlgorithms id-keyExchangeAlgorithm(22)}
var Id_keyExchangeAlgorithm ID = []int{2, 16, 840, 1, 101, 2, 1, 1, 22}

// # ASN.1 Definition:
//
//	id-dsa                  ID ::= { ansi-x9-57 x9algorithm(4) 1 }
var Id_dsa ID = []int{1, 2, 840, 10040, 4, 1}

// # ASN.1 Definition:
//
//	id-ecPublicKey          ID ::= { ansi-x9-62 keyType(2) 1 }
var Id_ecPublicKey ID = []int{1, 2, 840, 10045, 2, 1}

// # ASN.1 Definition:
//
//	id-ecDH                 ID ::= { certicom schemes(1) ecdh(12) }
var Id_ecDH ID = []int{1, 3, 132, 1, 12}

// # ASN.1 Definition:
//
//	id-ecMQV                ID ::= { certicom schemes(1) ecmqv(13) }
var Id_ecMQV ID = []int{1, 3, 132, 1, 13}

// # ASN.1 Definition:
//
//	dh-public-number        ID ::= { ansi-x9-42 number-type(2) dh-public-number(1) }
var Dh_public_number ID = []int{1, 2, 840, 10046, 2, 1}

// # ASN.1 Definition:
//
//	id-sha1 ID ::= {iso(1) identified-organization(3) oiw(14) secsig(3) algorithms(2) 26}
var Id_sha1 ID = []int{1, 3, 14, 3, 2, 26}

// # ASN.1 Definition:
//
//	id-sha256               ID ::= { hashAlgs 1 }
var Id_sha256 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 1}

// # ASN.1 Definition:
//
//	id-sha384               ID ::= { hashAlgs 2 }
var Id_sha384 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 2}

// # ASN.1 Definition:
//
//	id-sha512               ID ::= { hashAlgs 3 }
var Id_sha512 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 3}

// # ASN.1 Definition:
//
//	id-sha224               ID ::= { hashAlgs 4 }
var Id_sha224 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 4}

// # ASN.1 Definition:
//
//	id-sha512-224           ID ::= { hashAlgs 5 }
var Id_sha512_224 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 5}

// # ASN.1 Definition:
//
//	id-sha512-256           ID ::= { hashAlgs 6 }
var Id_sha512_256 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 6}

// # ASN.1 Definition:
//
//	id-sha3-224             ID ::= { hashAlgs 7 }
var Id_sha3_224 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 7}

// # ASN.1 Definition:
//
//	id-sha3-256             ID ::= { hashAlgs 8 }
var Id_sha3_256 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 8}

// # ASN.1 Definition:
//
//	id-sha3-384             ID ::= { hashAlgs 9 }
var Id_sha3_384 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 9}

// # ASN.1 Definition:
//
//	id-sha3-512             ID ::= { hashAlgs 10 }
var Id_sha3_512 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 10}

// # ASN.1 Definition:
//
//	id-shake128             ID ::= { hashAlgs 11 }
var Id_shake128 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 11}

// # ASN.1 Definition:
//
//	id-shake256             ID ::= { hashAlgs 12 }
var Id_shake256 ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 12}

// # ASN.1 Definition:
//
//	id-shake128-len         ID ::= { hashAlgs 17 }
var Id_shake128_len ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 17}

// # ASN.1 Definition:
//
//	id-shake256-len         ID ::= { hashAlgs 18 }
var Id_shake256_len ID = []int{2, 16, 840, 1, 101, 3, 4, 2, 18}

// # ASN.1 Definition:
//
//	  hashAlg ID ::= { iso(1) identified-organization(3) dod(6) internet(1)
//		private(4) enterprise(1) kudelski(1722)
//		cryptography(12) 2 }
var HashAlg ID = []int{1, 3, 6, 1, 4, 1, 1722, 12, 2}

// # ASN.1 Definition:
//
//	sha1WithRSAEncryption   ID ::= { pkcs-1 sha1WithRSAEncryption(5) }
var Sha1WithRSAEncryption ID = []int{1, 2, 840, 113549, 1, 1, 5}

// # ASN.1 Definition:
//
//	sha256WithRSAEncryption ID ::= { pkcs-1 sha256WithRSAEncryption(11) }
var Sha256WithRSAEncryption ID = []int{1, 2, 840, 113549, 1, 1, 11}

// # ASN.1 Definition:
//
//	sha384WithRSAEncryption ID ::= { pkcs-1 sha384WithRSAEncryption(12) }
var Sha384WithRSAEncryption ID = []int{1, 2, 840, 113549, 1, 1, 12}

// # ASN.1 Definition:
//
//	sha512WithRSAEncryption ID ::= { pkcs-1 sha512WithRSAEncryption(13) }
var Sha512WithRSAEncryption ID = []int{1, 2, 840, 113549, 1, 1, 13}

// # ASN.1 Definition:
//
//	sha224WithRSAEncryption ID ::= { pkcs-1 sha224WithRSAEncryption(14) }
var Sha224WithRSAEncryption ID = []int{1, 2, 840, 113549, 1, 1, 14}

// # ASN.1 Definition:
//
//	id-RSASSA-PSS           ID ::= { pkcs-1 10 }
var Id_RSASSA_PSS ID = []int{1, 2, 840, 113549, 1, 1, 10}

// # ASN.1 Definition:
//
//	id-mgf1                 ID ::= { pkcs-1 8 }
var Id_mgf1 ID = []int{1, 2, 840, 113549, 1, 1, 8}

// # ASN.1 Definition:
//
//	  id-dsa-with-sha1        ID ::= {iso(1) member-body(2) us(840) x9-57(10040) x9algorithm(4)
//
//		dsa-with-sha1(3)}
var Id_dsa_with_sha1 ID = []int{1, 2, 840, 10040, 4, 3}

// # ASN.1 Definition:
//
//	id-dsa-with-sha224      ID ::= { sigAlgs 1 }
var Id_dsa_with_sha224 ID = []int{2, 16, 840, 1, 101, 3, 4, 3, 1}

// # ASN.1 Definition:
//
//	id-dsa-with-sha256      ID ::= { sigAlgs 2 }
var Id_dsa_with_sha256 ID = []int{2, 16, 840, 1, 101, 3, 4, 3, 2}

// # ASN.1 Definition:
//
//	ecdsa-with-SHA224       ID ::= { ansi-x9-62 signatures(4) ecdsa-with-SHA2(3) 1 }
var Ecdsa_with_SHA224 ID = []int{1, 2, 840, 10045, 4, 3, 1}

// # ASN.1 Definition:
//
//	ecdsa-with-SHA256       ID ::= { ansi-x9-62 signatures(4) ecdsa-with-SHA2(3) 2 }
var Ecdsa_with_SHA256 ID = []int{1, 2, 840, 10045, 4, 3, 2}

// # ASN.1 Definition:
//
//	ecdsa-with-SHA384       ID ::= { ansi-x9-62 signatures(4) ecdsa-with-SHA2(3) 3 }
var Ecdsa_with_SHA384 ID = []int{1, 2, 840, 10045, 4, 3, 3}

// # ASN.1 Definition:
//
//	ecdsa-with-SHA512       ID ::= { ansi-x9-62 signatures(4) ecdsa-with-SHA2(3) 4 }
var Ecdsa_with_SHA512 ID = []int{1, 2, 840, 10045, 4, 3, 4}

// # ASN.1 Definition:
//
//	secp192r1       ID ::= { ansi-x9-62 curves(3) prime(1) 1 }
var Secp192r1 ID = []int{1, 2, 840, 10045, 3, 1, 1}

// # ASN.1 Definition:
//
//	sect163k1       ID ::= { certicom-curve 1 }
var Sect163k1 ID = []int{1, 3, 132, 0, 1}

// # ASN.1 Definition:
//
//	sect163r2       ID ::= { certicom-curve 15 }
var Sect163r2 ID = []int{1, 3, 132, 0, 15}

// # ASN.1 Definition:
//
//	secp224r1       ID ::= { certicom-curve 33 }
var Secp224r1 ID = []int{1, 3, 132, 0, 33}

// # ASN.1 Definition:
//
//	sect233k1       ID ::= { certicom-curve 26 }
var Sect233k1 ID = []int{1, 3, 132, 0, 26}

// # ASN.1 Definition:
//
//	sect233r1       ID ::= { certicom-curve 27 }
var Sect233r1 ID = []int{1, 3, 132, 0, 27}

// # ASN.1 Definition:
//
//	secp256r1       ID ::= { ansi-x9-62 curves(3) prime(1) 7 }
var Secp256r1 ID = []int{1, 2, 840, 10045, 3, 1, 7}

// # ASN.1 Definition:
//
//	sect283k1       ID ::= { certicom-curve 16 }
var Sect283k1 ID = []int{1, 3, 132, 0, 16}

// # ASN.1 Definition:
//
//	sect283r1       ID ::= { certicom-curve 17 }
var Sect283r1 ID = []int{1, 3, 132, 0, 17}

// # ASN.1 Definition:
//
//	secp384r1       ID ::= { certicom-curve 34 }
var Secp384r1 ID = []int{1, 3, 132, 0, 34}

// # ASN.1 Definition:
//
//	sect409k1       ID ::= { certicom-curve 36 }
var Sect409k1 ID = []int{1, 3, 132, 0, 36}

// # ASN.1 Definition:
//
//	sect409r1       ID ::= { certicom-curve 37 }
var Sect409r1 ID = []int{1, 3, 132, 0, 37}

// # ASN.1 Definition:
//
//	secp521r1       ID ::= { certicom-curve 35 }
var Secp521r1 ID = []int{1, 3, 132, 0, 35}

// # ASN.1 Definition:
//
//	sect571k1       ID ::= { certicom-curve 38 }
var Sect571k1 ID = []int{1, 3, 132, 0, 38}

// # ASN.1 Definition:
//
//	sect571r1       ID ::= { certicom-curve 39 }
var Sect571r1 ID = []int{1, 3, 132, 0, 39}

// # ASN.1 Definition:
//
//	brainpoolP160r1 ID ::= { versionOne 1 }
var BrainpoolP160r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 1}

// # ASN.1 Definition:
//
//	brainpoolP160t1 ID ::= { versionOne 2 }
var BrainpoolP160t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 2}

// # ASN.1 Definition:
//
//	brainpoolP192r1 ID ::= { versionOne 3 }
var BrainpoolP192r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 3}

// # ASN.1 Definition:
//
//	brainpoolP192t1 ID ::= { versionOne 4 }
var BrainpoolP192t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 4}

// # ASN.1 Definition:
//
//	brainpoolP224r1 ID ::= { versionOne 5 }
var BrainpoolP224r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 5}

// # ASN.1 Definition:
//
//	brainpoolP224t1 ID ::= { versionOne 6 }
var BrainpoolP224t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 6}

// # ASN.1 Definition:
//
//	brainpoolP256r1 ID ::= { versionOne 7 }
var BrainpoolP256r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 7}

// # ASN.1 Definition:
//
//	brainpoolP256t1 ID ::= { versionOne 8 }
var BrainpoolP256t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 8}

// # ASN.1 Definition:
//
//	brainpoolP320r1 ID ::= { versionOne 9 }
var BrainpoolP320r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 9}

// # ASN.1 Definition:
//
//	brainpoolP320t1 ID ::= { versionOne 10 }
var BrainpoolP320t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 10}

// # ASN.1 Definition:
//
//	brainpoolP384r1 ID ::= { versionOne 11 }
var BrainpoolP384r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 11}

// # ASN.1 Definition:
//
//	brainpoolP384t1 ID ::= { versionOne 12 }
var BrainpoolP384t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 12}

// # ASN.1 Definition:
//
//	brainpoolP512r1 ID ::= { versionOne 13 }
var BrainpoolP512r1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 13}

// # ASN.1 Definition:
//
//	brainpoolP512t1 ID ::= { versionOne 14 }
var BrainpoolP512t1 ID = []int{1, 3, 36, 3, 3, 2, 8, 1, 1, 14}

// # ASN.1 Definition:
//
//	  X509Curves OBJECT IDENTIFIER ::= { secp192r1 | sect163k1 | sect163r2 | secp224r1 | sect233k1 |
//		  sect233r1 | secp256r1 | sect283k1 | sect283r1 | secp384r1 |
//		  sect409k1 | sect409r1 | secp521r1 | sect571k1 | sect571r1 }
type X509Curves = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	id-hmacWithSHA224       ID ::= { digestAlgorithm 8 }
var Id_hmacWithSHA224 ID = []int{1, 2, 840, 113549, 2, 8}

// # ASN.1 Definition:
//
//	id-hmacWithSHA256       ID ::= { digestAlgorithm 9 }
var Id_hmacWithSHA256 ID = []int{1, 2, 840, 113549, 2, 9}

// # ASN.1 Definition:
//
//	id-hmacWithSHA384       ID ::= { digestAlgorithm 10 }
var Id_hmacWithSHA384 ID = []int{1, 2, 840, 113549, 2, 10}

// # ASN.1 Definition:
//
//	id-hmacWithSHA512       ID ::= { digestAlgorithm 11 }
var Id_hmacWithSHA512 ID = []int{1, 2, 840, 113549, 2, 11}

// # ASN.1 Definition:
//
//	id-gmac                 ID ::= { iso9797 part3(3) gmac(4) }
var Id_gmac ID = []int{1, 0, 9797, 3, 4}

// # ASN.1 Definition:
//
//	ShakeOutputLen ::= INTEGER
type ShakeOutputLen = int64

// # ASN.1 Definition:
//
//	AES-InitializationVector ::= OCTET STRING (SIZE (16))
type AES_InitializationVector = []byte

// # ASN.1 Definition:
//
//	KEA-Parms-Id ::= OCTET STRING (SIZE (10))
type KEA_Parms_Id = []byte

// # ASN.1 Definition:
//
//	DSS-Parms ::= SEQUENCE {
//	  p   INTEGER,
//	  q   INTEGER,
//	  g   INTEGER,
//	  ... }
type DSS_Parms struct {
	P *big.Int
	Q *big.Int
	G *big.Int
}

// # ASN.1 Definition:
//
//	DomainParameters ::= SEQUENCE {
//	  p               INTEGER, -- odd prime, p=jq+1
//	  g               INTEGER, -- generator, g
//	  q               INTEGER, -- factor of p-1
//	  j               INTEGER  OPTIONAL, -- subgroup factor
//	  validationParms ValidationParms OPTIONAL,
//	  ... }
type DomainParameters struct {
	P               *big.Int
	G               *big.Int
	Q               *big.Int
	J               *big.Int        `asn1:"optional"`
	ValidationParms ValidationParms `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	ValidationParms ::= SEQUENCE {
//	  seed         BIT STRING,
//	  pgenCounter  INTEGER,
//	  ... }
type ValidationParms struct {
	Seed        asn1.BitString
	PgenCounter int
}

// # ASN.1 Definition:
//
//	rSASSA-PSS-Type ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type RSASSA_PSS_Type struct {
	HashAlgorithm pkix.AlgorithmIdentifier `asn1:"explicit,tag:0"`
	SaltLength    int                      `asn1:"optional,explicit,tag:2,default:20"`
	TrailerField  int                      `asn1:"optional,explicit,tag:3,default:1"`
}
