/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION _enum_for_FollowOption */
/**
 * @summary FollowOption
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FollowOption  ::=  ENUMERATED {localOnly(0), ifNoLocal(1), always(2)}
 * ```@enum {number}
 */
export enum _enum_for_FollowOption {
    localOnly = 0,
    ifNoLocal = 1,
    always = 2,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_FollowOption */

/* START_OF_SYMBOL_DEFINITION FollowOption */
/**
 * @summary FollowOption
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FollowOption  ::=  ENUMERATED {localOnly(0), ifNoLocal(1), always(2)}
 * ```@enum {number}
 */
export type FollowOption = _enum_for_FollowOption;
/* END_OF_SYMBOL_DEFINITION FollowOption */

/* START_OF_SYMBOL_DEFINITION FollowOption */
/**
 * @summary FollowOption
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FollowOption  ::=  ENUMERATED {localOnly(0), ifNoLocal(1), always(2)}
 * ```@enum {number}
 */
export const FollowOption = _enum_for_FollowOption;
/* END_OF_SYMBOL_DEFINITION FollowOption */

/* START_OF_SYMBOL_DEFINITION FollowOption_localOnly */
/**
 * @summary FollowOption_localOnly
 * @constant
 * @type {number}
 */
export const FollowOption_localOnly: FollowOption =
    FollowOption.localOnly; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FollowOption_localOnly */

/* START_OF_SYMBOL_DEFINITION localOnly */
/**
 * @summary localOnly
 * @constant
 * @type {number}
 */
export const localOnly: FollowOption =
    FollowOption.localOnly; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION localOnly */

/* START_OF_SYMBOL_DEFINITION FollowOption_ifNoLocal */
/**
 * @summary FollowOption_ifNoLocal
 * @constant
 * @type {number}
 */
export const FollowOption_ifNoLocal: FollowOption =
    FollowOption.ifNoLocal; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FollowOption_ifNoLocal */

/* START_OF_SYMBOL_DEFINITION ifNoLocal */
/**
 * @summary ifNoLocal
 * @constant
 * @type {number}
 */
export const ifNoLocal: FollowOption =
    FollowOption.ifNoLocal; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION ifNoLocal */

/* START_OF_SYMBOL_DEFINITION FollowOption_always */
/**
 * @summary FollowOption_always
 * @constant
 * @type {number}
 */
export const FollowOption_always: FollowOption =
    FollowOption.always; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION FollowOption_always */

/* START_OF_SYMBOL_DEFINITION always */
/**
 * @summary always
 * @constant
 * @type {number}
 */
export const always: FollowOption =
    FollowOption.always; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION always */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FollowOption */
let _cached_decoder_for_FollowOption: $.ASN1Decoder<FollowOption> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FollowOption */

/* START_OF_SYMBOL_DEFINITION _decode_FollowOption */
/**
 * @summary Decodes an ASN.1 element into a(n) FollowOption
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FollowOption} The decoded data structure.
 */
export function _decode_FollowOption(el: _Element) {
    if (!_cached_decoder_for_FollowOption) {
        _cached_decoder_for_FollowOption = $._decodeEnumerated;
    }
    return _cached_decoder_for_FollowOption(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FollowOption */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FollowOption */
let _cached_encoder_for_FollowOption: $.ASN1Encoder<FollowOption> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FollowOption */

/* START_OF_SYMBOL_DEFINITION _encode_FollowOption */
/**
 * @summary Encodes a(n) FollowOption into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FollowOption, encoded as an ASN.1 Element.
 */
export function _encode_FollowOption(
    value: FollowOption,
    elGetter: $.ASN1Encoder<FollowOption>
) {
    if (!_cached_encoder_for_FollowOption) {
        _cached_encoder_for_FollowOption = $._encodeEnumerated;
    }
    return _cached_encoder_for_FollowOption(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FollowOption */

/* eslint-enable */
