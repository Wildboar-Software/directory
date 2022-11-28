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
import { ComponentAssertion, _decode_ComponentAssertion, _encode_ComponentAssertion } from "../RFC3687ComponentMatching/ComponentAssertion.ta";
export { ComponentAssertion, _decode_ComponentAssertion, _encode_ComponentAssertion } from "../RFC3687ComponentMatching/ComponentAssertion.ta";


/* START_OF_SYMBOL_DEFINITION ComponentFilter */
/**
 * @summary ComponentFilter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ComponentFilter  ::=  CHOICE {
 *     item  [0] ComponentAssertion,
 *     and   [1] SEQUENCE OF ComponentFilter,
 *     or    [2] SEQUENCE OF ComponentFilter,
 *     not   [3] ComponentFilter,
 *     ...
 * }
 * ```
 */
export
type ComponentFilter =
    { item: ComponentAssertion } /* CHOICE_ALT_ROOT */
    | { and: ComponentFilter[] } /* CHOICE_ALT_ROOT */
    | { or: ComponentFilter[] } /* CHOICE_ALT_ROOT */
    | { not: ComponentFilter } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentFilter */
let _cached_decoder_for_ComponentFilter: $.ASN1Decoder<ComponentFilter> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _decode_ComponentFilter */
/**
 * @summary Decodes an ASN.1 element into a(n) ComponentFilter
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ComponentFilter} The decoded data structure.
 */
export
function _decode_ComponentFilter (el: _Element) {
    if (!_cached_decoder_for_ComponentFilter) { _cached_decoder_for_ComponentFilter = $._decode_extensible_choice<ComponentFilter>({
    "CONTEXT 0": [ "item", $._decode_implicit<ComponentAssertion>(() => _decode_ComponentAssertion) ],
    "CONTEXT 1": [ "and", $._decode_implicit<ComponentFilter[]>(() => $._decodeSequenceOf<ComponentFilter>(() => _decode_ComponentFilter)) ],
    "CONTEXT 2": [ "or", $._decode_implicit<ComponentFilter[]>(() => $._decodeSequenceOf<ComponentFilter>(() => _decode_ComponentFilter)) ],
    "CONTEXT 3": [ "not", $._decode_explicit<ComponentFilter>(() => _decode_ComponentFilter) ]
}); }
    return _cached_decoder_for_ComponentFilter(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentFilter */
let _cached_encoder_for_ComponentFilter: $.ASN1Encoder<ComponentFilter> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _encode_ComponentFilter */
/**
 * @summary Encodes a(n) ComponentFilter into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ComponentFilter, encoded as an ASN.1 Element.
 */
export
function _encode_ComponentFilter (value: ComponentFilter, elGetter: $.ASN1Encoder<ComponentFilter>) {
    if (!_cached_encoder_for_ComponentFilter) { _cached_encoder_for_ComponentFilter = $._encode_choice<ComponentFilter>({
    "item": $._encode_implicit(_TagClass.context, 0, () => _encode_ComponentAssertion, $.BER),
    "and": $._encode_implicit(_TagClass.context, 1, () => $._encodeSequenceOf<ComponentFilter>(() => _encode_ComponentFilter, $.BER), $.BER),
    "or": $._encode_implicit(_TagClass.context, 2, () => $._encodeSequenceOf<ComponentFilter>(() => _encode_ComponentFilter, $.BER), $.BER),
    "not": $._encode_explicit(_TagClass.context, 3, () => _encode_ComponentFilter, $.BER),
}, $.BER); }
    return _cached_encoder_for_ComponentFilter(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ComponentFilter */

/* eslint-enable */
