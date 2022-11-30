/* eslint-disable */
import {
    Attribute,
    _decode_Attribute,
    _encode_Attribute,
} from '@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta';
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export {
    Attribute,
    _decode_Attribute,
    _encode_Attribute,
} from '@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta';

/* START_OF_SYMBOL_DEFINITION AttributesSyntax */
/**
 * @summary AttributesSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributesSyntax  ::=  SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
 * ```
 */
export type AttributesSyntax = Attribute[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AttributesSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributesSyntax */
let _cached_decoder_for_AttributesSyntax: $.ASN1Decoder<AttributesSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributesSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_AttributesSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributesSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributesSyntax} The decoded data structure.
 */
export function _decode_AttributesSyntax(el: _Element) {
    if (!_cached_decoder_for_AttributesSyntax) {
        _cached_decoder_for_AttributesSyntax = $._decodeSequenceOf<Attribute>(
            () => _decode_Attribute
        );
    }
    return _cached_decoder_for_AttributesSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributesSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributesSyntax */
let _cached_encoder_for_AttributesSyntax: $.ASN1Encoder<AttributesSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributesSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_AttributesSyntax */
/**
 * @summary Encodes a(n) AttributesSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributesSyntax, encoded as an ASN.1 Element.
 */
export function _encode_AttributesSyntax(
    value: AttributesSyntax,
    elGetter: $.ASN1Encoder<AttributesSyntax>
) {
    if (!_cached_encoder_for_AttributesSyntax) {
        _cached_encoder_for_AttributesSyntax = $._encodeSequenceOf<Attribute>(
            () => _encode_Attribute,
            $.BER
        );
    }
    return _cached_encoder_for_AttributesSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributesSyntax */

/* eslint-enable */
