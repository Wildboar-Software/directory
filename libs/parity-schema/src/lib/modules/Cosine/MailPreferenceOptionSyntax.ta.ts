/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION _enum_for_MailPreferenceOptionSyntax */
/**
 * @summary MailPreferenceOptionSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MailPreferenceOptionSyntax  ::=  ENUMERATED {
 *     no-list-inclusion(0),
 *
 *     -- may be added to any lists
 *     any-list-inclusion(1),
 *
 *     -- may be added to lists
 *     -- which the list provider
 *     -- views as related to the
 *     -- users professional inter-
 *     -- ests, perhaps evaluated
 *     -- from the business of the
 *     -- organisation or keywords
 *     -- in the entry.
 *     professional-list-inclusion(2)
 * }
 * ```@enum {number}
 */
export enum _enum_for_MailPreferenceOptionSyntax {
    no_list_inclusion = 0,
    any_list_inclusion = 1,
    professional_list_inclusion = 2,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax */
/**
 * @summary MailPreferenceOptionSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MailPreferenceOptionSyntax  ::=  ENUMERATED {
 *     no-list-inclusion(0),
 *
 *     -- may be added to any lists
 *     any-list-inclusion(1),
 *
 *     -- may be added to lists
 *     -- which the list provider
 *     -- views as related to the
 *     -- users professional inter-
 *     -- ests, perhaps evaluated
 *     -- from the business of the
 *     -- organisation or keywords
 *     -- in the entry.
 *     professional-list-inclusion(2)
 * }
 * ```@enum {number}
 */
export type MailPreferenceOptionSyntax = _enum_for_MailPreferenceOptionSyntax;
/* END_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax */
/**
 * @summary MailPreferenceOptionSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MailPreferenceOptionSyntax  ::=  ENUMERATED {
 *     no-list-inclusion(0),
 *
 *     -- may be added to any lists
 *     any-list-inclusion(1),
 *
 *     -- may be added to lists
 *     -- which the list provider
 *     -- views as related to the
 *     -- users professional inter-
 *     -- ests, perhaps evaluated
 *     -- from the business of the
 *     -- organisation or keywords
 *     -- in the entry.
 *     professional-list-inclusion(2)
 * }
 * ```@enum {number}
 */
export const MailPreferenceOptionSyntax = _enum_for_MailPreferenceOptionSyntax;
/* END_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_no_list_inclusion */
/**
 * @summary MailPreferenceOptionSyntax_no_list_inclusion
 * @constant
 * @type {number}
 */
export const MailPreferenceOptionSyntax_no_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.no_list_inclusion; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_no_list_inclusion */

/* START_OF_SYMBOL_DEFINITION no_list_inclusion */
/**
 * @summary no_list_inclusion
 * @constant
 * @type {number}
 */
export const no_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.no_list_inclusion; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION no_list_inclusion */

/* START_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_any_list_inclusion */
/**
 * @summary MailPreferenceOptionSyntax_any_list_inclusion
 * @constant
 * @type {number}
 */
export const MailPreferenceOptionSyntax_any_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.any_list_inclusion; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_any_list_inclusion */

/* START_OF_SYMBOL_DEFINITION any_list_inclusion */
/**
 * @summary any_list_inclusion
 * @constant
 * @type {number}
 */
export const any_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.any_list_inclusion; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION any_list_inclusion */

/* START_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_professional_list_inclusion */
/**
 * @summary MailPreferenceOptionSyntax_professional_list_inclusion
 * @constant
 * @type {number}
 */
export const MailPreferenceOptionSyntax_professional_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.professional_list_inclusion; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION MailPreferenceOptionSyntax_professional_list_inclusion */

/* START_OF_SYMBOL_DEFINITION professional_list_inclusion */
/**
 * @summary professional_list_inclusion
 * @constant
 * @type {number}
 */
export const professional_list_inclusion: MailPreferenceOptionSyntax =
    MailPreferenceOptionSyntax.professional_list_inclusion; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION professional_list_inclusion */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MailPreferenceOptionSyntax */
let _cached_decoder_for_MailPreferenceOptionSyntax: $.ASN1Decoder<MailPreferenceOptionSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_MailPreferenceOptionSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) MailPreferenceOptionSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MailPreferenceOptionSyntax} The decoded data structure.
 */
export function _decode_MailPreferenceOptionSyntax(el: _Element) {
    if (!_cached_decoder_for_MailPreferenceOptionSyntax) {
        _cached_decoder_for_MailPreferenceOptionSyntax = $._decodeEnumerated;
    }
    return _cached_decoder_for_MailPreferenceOptionSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MailPreferenceOptionSyntax */
let _cached_encoder_for_MailPreferenceOptionSyntax: $.ASN1Encoder<MailPreferenceOptionSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MailPreferenceOptionSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_MailPreferenceOptionSyntax */
/**
 * @summary Encodes a(n) MailPreferenceOptionSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MailPreferenceOptionSyntax, encoded as an ASN.1 Element.
 */
export function _encode_MailPreferenceOptionSyntax(
    value: MailPreferenceOptionSyntax,
    elGetter: $.ASN1Encoder<MailPreferenceOptionSyntax>
) {
    if (!_cached_encoder_for_MailPreferenceOptionSyntax) {
        _cached_encoder_for_MailPreferenceOptionSyntax = $._encodeEnumerated;
    }
    return _cached_encoder_for_MailPreferenceOptionSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MailPreferenceOptionSyntax */

/* eslint-enable */
