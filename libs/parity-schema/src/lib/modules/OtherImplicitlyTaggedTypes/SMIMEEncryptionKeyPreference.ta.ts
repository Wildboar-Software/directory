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
import { IssuerAndSerialNumber, _decode_IssuerAndSerialNumber, _encode_IssuerAndSerialNumber } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/IssuerAndSerialNumber.ta";
export { IssuerAndSerialNumber, _decode_IssuerAndSerialNumber, _encode_IssuerAndSerialNumber } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/IssuerAndSerialNumber.ta";
import { RecipientKeyIdentifier, _decode_RecipientKeyIdentifier, _encode_RecipientKeyIdentifier } from "../CryptographicMessageSyntax-2009/RecipientKeyIdentifier.ta";
export { RecipientKeyIdentifier, _decode_RecipientKeyIdentifier, _encode_RecipientKeyIdentifier } from "../CryptographicMessageSyntax-2009/RecipientKeyIdentifier.ta";
import { SubjectKeyIdentifier, _decode_SubjectKeyIdentifier, _encode_SubjectKeyIdentifier } from "../CryptographicMessageSyntax-2009/SubjectKeyIdentifier.ta";
export { SubjectKeyIdentifier, _decode_SubjectKeyIdentifier, _encode_SubjectKeyIdentifier } from "../CryptographicMessageSyntax-2009/SubjectKeyIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION SMIMEEncryptionKeyPreference */
/**
 * @summary SMIMEEncryptionKeyPreference
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SMIMEEncryptionKeyPreference  ::=  CHOICE {
 *     issuerAndSerialNumber   [0] IssuerAndSerialNumber,
 *     receipentKeyId          [1] RecipientKeyIdentifier,
 *     subjectAltKeyIdentifier [2] SubjectKeyIdentifier
 * }
 * ```
 */
export
type SMIMEEncryptionKeyPreference =
    { issuerAndSerialNumber: IssuerAndSerialNumber } /* CHOICE_ALT_ROOT */
    | { receipentKeyId: RecipientKeyIdentifier } /* CHOICE_ALT_ROOT */
    | { subjectAltKeyIdentifier: SubjectKeyIdentifier } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION SMIMEEncryptionKeyPreference */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SMIMEEncryptionKeyPreference */
let _cached_decoder_for_SMIMEEncryptionKeyPreference: $.ASN1Decoder<SMIMEEncryptionKeyPreference> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SMIMEEncryptionKeyPreference */

/* START_OF_SYMBOL_DEFINITION _decode_SMIMEEncryptionKeyPreference */
/**
 * @summary Decodes an ASN.1 element into a(n) SMIMEEncryptionKeyPreference
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SMIMEEncryptionKeyPreference} The decoded data structure.
 */
export
function _decode_SMIMEEncryptionKeyPreference (el: _Element) {
    if (!_cached_decoder_for_SMIMEEncryptionKeyPreference) { _cached_decoder_for_SMIMEEncryptionKeyPreference = $._decode_extensible_choice<SMIMEEncryptionKeyPreference>({
    "CONTEXT 0": [ "issuerAndSerialNumber", $._decode_implicit<IssuerAndSerialNumber>(() => _decode_IssuerAndSerialNumber) ],
    "CONTEXT 1": [ "receipentKeyId", $._decode_implicit<RecipientKeyIdentifier>(() => _decode_RecipientKeyIdentifier) ],
    "CONTEXT 2": [ "subjectAltKeyIdentifier", $._decode_implicit<SubjectKeyIdentifier>(() => _decode_SubjectKeyIdentifier) ]
}); }
    return _cached_decoder_for_SMIMEEncryptionKeyPreference(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SMIMEEncryptionKeyPreference */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SMIMEEncryptionKeyPreference */
let _cached_encoder_for_SMIMEEncryptionKeyPreference: $.ASN1Encoder<SMIMEEncryptionKeyPreference> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SMIMEEncryptionKeyPreference */

/* START_OF_SYMBOL_DEFINITION _encode_SMIMEEncryptionKeyPreference */
/**
 * @summary Encodes a(n) SMIMEEncryptionKeyPreference into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SMIMEEncryptionKeyPreference, encoded as an ASN.1 Element.
 */
export
function _encode_SMIMEEncryptionKeyPreference (value: SMIMEEncryptionKeyPreference, elGetter: $.ASN1Encoder<SMIMEEncryptionKeyPreference>) {
    if (!_cached_encoder_for_SMIMEEncryptionKeyPreference) { _cached_encoder_for_SMIMEEncryptionKeyPreference = $._encode_choice<SMIMEEncryptionKeyPreference>({
    "issuerAndSerialNumber": $._encode_implicit(_TagClass.context, 0, () => _encode_IssuerAndSerialNumber, $.BER),
    "receipentKeyId": $._encode_implicit(_TagClass.context, 1, () => _encode_RecipientKeyIdentifier, $.BER),
    "subjectAltKeyIdentifier": $._encode_implicit(_TagClass.context, 2, () => _encode_SubjectKeyIdentifier, $.BER),
}, $.BER); }
    return _cached_encoder_for_SMIMEEncryptionKeyPreference(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SMIMEEncryptionKeyPreference */

/* eslint-enable */
