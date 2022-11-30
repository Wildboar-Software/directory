/* eslint-disable */
import { ASN1Element as _Element, INTEGER, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PreferredOrLegacyStalePackageIdentifier */
/**
 * @summary PreferredOrLegacyStalePackageIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PreferredOrLegacyStalePackageIdentifier  ::=  CHOICE {
 *     preferredStaleVerNum INTEGER (0..MAX),
 *     legacyStaleVersion OCTET STRING }
 * ```
 */
export type PreferredOrLegacyStalePackageIdentifier =
    | { preferredStaleVerNum: INTEGER } /* CHOICE_ALT_ROOT */
    | { legacyStaleVersion: OCTET_STRING } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION PreferredOrLegacyStalePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredOrLegacyStalePackageIdentifier */
let _cached_decoder_for_PreferredOrLegacyStalePackageIdentifier: $.ASN1Decoder<PreferredOrLegacyStalePackageIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredOrLegacyStalePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_PreferredOrLegacyStalePackageIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) PreferredOrLegacyStalePackageIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PreferredOrLegacyStalePackageIdentifier} The decoded data structure.
 */
export function _decode_PreferredOrLegacyStalePackageIdentifier(el: _Element) {
    if (!_cached_decoder_for_PreferredOrLegacyStalePackageIdentifier) {
        _cached_decoder_for_PreferredOrLegacyStalePackageIdentifier =
            $._decode_extensible_choice<PreferredOrLegacyStalePackageIdentifier>(
                {
                    'UNIVERSAL 2': ['preferredStaleVerNum', $._decodeInteger],
                    'UNIVERSAL 4': ['legacyStaleVersion', $._decodeOctetString],
                }
            );
    }
    return _cached_decoder_for_PreferredOrLegacyStalePackageIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PreferredOrLegacyStalePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredOrLegacyStalePackageIdentifier */
let _cached_encoder_for_PreferredOrLegacyStalePackageIdentifier: $.ASN1Encoder<PreferredOrLegacyStalePackageIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredOrLegacyStalePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_PreferredOrLegacyStalePackageIdentifier */
/**
 * @summary Encodes a(n) PreferredOrLegacyStalePackageIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PreferredOrLegacyStalePackageIdentifier, encoded as an ASN.1 Element.
 */
export function _encode_PreferredOrLegacyStalePackageIdentifier(
    value: PreferredOrLegacyStalePackageIdentifier,
    elGetter: $.ASN1Encoder<PreferredOrLegacyStalePackageIdentifier>
) {
    if (!_cached_encoder_for_PreferredOrLegacyStalePackageIdentifier) {
        _cached_encoder_for_PreferredOrLegacyStalePackageIdentifier =
            $._encode_choice<PreferredOrLegacyStalePackageIdentifier>(
                {
                    preferredStaleVerNum: $._encodeInteger,
                    legacyStaleVersion: $._encodeOctetString,
                },
                $.BER
            );
    }
    return _cached_encoder_for_PreferredOrLegacyStalePackageIdentifier(
        value,
        elGetter
    );
}

/* END_OF_SYMBOL_DEFINITION _encode_PreferredOrLegacyStalePackageIdentifier */

/* eslint-enable */
