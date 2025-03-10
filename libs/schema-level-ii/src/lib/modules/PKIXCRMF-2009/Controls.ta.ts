/* eslint-disable */
import {
    AttributeTypeAndValue as SingleAttribute,
    _decode_AttributeTypeAndValue as _decode_SingleAttribute,
    _encode_AttributeTypeAndValue as _encode_SingleAttribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION Controls */
/**
 * @summary Controls
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Controls   ::=  SEQUENCE SIZE(1..MAX) OF SingleAttribute
 *                 {{RegControlSet}}
 * ```
 */
export
type Controls = SingleAttribute[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Controls */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Controls */
let _cached_decoder_for_Controls: $.ASN1Decoder<Controls> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Controls */

/* START_OF_SYMBOL_DEFINITION _decode_Controls */
/**
 * @summary Decodes an ASN.1 element into a(n) Controls
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Controls} The decoded data structure.
 */
export
function _decode_Controls (el: _Element) {
    if (!_cached_decoder_for_Controls) { _cached_decoder_for_Controls = $._decodeSequenceOf<SingleAttribute>(() => _decode_SingleAttribute); }
    return _cached_decoder_for_Controls(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Controls */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Controls */
let _cached_encoder_for_Controls: $.ASN1Encoder<Controls> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Controls */

/* START_OF_SYMBOL_DEFINITION _encode_Controls */
/**
 * @summary Encodes a(n) Controls into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Controls, encoded as an ASN.1 Element.
 */
export
function _encode_Controls (value: Controls, elGetter: $.ASN1Encoder<Controls>) {
    if (!_cached_encoder_for_Controls) { _cached_encoder_for_Controls = $._encodeSequenceOf<SingleAttribute>(() => _encode_SingleAttribute, $.BER); }
    return _cached_encoder_for_Controls(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Controls */

/* eslint-enable */
