/* eslint-disable */
import { ASN1Element as _Element, UTF8String } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PrincipalNamingAttrSyntax */
/**
 * @summary PrincipalNamingAttrSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PrincipalNamingAttrSyntax  ::=  UTF8String ("cn", "sn", "uid", "givenname", "fullname"
 * ```
 */
export type PrincipalNamingAttrSyntax = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION PrincipalNamingAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PrincipalNamingAttrSyntax */
let _cached_decoder_for_PrincipalNamingAttrSyntax: $.ASN1Decoder<PrincipalNamingAttrSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PrincipalNamingAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_PrincipalNamingAttrSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) PrincipalNamingAttrSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PrincipalNamingAttrSyntax} The decoded data structure.
 */
export function _decode_PrincipalNamingAttrSyntax(el: _Element) {
    if (!_cached_decoder_for_PrincipalNamingAttrSyntax) {
        _cached_decoder_for_PrincipalNamingAttrSyntax = $._decodeUTF8String;
    }
    return _cached_decoder_for_PrincipalNamingAttrSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PrincipalNamingAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PrincipalNamingAttrSyntax */
let _cached_encoder_for_PrincipalNamingAttrSyntax: $.ASN1Encoder<PrincipalNamingAttrSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PrincipalNamingAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_PrincipalNamingAttrSyntax */
/**
 * @summary Encodes a(n) PrincipalNamingAttrSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PrincipalNamingAttrSyntax, encoded as an ASN.1 Element.
 */
export function _encode_PrincipalNamingAttrSyntax(
    value: PrincipalNamingAttrSyntax,
    elGetter: $.ASN1Encoder<PrincipalNamingAttrSyntax>
) {
    if (!_cached_encoder_for_PrincipalNamingAttrSyntax) {
        _cached_encoder_for_PrincipalNamingAttrSyntax = $._encodeUTF8String;
    }
    return _cached_encoder_for_PrincipalNamingAttrSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PrincipalNamingAttrSyntax */

/* eslint-enable */
