/* eslint-disable */
import {
    GeneralName,
    _decode_GeneralName,
    _encode_GeneralName,
} from '@wildboar/x500/CertificateExtensions';
import { ASN1Element as _Element, UTF8String } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    GeneralName,
    _decode_GeneralName,
    _encode_GeneralName,
} from '@wildboar/x500/CertificateExtensions';

/* START_OF_SYMBOL_DEFINITION EncKeyWithID_identifier */
/**
 * @summary EncKeyWithID_identifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * EncKeyWithID-identifier ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export type EncKeyWithID_identifier =
    | { string_: UTF8String } /* CHOICE_ALT_ROOT */
    | { generalName: GeneralName } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION EncKeyWithID_identifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EncKeyWithID_identifier */
let _cached_decoder_for_EncKeyWithID_identifier: $.ASN1Decoder<EncKeyWithID_identifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EncKeyWithID_identifier */

/* START_OF_SYMBOL_DEFINITION _decode_EncKeyWithID_identifier */
/**
 * @summary Decodes an ASN.1 element into a(n) EncKeyWithID_identifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EncKeyWithID_identifier} The decoded data structure.
 */
export function _decode_EncKeyWithID_identifier(el: _Element) {
    if (!_cached_decoder_for_EncKeyWithID_identifier) {
        _cached_decoder_for_EncKeyWithID_identifier =
            $._decode_inextensible_choice<EncKeyWithID_identifier>({
                'UNIVERSAL 12': ['string_', $._decodeUTF8String],
                'CONTEXT 0': ['generalName', _decode_GeneralName],
                'CONTEXT 1': ['generalName', _decode_GeneralName],
                'CONTEXT 2': ['generalName', _decode_GeneralName],
                'CONTEXT 3': ['generalName', _decode_GeneralName],
                'CONTEXT 4': ['generalName', _decode_GeneralName],
                'CONTEXT 5': ['generalName', _decode_GeneralName],
                'CONTEXT 6': ['generalName', _decode_GeneralName],
                'CONTEXT 7': ['generalName', _decode_GeneralName],
                'CONTEXT 8': ['generalName', _decode_GeneralName],
            });
    }
    return _cached_decoder_for_EncKeyWithID_identifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EncKeyWithID_identifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EncKeyWithID_identifier */
let _cached_encoder_for_EncKeyWithID_identifier: $.ASN1Encoder<EncKeyWithID_identifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EncKeyWithID_identifier */

/* START_OF_SYMBOL_DEFINITION _encode_EncKeyWithID_identifier */
/**
 * @summary Encodes a(n) EncKeyWithID_identifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EncKeyWithID_identifier, encoded as an ASN.1 Element.
 */
export function _encode_EncKeyWithID_identifier(
    value: EncKeyWithID_identifier,
    elGetter: $.ASN1Encoder<EncKeyWithID_identifier>
) {
    if (!_cached_encoder_for_EncKeyWithID_identifier) {
        _cached_encoder_for_EncKeyWithID_identifier =
            $._encode_choice<EncKeyWithID_identifier>(
                {
                    string_: $._encodeUTF8String,
                    generalName: _encode_GeneralName,
                },
                $.BER
            );
    }
    return _cached_encoder_for_EncKeyWithID_identifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EncKeyWithID_identifier */

/* eslint-enable */
