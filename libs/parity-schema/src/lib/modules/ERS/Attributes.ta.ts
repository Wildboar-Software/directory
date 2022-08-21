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
import { Attribute, _decode_Attribute, _encode_Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
export { Attribute, _decode_Attribute, _encode_Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";


/* START_OF_SYMBOL_DEFINITION Attributes */
/**
 * @summary Attributes
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Attributes  ::=  SET SIZE (1..MAX) OF Attribute
 * ```
 */
export
type Attributes = Attribute[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION Attributes */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Attributes */
let _cached_decoder_for_Attributes: $.ASN1Decoder<Attributes> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Attributes */

/* START_OF_SYMBOL_DEFINITION _decode_Attributes */
/**
 * @summary Decodes an ASN.1 element into a(n) Attributes
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Attributes} The decoded data structure.
 */
export
function _decode_Attributes (el: _Element) {
    if (!_cached_decoder_for_Attributes) { _cached_decoder_for_Attributes = $._decodeSetOf<Attribute>(() => _decode_Attribute); }
    return _cached_decoder_for_Attributes(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Attributes */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Attributes */
let _cached_encoder_for_Attributes: $.ASN1Encoder<Attributes> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Attributes */

/* START_OF_SYMBOL_DEFINITION _encode_Attributes */
/**
 * @summary Encodes a(n) Attributes into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Attributes, encoded as an ASN.1 Element.
 */
export
function _encode_Attributes (value: Attributes, elGetter: $.ASN1Encoder<Attributes>) {
    if (!_cached_encoder_for_Attributes) { _cached_encoder_for_Attributes = $._encodeSetOf<Attribute>(() => _encode_Attribute, $.BER); }
    return _cached_encoder_for_Attributes(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Attributes */

/* eslint-enable */
