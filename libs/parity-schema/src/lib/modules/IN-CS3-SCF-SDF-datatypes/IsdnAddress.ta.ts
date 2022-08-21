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
import { Digits, _decode_Digits, _encode_Digits } from "../IN-CS3-SCF-SDF-datatypes/Digits.ta";
export { Digits, _decode_Digits, _encode_Digits } from "../IN-CS3-SCF-SDF-datatypes/Digits.ta";


/* START_OF_SYMBOL_DEFINITION IsdnAddress */
/**
 * @summary IsdnAddress
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * IsdnAddress  ::=  Digits (SIZE (1..10))
 * ```
 */
export
type IsdnAddress = Digits; // DefinedType
/* END_OF_SYMBOL_DEFINITION IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_IsdnAddress */
let _cached_decoder_for_IsdnAddress: $.ASN1Decoder<IsdnAddress> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _decode_IsdnAddress */
/**
 * @summary Decodes an ASN.1 element into a(n) IsdnAddress
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {IsdnAddress} The decoded data structure.
 */
export
function _decode_IsdnAddress (el: _Element) {
    if (!_cached_decoder_for_IsdnAddress) { _cached_decoder_for_IsdnAddress = _decode_Digits; }
    return _cached_decoder_for_IsdnAddress(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_IsdnAddress */
let _cached_encoder_for_IsdnAddress: $.ASN1Encoder<IsdnAddress> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _encode_IsdnAddress */
/**
 * @summary Encodes a(n) IsdnAddress into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The IsdnAddress, encoded as an ASN.1 Element.
 */
export
function _encode_IsdnAddress (value: IsdnAddress, elGetter: $.ASN1Encoder<IsdnAddress>) {
    if (!_cached_encoder_for_IsdnAddress) { _cached_encoder_for_IsdnAddress = _encode_Digits; }
    return _cached_encoder_for_IsdnAddress(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_IsdnAddress */

/* eslint-enable */
