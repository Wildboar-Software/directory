/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { Uint32, _decode_Uint32, _encode_Uint32 } from '../NIS/Uint32.ta';

/* START_OF_SYMBOL_DEFINITION UnixEpoch */
/**
 * @summary UnixEpoch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * UnixEpoch  ::=  Uint32
 * ```
 */
export type UnixEpoch = Uint32; // DefinedType
/* END_OF_SYMBOL_DEFINITION UnixEpoch */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_UnixEpoch */
let _cached_decoder_for_UnixEpoch: $.ASN1Decoder<UnixEpoch> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_UnixEpoch */

/* START_OF_SYMBOL_DEFINITION _decode_UnixEpoch */
/**
 * @summary Decodes an ASN.1 element into a(n) UnixEpoch
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {UnixEpoch} The decoded data structure.
 */
export function _decode_UnixEpoch(el: _Element) {
    if (!_cached_decoder_for_UnixEpoch) {
        _cached_decoder_for_UnixEpoch = _decode_Uint32;
    }
    return _cached_decoder_for_UnixEpoch(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_UnixEpoch */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_UnixEpoch */
let _cached_encoder_for_UnixEpoch: $.ASN1Encoder<UnixEpoch> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_UnixEpoch */

/* START_OF_SYMBOL_DEFINITION _encode_UnixEpoch */
/**
 * @summary Encodes a(n) UnixEpoch into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The UnixEpoch, encoded as an ASN.1 Element.
 */
export function _encode_UnixEpoch(
    value: UnixEpoch,
    elGetter: $.ASN1Encoder<UnixEpoch>
) {
    if (!_cached_encoder_for_UnixEpoch) {
        _cached_encoder_for_UnixEpoch = _encode_Uint32;
    }
    return _cached_encoder_for_UnixEpoch(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_UnixEpoch */

/* eslint-enable */
