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
import { Extension, _decode_Extension, _encode_Extension } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Extension.ta";
export { Extension, _decode_Extension, _encode_Extension } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Extension.ta";


/* START_OF_SYMBOL_DEFINITION ExtensionReq */
/**
 * @summary ExtensionReq
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ExtensionReq  ::=  SEQUENCE SIZE (1..MAX) OF Extension
 * ```
 */
export
type ExtensionReq = Extension[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ExtensionReq */
let _cached_decoder_for_ExtensionReq: $.ASN1Decoder<ExtensionReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _decode_ExtensionReq */
/**
 * @summary Decodes an ASN.1 element into a(n) ExtensionReq
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ExtensionReq} The decoded data structure.
 */
export
function _decode_ExtensionReq (el: _Element) {
    if (!_cached_decoder_for_ExtensionReq) { _cached_decoder_for_ExtensionReq = $._decodeSequenceOf<Extension>(() => _decode_Extension); }
    return _cached_decoder_for_ExtensionReq(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ExtensionReq */
let _cached_encoder_for_ExtensionReq: $.ASN1Encoder<ExtensionReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _encode_ExtensionReq */
/**
 * @summary Encodes a(n) ExtensionReq into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ExtensionReq, encoded as an ASN.1 Element.
 */
export
function _encode_ExtensionReq (value: ExtensionReq, elGetter: $.ASN1Encoder<ExtensionReq>) {
    if (!_cached_encoder_for_ExtensionReq) { _cached_encoder_for_ExtensionReq = $._encodeSequenceOf<Extension>(() => _encode_Extension, $.BER); }
    return _cached_encoder_for_ExtensionReq(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ExtensionReq */

/* eslint-enable */
