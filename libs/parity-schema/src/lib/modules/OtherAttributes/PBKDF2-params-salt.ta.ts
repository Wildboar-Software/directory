/* eslint-disable */
import {
    type AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION PBKDF2_params_salt */
/**
 * @summary PBKDF2_params_salt
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PBKDF2-params-salt ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export type PBKDF2_params_salt =
    | { specified: OCTET_STRING } /* CHOICE_ALT_ROOT */
    | { otherSource: AlgorithmIdentifier } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION PBKDF2_params_salt */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PBKDF2_params_salt */
let _cached_decoder_for_PBKDF2_params_salt: $.ASN1Decoder<PBKDF2_params_salt> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PBKDF2_params_salt */

/* START_OF_SYMBOL_DEFINITION _decode_PBKDF2_params_salt */
/**
 * @summary Decodes an ASN.1 element into a(n) PBKDF2_params_salt
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PBKDF2_params_salt} The decoded data structure.
 */
export function _decode_PBKDF2_params_salt(el: _Element) {
    if (!_cached_decoder_for_PBKDF2_params_salt) {
        _cached_decoder_for_PBKDF2_params_salt =
            $._decode_extensible_choice<PBKDF2_params_salt>({
                'UNIVERSAL 4': ['specified', $._decodeOctetString],
                'UNIVERSAL 16': ['otherSource', _decode_AlgorithmIdentifier],
            });
    }
    return _cached_decoder_for_PBKDF2_params_salt(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PBKDF2_params_salt */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PBKDF2_params_salt */
let _cached_encoder_for_PBKDF2_params_salt: $.ASN1Encoder<PBKDF2_params_salt> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PBKDF2_params_salt */

/* START_OF_SYMBOL_DEFINITION _encode_PBKDF2_params_salt */
/**
 * @summary Encodes a(n) PBKDF2_params_salt into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PBKDF2_params_salt, encoded as an ASN.1 Element.
 */
export function _encode_PBKDF2_params_salt(
    value: PBKDF2_params_salt,
    elGetter: $.ASN1Encoder<PBKDF2_params_salt>
) {
    if (!_cached_encoder_for_PBKDF2_params_salt) {
        _cached_encoder_for_PBKDF2_params_salt =
            $._encode_choice<PBKDF2_params_salt>(
                {
                    specified: $._encodeOctetString,
                    otherSource: _encode_AlgorithmIdentifier,
                },
                $.BER
            );
    }
    return _cached_encoder_for_PBKDF2_params_salt(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PBKDF2_params_salt */

/* eslint-enable */
