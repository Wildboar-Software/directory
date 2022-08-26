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
import { SecurityCategory, _decode_SecurityCategory, _encode_SecurityCategory } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SecurityCategory.ta";
export { SecurityCategory, _decode_SecurityCategory, _encode_SecurityCategory } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SecurityCategory.ta";


/* START_OF_SYMBOL_DEFINITION SecurityCategories */
/**
 * @summary SecurityCategories
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SecurityCategories  ::= 
 *     SET SIZE (1..ub-security-categories) OF SecurityCategory
 *         {{SupportedSecurityCategories}}
 * ```
 */
export
type SecurityCategories = SecurityCategory[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityCategories */
let _cached_decoder_for_SecurityCategories: $.ASN1Decoder<SecurityCategories> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityCategories */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityCategories
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityCategories} The decoded data structure.
 */
export
function _decode_SecurityCategories (el: _Element) {
    if (!_cached_decoder_for_SecurityCategories) { _cached_decoder_for_SecurityCategories = $._decodeSetOf<SecurityCategory>(() => _decode_SecurityCategory); }
    return _cached_decoder_for_SecurityCategories(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityCategories */
let _cached_encoder_for_SecurityCategories: $.ASN1Encoder<SecurityCategories> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityCategories */
/**
 * @summary Encodes a(n) SecurityCategories into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityCategories, encoded as an ASN.1 Element.
 */
export
function _encode_SecurityCategories (value: SecurityCategories, elGetter: $.ASN1Encoder<SecurityCategories>) {
    if (!_cached_encoder_for_SecurityCategories) { _cached_encoder_for_SecurityCategories = $._encodeSetOf<SecurityCategory>(() => _encode_SecurityCategory, $.BER); }
    return _cached_encoder_for_SecurityCategories(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityCategories */

/* eslint-enable */
