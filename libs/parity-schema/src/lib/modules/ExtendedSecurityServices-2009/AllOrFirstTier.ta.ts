/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION AllOrFirstTier */
/**
 * @summary AllOrFirstTier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AllOrFirstTier  ::=  INTEGER { -- Formerly AllOrNone
 *     allReceipts (0),
 *     firstTierRecipients (1) }
 * ```
 */
export type AllOrFirstTier = INTEGER;
/* END_OF_SYMBOL_DEFINITION AllOrFirstTier */

/* START_OF_SYMBOL_DEFINITION AllOrFirstTier_allReceipts */
/**
 * @summary AllOrFirstTier_allReceipts
 * @constant
 * @type {number}
 */
export const AllOrFirstTier_allReceipts: AllOrFirstTier = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION AllOrFirstTier_allReceipts */

/* START_OF_SYMBOL_DEFINITION allReceipts */
/**
 * @summary AllOrFirstTier_allReceipts
 * @constant
 * @type {number}
 */
export const allReceipts: AllOrFirstTier =
    AllOrFirstTier_allReceipts; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION allReceipts */

/* START_OF_SYMBOL_DEFINITION AllOrFirstTier_firstTierRecipients */
/**
 * @summary AllOrFirstTier_firstTierRecipients
 * @constant
 * @type {number}
 */
export const AllOrFirstTier_firstTierRecipients: AllOrFirstTier = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION AllOrFirstTier_firstTierRecipients */

/* START_OF_SYMBOL_DEFINITION firstTierRecipients */
/**
 * @summary AllOrFirstTier_firstTierRecipients
 * @constant
 * @type {number}
 */
export const firstTierRecipients: AllOrFirstTier =
    AllOrFirstTier_firstTierRecipients; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION firstTierRecipients */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AllOrFirstTier */
let _cached_decoder_for_AllOrFirstTier: $.ASN1Decoder<AllOrFirstTier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AllOrFirstTier */

/* START_OF_SYMBOL_DEFINITION _decode_AllOrFirstTier */
/**
 * @summary Decodes an ASN.1 element into a(n) AllOrFirstTier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AllOrFirstTier} The decoded data structure.
 */
export function _decode_AllOrFirstTier(el: _Element) {
    if (!_cached_decoder_for_AllOrFirstTier) {
        _cached_decoder_for_AllOrFirstTier = $._decodeInteger;
    }
    return _cached_decoder_for_AllOrFirstTier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AllOrFirstTier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AllOrFirstTier */
let _cached_encoder_for_AllOrFirstTier: $.ASN1Encoder<AllOrFirstTier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AllOrFirstTier */

/* START_OF_SYMBOL_DEFINITION _encode_AllOrFirstTier */
/**
 * @summary Encodes a(n) AllOrFirstTier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AllOrFirstTier, encoded as an ASN.1 Element.
 */
export function _encode_AllOrFirstTier(
    value: AllOrFirstTier,
    elGetter: $.ASN1Encoder<AllOrFirstTier>
) {
    if (!_cached_encoder_for_AllOrFirstTier) {
        _cached_encoder_for_AllOrFirstTier = $._encodeInteger;
    }
    return _cached_encoder_for_AllOrFirstTier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AllOrFirstTier */

/* eslint-enable */
