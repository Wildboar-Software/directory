/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION _enum_for_FirmwarePackageLoadErrorCode */
/**
 * @summary FirmwarePackageLoadErrorCode
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * FirmwarePackageLoadErrorCode  ::=  ENUMERATED {
 *     decodeFailure                (1),
 *     badContentInfo               (2),
 *     badSignedData                (3),
 *     badEncapContent              (4),
 *     badCertificate               (5),
 *     badSignerInfo                (6),
 *     badSignedAttrs               (7),
 *     badUnsignedAttrs             (8),
 *     missingContent               (9),
 *     noTrustAnchor               (10),
 *     notAuthorized               (11),
 *     badDigestAlgorithm          (12),
 *     badSignatureAlgorithm       (13),
 *     unsupportedKeySize          (14),
 *     signatureFailure            (15),
 *     contentTypeMismatch         (16),
 *     badEncryptedData            (17),
 *     unprotectedAttrsPresent     (18),
 *     badEncryptContent           (19),
 *     badEncryptAlgorithm         (20),
 *     missingCiphertext           (21),
 *     noDecryptKey                (22),
 *     decryptFailure              (23),
 *     badCompressAlgorithm        (24),
 *     missingCompressedContent    (25),
 *     decompressFailure           (26),
 *     wrongHardware               (27),
 *     stalePackage                (28),
 *     notInCommunity              (29),
 *     unsupportedPackageType      (30),
 *     missingDependency           (31),
 *     wrongDependencyVersion      (32),
 *     insufficientMemory          (33),
 *     badFirmware                 (34),
 *     unsupportedParameters       (35),
 *     breaksDependency            (36),
 *     otherError                  (99)
 * }
 * ```@enum {number}
 */
export
enum _enum_for_FirmwarePackageLoadErrorCode {
    decodeFailure = 1,
    badContentInfo = 2,
    badSignedData = 3,
    badEncapContent = 4,
    badCertificate = 5,
    badSignerInfo = 6,
    badSignedAttrs = 7,
    badUnsignedAttrs = 8,
    missingContent = 9,
    noTrustAnchor = 10,
    notAuthorized = 11,
    badDigestAlgorithm = 12,
    badSignatureAlgorithm = 13,
    unsupportedKeySize = 14,
    signatureFailure = 15,
    contentTypeMismatch = 16,
    badEncryptedData = 17,
    unprotectedAttrsPresent = 18,
    badEncryptContent = 19,
    badEncryptAlgorithm = 20,
    missingCiphertext = 21,
    noDecryptKey = 22,
    decryptFailure = 23,
    badCompressAlgorithm = 24,
    missingCompressedContent = 25,
    decompressFailure = 26,
    wrongHardware = 27,
    stalePackage = 28,
    notInCommunity = 29,
    unsupportedPackageType = 30,
    missingDependency = 31,
    wrongDependencyVersion = 32,
    insufficientMemory = 33,
    badFirmware = 34,
    unsupportedParameters = 35,
    breaksDependency = 36,
    otherError = 99,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode */
/**
 * @summary FirmwarePackageLoadErrorCode
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * FirmwarePackageLoadErrorCode  ::=  ENUMERATED {
 *     decodeFailure                (1),
 *     badContentInfo               (2),
 *     badSignedData                (3),
 *     badEncapContent              (4),
 *     badCertificate               (5),
 *     badSignerInfo                (6),
 *     badSignedAttrs               (7),
 *     badUnsignedAttrs             (8),
 *     missingContent               (9),
 *     noTrustAnchor               (10),
 *     notAuthorized               (11),
 *     badDigestAlgorithm          (12),
 *     badSignatureAlgorithm       (13),
 *     unsupportedKeySize          (14),
 *     signatureFailure            (15),
 *     contentTypeMismatch         (16),
 *     badEncryptedData            (17),
 *     unprotectedAttrsPresent     (18),
 *     badEncryptContent           (19),
 *     badEncryptAlgorithm         (20),
 *     missingCiphertext           (21),
 *     noDecryptKey                (22),
 *     decryptFailure              (23),
 *     badCompressAlgorithm        (24),
 *     missingCompressedContent    (25),
 *     decompressFailure           (26),
 *     wrongHardware               (27),
 *     stalePackage                (28),
 *     notInCommunity              (29),
 *     unsupportedPackageType      (30),
 *     missingDependency           (31),
 *     wrongDependencyVersion      (32),
 *     insufficientMemory          (33),
 *     badFirmware                 (34),
 *     unsupportedParameters       (35),
 *     breaksDependency            (36),
 *     otherError                  (99)
 * }
 * ```@enum {number}
 */
export
type FirmwarePackageLoadErrorCode = _enum_for_FirmwarePackageLoadErrorCode;
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode */
/**
 * @summary FirmwarePackageLoadErrorCode
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * FirmwarePackageLoadErrorCode  ::=  ENUMERATED {
 *     decodeFailure                (1),
 *     badContentInfo               (2),
 *     badSignedData                (3),
 *     badEncapContent              (4),
 *     badCertificate               (5),
 *     badSignerInfo                (6),
 *     badSignedAttrs               (7),
 *     badUnsignedAttrs             (8),
 *     missingContent               (9),
 *     noTrustAnchor               (10),
 *     notAuthorized               (11),
 *     badDigestAlgorithm          (12),
 *     badSignatureAlgorithm       (13),
 *     unsupportedKeySize          (14),
 *     signatureFailure            (15),
 *     contentTypeMismatch         (16),
 *     badEncryptedData            (17),
 *     unprotectedAttrsPresent     (18),
 *     badEncryptContent           (19),
 *     badEncryptAlgorithm         (20),
 *     missingCiphertext           (21),
 *     noDecryptKey                (22),
 *     decryptFailure              (23),
 *     badCompressAlgorithm        (24),
 *     missingCompressedContent    (25),
 *     decompressFailure           (26),
 *     wrongHardware               (27),
 *     stalePackage                (28),
 *     notInCommunity              (29),
 *     unsupportedPackageType      (30),
 *     missingDependency           (31),
 *     wrongDependencyVersion      (32),
 *     insufficientMemory          (33),
 *     badFirmware                 (34),
 *     unsupportedParameters       (35),
 *     breaksDependency            (36),
 *     otherError                  (99)
 * }
 * ```@enum {number}
 */
export
const FirmwarePackageLoadErrorCode = _enum_for_FirmwarePackageLoadErrorCode;
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decodeFailure */
/**
 * @summary FirmwarePackageLoadErrorCode_decodeFailure
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_decodeFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decodeFailure; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decodeFailure */

/* START_OF_SYMBOL_DEFINITION decodeFailure */
/**
 * @summary decodeFailure
 * @constant
 * @type {number}
 */
export
const decodeFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decodeFailure; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION decodeFailure */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badContentInfo */
/**
 * @summary FirmwarePackageLoadErrorCode_badContentInfo
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badContentInfo: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badContentInfo; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badContentInfo */

/* START_OF_SYMBOL_DEFINITION badContentInfo */
/**
 * @summary badContentInfo
 * @constant
 * @type {number}
 */
export
const badContentInfo: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badContentInfo; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badContentInfo */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignedData */
/**
 * @summary FirmwarePackageLoadErrorCode_badSignedData
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badSignedData: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignedData; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignedData */

/* START_OF_SYMBOL_DEFINITION badSignedData */
/**
 * @summary badSignedData
 * @constant
 * @type {number}
 */
export
const badSignedData: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignedData; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badSignedData */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncapContent */
/**
 * @summary FirmwarePackageLoadErrorCode_badEncapContent
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badEncapContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncapContent; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncapContent */

/* START_OF_SYMBOL_DEFINITION badEncapContent */
/**
 * @summary badEncapContent
 * @constant
 * @type {number}
 */
export
const badEncapContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncapContent; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badEncapContent */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badCertificate */
/**
 * @summary FirmwarePackageLoadErrorCode_badCertificate
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badCertificate: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badCertificate; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badCertificate */

/* START_OF_SYMBOL_DEFINITION badCertificate */
/**
 * @summary badCertificate
 * @constant
 * @type {number}
 */
export
const badCertificate: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badCertificate; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badCertificate */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignerInfo */
/**
 * @summary FirmwarePackageLoadErrorCode_badSignerInfo
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badSignerInfo: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignerInfo; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignerInfo */

/* START_OF_SYMBOL_DEFINITION badSignerInfo */
/**
 * @summary badSignerInfo
 * @constant
 * @type {number}
 */
export
const badSignerInfo: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignerInfo; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badSignerInfo */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignedAttrs */
/**
 * @summary FirmwarePackageLoadErrorCode_badSignedAttrs
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badSignedAttrs: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignedAttrs; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignedAttrs */

/* START_OF_SYMBOL_DEFINITION badSignedAttrs */
/**
 * @summary badSignedAttrs
 * @constant
 * @type {number}
 */
export
const badSignedAttrs: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignedAttrs; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badSignedAttrs */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badUnsignedAttrs */
/**
 * @summary FirmwarePackageLoadErrorCode_badUnsignedAttrs
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badUnsignedAttrs: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badUnsignedAttrs; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badUnsignedAttrs */

/* START_OF_SYMBOL_DEFINITION badUnsignedAttrs */
/**
 * @summary badUnsignedAttrs
 * @constant
 * @type {number}
 */
export
const badUnsignedAttrs: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badUnsignedAttrs; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badUnsignedAttrs */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingContent */
/**
 * @summary FirmwarePackageLoadErrorCode_missingContent
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_missingContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingContent; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingContent */

/* START_OF_SYMBOL_DEFINITION missingContent */
/**
 * @summary missingContent
 * @constant
 * @type {number}
 */
export
const missingContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingContent; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION missingContent */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_noTrustAnchor */
/**
 * @summary FirmwarePackageLoadErrorCode_noTrustAnchor
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_noTrustAnchor: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.noTrustAnchor; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_noTrustAnchor */

/* START_OF_SYMBOL_DEFINITION noTrustAnchor */
/**
 * @summary noTrustAnchor
 * @constant
 * @type {number}
 */
export
const noTrustAnchor: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.noTrustAnchor; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION noTrustAnchor */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_notAuthorized */
/**
 * @summary FirmwarePackageLoadErrorCode_notAuthorized
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_notAuthorized: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.notAuthorized; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_notAuthorized */

/* START_OF_SYMBOL_DEFINITION notAuthorized */
/**
 * @summary notAuthorized
 * @constant
 * @type {number}
 */
export
const notAuthorized: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.notAuthorized; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION notAuthorized */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badDigestAlgorithm */
/**
 * @summary FirmwarePackageLoadErrorCode_badDigestAlgorithm
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badDigestAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badDigestAlgorithm; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badDigestAlgorithm */

/* START_OF_SYMBOL_DEFINITION badDigestAlgorithm */
/**
 * @summary badDigestAlgorithm
 * @constant
 * @type {number}
 */
export
const badDigestAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badDigestAlgorithm; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badDigestAlgorithm */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignatureAlgorithm */
/**
 * @summary FirmwarePackageLoadErrorCode_badSignatureAlgorithm
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badSignatureAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignatureAlgorithm; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badSignatureAlgorithm */

/* START_OF_SYMBOL_DEFINITION badSignatureAlgorithm */
/**
 * @summary badSignatureAlgorithm
 * @constant
 * @type {number}
 */
export
const badSignatureAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badSignatureAlgorithm; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badSignatureAlgorithm */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedKeySize */
/**
 * @summary FirmwarePackageLoadErrorCode_unsupportedKeySize
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_unsupportedKeySize: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedKeySize; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedKeySize */

/* START_OF_SYMBOL_DEFINITION unsupportedKeySize */
/**
 * @summary unsupportedKeySize
 * @constant
 * @type {number}
 */
export
const unsupportedKeySize: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedKeySize; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION unsupportedKeySize */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_signatureFailure */
/**
 * @summary FirmwarePackageLoadErrorCode_signatureFailure
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_signatureFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.signatureFailure; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_signatureFailure */

/* START_OF_SYMBOL_DEFINITION signatureFailure */
/**
 * @summary signatureFailure
 * @constant
 * @type {number}
 */
export
const signatureFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.signatureFailure; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION signatureFailure */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_contentTypeMismatch */
/**
 * @summary FirmwarePackageLoadErrorCode_contentTypeMismatch
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_contentTypeMismatch: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.contentTypeMismatch; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_contentTypeMismatch */

/* START_OF_SYMBOL_DEFINITION contentTypeMismatch */
/**
 * @summary contentTypeMismatch
 * @constant
 * @type {number}
 */
export
const contentTypeMismatch: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.contentTypeMismatch; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION contentTypeMismatch */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptedData */
/**
 * @summary FirmwarePackageLoadErrorCode_badEncryptedData
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badEncryptedData: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptedData; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptedData */

/* START_OF_SYMBOL_DEFINITION badEncryptedData */
/**
 * @summary badEncryptedData
 * @constant
 * @type {number}
 */
export
const badEncryptedData: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptedData; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badEncryptedData */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unprotectedAttrsPresent */
/**
 * @summary FirmwarePackageLoadErrorCode_unprotectedAttrsPresent
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_unprotectedAttrsPresent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unprotectedAttrsPresent; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unprotectedAttrsPresent */

/* START_OF_SYMBOL_DEFINITION unprotectedAttrsPresent */
/**
 * @summary unprotectedAttrsPresent
 * @constant
 * @type {number}
 */
export
const unprotectedAttrsPresent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unprotectedAttrsPresent; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION unprotectedAttrsPresent */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptContent */
/**
 * @summary FirmwarePackageLoadErrorCode_badEncryptContent
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badEncryptContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptContent; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptContent */

/* START_OF_SYMBOL_DEFINITION badEncryptContent */
/**
 * @summary badEncryptContent
 * @constant
 * @type {number}
 */
export
const badEncryptContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptContent; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badEncryptContent */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptAlgorithm */
/**
 * @summary FirmwarePackageLoadErrorCode_badEncryptAlgorithm
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badEncryptAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptAlgorithm; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badEncryptAlgorithm */

/* START_OF_SYMBOL_DEFINITION badEncryptAlgorithm */
/**
 * @summary badEncryptAlgorithm
 * @constant
 * @type {number}
 */
export
const badEncryptAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badEncryptAlgorithm; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badEncryptAlgorithm */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingCiphertext */
/**
 * @summary FirmwarePackageLoadErrorCode_missingCiphertext
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_missingCiphertext: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingCiphertext; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingCiphertext */

/* START_OF_SYMBOL_DEFINITION missingCiphertext */
/**
 * @summary missingCiphertext
 * @constant
 * @type {number}
 */
export
const missingCiphertext: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingCiphertext; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION missingCiphertext */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_noDecryptKey */
/**
 * @summary FirmwarePackageLoadErrorCode_noDecryptKey
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_noDecryptKey: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.noDecryptKey; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_noDecryptKey */

/* START_OF_SYMBOL_DEFINITION noDecryptKey */
/**
 * @summary noDecryptKey
 * @constant
 * @type {number}
 */
export
const noDecryptKey: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.noDecryptKey; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION noDecryptKey */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decryptFailure */
/**
 * @summary FirmwarePackageLoadErrorCode_decryptFailure
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_decryptFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decryptFailure; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decryptFailure */

/* START_OF_SYMBOL_DEFINITION decryptFailure */
/**
 * @summary decryptFailure
 * @constant
 * @type {number}
 */
export
const decryptFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decryptFailure; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION decryptFailure */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badCompressAlgorithm */
/**
 * @summary FirmwarePackageLoadErrorCode_badCompressAlgorithm
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badCompressAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badCompressAlgorithm; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badCompressAlgorithm */

/* START_OF_SYMBOL_DEFINITION badCompressAlgorithm */
/**
 * @summary badCompressAlgorithm
 * @constant
 * @type {number}
 */
export
const badCompressAlgorithm: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badCompressAlgorithm; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badCompressAlgorithm */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingCompressedContent */
/**
 * @summary FirmwarePackageLoadErrorCode_missingCompressedContent
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_missingCompressedContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingCompressedContent; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingCompressedContent */

/* START_OF_SYMBOL_DEFINITION missingCompressedContent */
/**
 * @summary missingCompressedContent
 * @constant
 * @type {number}
 */
export
const missingCompressedContent: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingCompressedContent; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION missingCompressedContent */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decompressFailure */
/**
 * @summary FirmwarePackageLoadErrorCode_decompressFailure
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_decompressFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decompressFailure; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_decompressFailure */

/* START_OF_SYMBOL_DEFINITION decompressFailure */
/**
 * @summary decompressFailure
 * @constant
 * @type {number}
 */
export
const decompressFailure: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.decompressFailure; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION decompressFailure */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_wrongHardware */
/**
 * @summary FirmwarePackageLoadErrorCode_wrongHardware
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_wrongHardware: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.wrongHardware; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_wrongHardware */

/* START_OF_SYMBOL_DEFINITION wrongHardware */
/**
 * @summary wrongHardware
 * @constant
 * @type {number}
 */
export
const wrongHardware: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.wrongHardware; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION wrongHardware */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_stalePackage */
/**
 * @summary FirmwarePackageLoadErrorCode_stalePackage
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_stalePackage: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.stalePackage; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_stalePackage */

/* START_OF_SYMBOL_DEFINITION stalePackage */
/**
 * @summary stalePackage
 * @constant
 * @type {number}
 */
export
const stalePackage: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.stalePackage; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION stalePackage */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_notInCommunity */
/**
 * @summary FirmwarePackageLoadErrorCode_notInCommunity
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_notInCommunity: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.notInCommunity; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_notInCommunity */

/* START_OF_SYMBOL_DEFINITION notInCommunity */
/**
 * @summary notInCommunity
 * @constant
 * @type {number}
 */
export
const notInCommunity: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.notInCommunity; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION notInCommunity */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedPackageType */
/**
 * @summary FirmwarePackageLoadErrorCode_unsupportedPackageType
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_unsupportedPackageType: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedPackageType; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedPackageType */

/* START_OF_SYMBOL_DEFINITION unsupportedPackageType */
/**
 * @summary unsupportedPackageType
 * @constant
 * @type {number}
 */
export
const unsupportedPackageType: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedPackageType; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION unsupportedPackageType */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingDependency */
/**
 * @summary FirmwarePackageLoadErrorCode_missingDependency
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_missingDependency: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingDependency; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_missingDependency */

/* START_OF_SYMBOL_DEFINITION missingDependency */
/**
 * @summary missingDependency
 * @constant
 * @type {number}
 */
export
const missingDependency: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.missingDependency; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION missingDependency */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_wrongDependencyVersion */
/**
 * @summary FirmwarePackageLoadErrorCode_wrongDependencyVersion
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_wrongDependencyVersion: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.wrongDependencyVersion; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_wrongDependencyVersion */

/* START_OF_SYMBOL_DEFINITION wrongDependencyVersion */
/**
 * @summary wrongDependencyVersion
 * @constant
 * @type {number}
 */
export
const wrongDependencyVersion: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.wrongDependencyVersion; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION wrongDependencyVersion */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_insufficientMemory */
/**
 * @summary FirmwarePackageLoadErrorCode_insufficientMemory
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_insufficientMemory: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.insufficientMemory; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_insufficientMemory */

/* START_OF_SYMBOL_DEFINITION insufficientMemory */
/**
 * @summary insufficientMemory
 * @constant
 * @type {number}
 */
export
const insufficientMemory: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.insufficientMemory; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION insufficientMemory */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badFirmware */
/**
 * @summary FirmwarePackageLoadErrorCode_badFirmware
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_badFirmware: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badFirmware; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_badFirmware */

/* START_OF_SYMBOL_DEFINITION badFirmware */
/**
 * @summary badFirmware
 * @constant
 * @type {number}
 */
export
const badFirmware: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.badFirmware; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION badFirmware */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedParameters */
/**
 * @summary FirmwarePackageLoadErrorCode_unsupportedParameters
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_unsupportedParameters: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedParameters; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_unsupportedParameters */

/* START_OF_SYMBOL_DEFINITION unsupportedParameters */
/**
 * @summary unsupportedParameters
 * @constant
 * @type {number}
 */
export
const unsupportedParameters: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.unsupportedParameters; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION unsupportedParameters */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_breaksDependency */
/**
 * @summary FirmwarePackageLoadErrorCode_breaksDependency
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_breaksDependency: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.breaksDependency; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_breaksDependency */

/* START_OF_SYMBOL_DEFINITION breaksDependency */
/**
 * @summary breaksDependency
 * @constant
 * @type {number}
 */
export
const breaksDependency: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.breaksDependency; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION breaksDependency */

/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_otherError */
/**
 * @summary FirmwarePackageLoadErrorCode_otherError
 * @constant
 * @type {number}
 */
export
const FirmwarePackageLoadErrorCode_otherError: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.otherError; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadErrorCode_otherError */

/* START_OF_SYMBOL_DEFINITION otherError */
/**
 * @summary otherError
 * @constant
 * @type {number}
 */
export
const otherError: FirmwarePackageLoadErrorCode = FirmwarePackageLoadErrorCode.otherError; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION otherError */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadErrorCode */
let _cached_decoder_for_FirmwarePackageLoadErrorCode: $.ASN1Decoder<FirmwarePackageLoadErrorCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadErrorCode */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePackageLoadErrorCode
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePackageLoadErrorCode} The decoded data structure.
 */
export
function _decode_FirmwarePackageLoadErrorCode (el: _Element) {
    if (!_cached_decoder_for_FirmwarePackageLoadErrorCode) { _cached_decoder_for_FirmwarePackageLoadErrorCode = $._decodeEnumerated; }
    return _cached_decoder_for_FirmwarePackageLoadErrorCode(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadErrorCode */
let _cached_encoder_for_FirmwarePackageLoadErrorCode: $.ASN1Encoder<FirmwarePackageLoadErrorCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadErrorCode */
/**
 * @summary Encodes a(n) FirmwarePackageLoadErrorCode into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePackageLoadErrorCode, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePackageLoadErrorCode (value: FirmwarePackageLoadErrorCode, elGetter: $.ASN1Encoder<FirmwarePackageLoadErrorCode>) {
    if (!_cached_encoder_for_FirmwarePackageLoadErrorCode) { _cached_encoder_for_FirmwarePackageLoadErrorCode = $._encodeEnumerated; }
    return _cached_encoder_for_FirmwarePackageLoadErrorCode(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadErrorCode */

/* eslint-enable */
