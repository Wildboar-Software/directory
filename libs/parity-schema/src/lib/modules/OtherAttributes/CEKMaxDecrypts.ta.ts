/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION CEKMaxDecrypts */
/**
 * @summary CEKMaxDecrypts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CEKMaxDecrypts  ::=  INTEGER
 * ```
 */
export type CEKMaxDecrypts = INTEGER;
/* END_OF_SYMBOL_DEFINITION CEKMaxDecrypts */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CEKMaxDecrypts */
let _cached_decoder_for_CEKMaxDecrypts: $.ASN1Decoder<CEKMaxDecrypts> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CEKMaxDecrypts */

/* START_OF_SYMBOL_DEFINITION _decode_CEKMaxDecrypts */
/**
 * @summary Decodes an ASN.1 element into a(n) CEKMaxDecrypts
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CEKMaxDecrypts} The decoded data structure.
 */
export function _decode_CEKMaxDecrypts(el: _Element) {
    if (!_cached_decoder_for_CEKMaxDecrypts) {
        _cached_decoder_for_CEKMaxDecrypts = $._decodeInteger;
    }
    return _cached_decoder_for_CEKMaxDecrypts(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CEKMaxDecrypts */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CEKMaxDecrypts */
let _cached_encoder_for_CEKMaxDecrypts: $.ASN1Encoder<CEKMaxDecrypts> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CEKMaxDecrypts */

/* START_OF_SYMBOL_DEFINITION _encode_CEKMaxDecrypts */
/**
 * @summary Encodes a(n) CEKMaxDecrypts into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CEKMaxDecrypts, encoded as an ASN.1 Element.
 */
export function _encode_CEKMaxDecrypts(
    value: CEKMaxDecrypts,
    elGetter: $.ASN1Encoder<CEKMaxDecrypts>
) {
    if (!_cached_encoder_for_CEKMaxDecrypts) {
        _cached_encoder_for_CEKMaxDecrypts = $._encodeInteger;
    }
    return _cached_encoder_for_CEKMaxDecrypts(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CEKMaxDecrypts */

/* eslint-enable */
