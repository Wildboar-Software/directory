/* eslint-disable */
import {
    AttributeTypeAndValue,
    _decode_AttributeTypeAndValue,
    _encode_AttributeTypeAndValue,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta';
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export {
    AttributeTypeAndValue,
    _decode_AttributeTypeAndValue,
    _encode_AttributeTypeAndValue,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta';

/* START_OF_SYMBOL_DEFINITION Controls */
/**
 * @summary Controls
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Controls   ::=  SEQUENCE SIZE(1..MAX) OF AttributeTypeAndValue
 *                 {{RegControlSet}}
 * ```
 */
export type Controls = AttributeTypeAndValue[]; // SequenceOfType
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
export function _decode_Controls(el: _Element) {
    if (!_cached_decoder_for_Controls) {
        _cached_decoder_for_Controls =
            $._decodeSequenceOf<AttributeTypeAndValue>(
                () => _decode_AttributeTypeAndValue
            );
    }
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
export function _encode_Controls(
    value: Controls,
    elGetter: $.ASN1Encoder<Controls>
) {
    if (!_cached_encoder_for_Controls) {
        _cached_encoder_for_Controls =
            $._encodeSequenceOf<AttributeTypeAndValue>(
                () => _encode_AttributeTypeAndValue,
                $.BER
            );
    }
    return _cached_encoder_for_Controls(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Controls */

/* eslint-enable */
