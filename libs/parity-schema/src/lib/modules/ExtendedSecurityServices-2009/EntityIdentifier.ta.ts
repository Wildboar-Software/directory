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
import { IssuerAndSerialNumber, _decode_IssuerAndSerialNumber, _encode_IssuerAndSerialNumber } from "../ExtendedSecurityServices-2009/IssuerAndSerialNumber.ta";
export { IssuerAndSerialNumber, _decode_IssuerAndSerialNumber, _encode_IssuerAndSerialNumber } from "../ExtendedSecurityServices-2009/IssuerAndSerialNumber.ta";
import { SubjectKeyIdentifier, _decode_SubjectKeyIdentifier, _encode_SubjectKeyIdentifier } from "../ExtendedSecurityServices-2009/SubjectKeyIdentifier.ta";
export { SubjectKeyIdentifier, _decode_SubjectKeyIdentifier, _encode_SubjectKeyIdentifier } from "../ExtendedSecurityServices-2009/SubjectKeyIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION EntityIdentifier */
/**
 * @summary EntityIdentifier
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * EntityIdentifier  ::=  CHOICE {
 *     issuerAndSerialNumber IssuerAndSerialNumber,
 *     subjectKeyIdentifier SubjectKeyIdentifier }
 * ```
 */
export
type EntityIdentifier =
    { issuerAndSerialNumber: IssuerAndSerialNumber } /* CHOICE_ALT_ROOT */
    | { subjectKeyIdentifier: SubjectKeyIdentifier } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EntityIdentifier */
let _cached_decoder_for_EntityIdentifier: $.ASN1Decoder<EntityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_EntityIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) EntityIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EntityIdentifier} The decoded data structure.
 */
export
function _decode_EntityIdentifier (el: _Element) {
    if (!_cached_decoder_for_EntityIdentifier) { _cached_decoder_for_EntityIdentifier = $._decode_inextensible_choice<EntityIdentifier>({
    "UNIVERSAL 16": [ "issuerAndSerialNumber", _decode_IssuerAndSerialNumber ],
    "UNIVERSAL 4": [ "subjectKeyIdentifier", _decode_SubjectKeyIdentifier ]
}); }
    return _cached_decoder_for_EntityIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EntityIdentifier */
let _cached_encoder_for_EntityIdentifier: $.ASN1Encoder<EntityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_EntityIdentifier */
/**
 * @summary Encodes a(n) EntityIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EntityIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_EntityIdentifier (value: EntityIdentifier, elGetter: $.ASN1Encoder<EntityIdentifier>) {
    if (!_cached_encoder_for_EntityIdentifier) { _cached_encoder_for_EntityIdentifier = $._encode_choice<EntityIdentifier>({
    "issuerAndSerialNumber": _encode_IssuerAndSerialNumber,
    "subjectKeyIdentifier": _encode_SubjectKeyIdentifier,
}, $.BER); }
    return _cached_encoder_for_EntityIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EntityIdentifier */

/* eslint-enable */
