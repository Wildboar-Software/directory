/* eslint-disable */
import {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
export { ub_interface_id } from '../TraderDefinitions/ub-interface-id.va';

/* START_OF_SYMBOL_DEFINITION InterfaceId */
/**
 * @summary InterfaceId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * InterfaceId  ::=  DirectoryString{ub-interface-id}
 * ```
 */
export type InterfaceId = DirectoryString; // DefinedType
/* END_OF_SYMBOL_DEFINITION InterfaceId */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceId */
let _cached_decoder_for_InterfaceId: $.ASN1Decoder<InterfaceId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceId */

/* START_OF_SYMBOL_DEFINITION _decode_InterfaceId */
/**
 * @summary Decodes an ASN.1 element into a(n) InterfaceId
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {InterfaceId} The decoded data structure.
 */
export function _decode_InterfaceId(el: _Element) {
    if (!_cached_decoder_for_InterfaceId) {
        _cached_decoder_for_InterfaceId = _decode_DirectoryString;
    }
    return _cached_decoder_for_InterfaceId(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_InterfaceId */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceId */
let _cached_encoder_for_InterfaceId: $.ASN1Encoder<InterfaceId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceId */

/* START_OF_SYMBOL_DEFINITION _encode_InterfaceId */
/**
 * @summary Encodes a(n) InterfaceId into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The InterfaceId, encoded as an ASN.1 Element.
 */
export function _encode_InterfaceId(
    value: InterfaceId,
    elGetter: $.ASN1Encoder<InterfaceId>
) {
    if (!_cached_encoder_for_InterfaceId) {
        _cached_encoder_for_InterfaceId = _encode_DirectoryString;
    }
    return _cached_encoder_for_InterfaceId(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_InterfaceId */

/* eslint-enable */
