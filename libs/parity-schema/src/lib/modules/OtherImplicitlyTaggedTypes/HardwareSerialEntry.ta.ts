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
import { HardwareSerialEntry_block, _decode_HardwareSerialEntry_block, _encode_HardwareSerialEntry_block } from "../OtherImplicitlyTaggedTypes/HardwareSerialEntry-block.ta";
export { HardwareSerialEntry_block, _decode_HardwareSerialEntry_block, _encode_HardwareSerialEntry_block } from "../OtherImplicitlyTaggedTypes/HardwareSerialEntry-block.ta";


/* START_OF_SYMBOL_DEFINITION HardwareSerialEntry */
/**
 * @summary HardwareSerialEntry
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * HardwareSerialEntry  ::=  CHOICE {
 *     all                 NULL,
 *     single              OCTET STRING,
 *     block SEQUENCE {
 *         low             OCTET STRING,
 *         high            OCTET STRING
 *     }
 * }
 * ```
 */
export
type HardwareSerialEntry =
    { all: NULL } /* CHOICE_ALT_ROOT */
    | { single: OCTET_STRING } /* CHOICE_ALT_ROOT */
    | { block: HardwareSerialEntry_block } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION HardwareSerialEntry */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareSerialEntry */
let _cached_decoder_for_HardwareSerialEntry: $.ASN1Decoder<HardwareSerialEntry> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareSerialEntry */

/* START_OF_SYMBOL_DEFINITION _decode_HardwareSerialEntry */
/**
 * @summary Decodes an ASN.1 element into a(n) HardwareSerialEntry
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HardwareSerialEntry} The decoded data structure.
 */
export
function _decode_HardwareSerialEntry (el: _Element) {
    if (!_cached_decoder_for_HardwareSerialEntry) { _cached_decoder_for_HardwareSerialEntry = $._decode_extensible_choice<HardwareSerialEntry>({
    "UNIVERSAL 5": [ "all", $._decodeNull ],
    "UNIVERSAL 4": [ "single", $._decodeOctetString ],
    "UNIVERSAL 16": [ "block", _decode_HardwareSerialEntry_block ]
}); }
    return _cached_decoder_for_HardwareSerialEntry(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HardwareSerialEntry */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareSerialEntry */
let _cached_encoder_for_HardwareSerialEntry: $.ASN1Encoder<HardwareSerialEntry> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareSerialEntry */

/* START_OF_SYMBOL_DEFINITION _encode_HardwareSerialEntry */
/**
 * @summary Encodes a(n) HardwareSerialEntry into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HardwareSerialEntry, encoded as an ASN.1 Element.
 */
export
function _encode_HardwareSerialEntry (value: HardwareSerialEntry, elGetter: $.ASN1Encoder<HardwareSerialEntry>) {
    if (!_cached_encoder_for_HardwareSerialEntry) { _cached_encoder_for_HardwareSerialEntry = $._encode_choice<HardwareSerialEntry>({
    "all": $._encodeNull,
    "single": $._encodeOctetString,
    "block": _encode_HardwareSerialEntry_block,
}, $.BER); }
    return _cached_encoder_for_HardwareSerialEntry(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HardwareSerialEntry */

/* eslint-enable */
