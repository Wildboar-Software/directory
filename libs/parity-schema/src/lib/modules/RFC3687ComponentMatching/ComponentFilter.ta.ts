/* eslint-disable */
import { ASN1Element as _Element, ASN1TagClass as _TagClass } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ComponentAssertion,
    _decode_ComponentAssertion,
    _encode_ComponentAssertion,
} from '../RFC3687ComponentMatching/ComponentAssertion.ta';
export {
    ComponentAssertion,
    _decode_ComponentAssertion,
    _encode_ComponentAssertion,
} from '../RFC3687ComponentMatching/ComponentAssertion.ta';

/* START_OF_SYMBOL_DEFINITION ComponentFilter */
/**
 * @summary ComponentFilter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ComponentFilter  ::=  CHOICE {
 *     item  [0] ComponentAssertion,
 *     and   [1] SEQUENCE OF ComponentFilter,
 *     or    [2] SEQUENCE OF ComponentFilter,
 *     not   [3] ComponentFilter,
 *     ...
 * }
 * ```
 */
export type ComponentFilter =
    | { item: ComponentAssertion } /* CHOICE_ALT_ROOT */
    | { and: ComponentFilter[] } /* CHOICE_ALT_ROOT */
    | { or: ComponentFilter[] } /* CHOICE_ALT_ROOT */
    | { not: ComponentFilter } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentFilter */
let _cached_decoder_for_ComponentFilter: $.ASN1Decoder<ComponentFilter> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _decode_ComponentFilter */
/**
 * @summary Decodes an ASN.1 element into a(n) ComponentFilter
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ComponentFilter} The decoded data structure.
 */
export function _decode_ComponentFilter(el: _Element) {
    if (!_cached_decoder_for_ComponentFilter) {
        _cached_decoder_for_ComponentFilter =
            $._decode_extensible_choice<ComponentFilter>({
                'CONTEXT 0': [
                    'item',
                    $._decode_implicit<ComponentAssertion>(
                        () => _decode_ComponentAssertion
                    ),
                ],
                'CONTEXT 1': [
                    'and',
                    $._decode_implicit<ComponentFilter[]>(() =>
                        $._decodeSequenceOf<ComponentFilter>(
                            () => _decode_ComponentFilter
                        )
                    ),
                ],
                'CONTEXT 2': [
                    'or',
                    $._decode_implicit<ComponentFilter[]>(() =>
                        $._decodeSequenceOf<ComponentFilter>(
                            () => _decode_ComponentFilter
                        )
                    ),
                ],
                'CONTEXT 3': [
                    'not',
                    $._decode_explicit<ComponentFilter>(
                        () => _decode_ComponentFilter
                    ),
                ],
            });
    }
    return _cached_decoder_for_ComponentFilter(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentFilter */
let _cached_encoder_for_ComponentFilter: $.ASN1Encoder<ComponentFilter> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentFilter */

/* START_OF_SYMBOL_DEFINITION _encode_ComponentFilter */
/**
 * @summary Encodes a(n) ComponentFilter into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ComponentFilter, encoded as an ASN.1 Element.
 */
export function _encode_ComponentFilter(
    value: ComponentFilter,
    elGetter: $.ASN1Encoder<ComponentFilter>
) {
    if (!_cached_encoder_for_ComponentFilter) {
        _cached_encoder_for_ComponentFilter = $._encode_choice<ComponentFilter>(
            {
                item: $._encode_implicit(
                    _TagClass.context,
                    0,
                    () => _encode_ComponentAssertion,
                    $.BER
                ),
                and: $._encode_implicit(
                    _TagClass.context,
                    1,
                    () =>
                        $._encodeSequenceOf<ComponentFilter>(
                            () => _encode_ComponentFilter,
                            $.BER
                        ),
                    $.BER
                ),
                or: $._encode_implicit(
                    _TagClass.context,
                    2,
                    () =>
                        $._encodeSequenceOf<ComponentFilter>(
                            () => _encode_ComponentFilter,
                            $.BER
                        ),
                    $.BER
                ),
                not: $._encode_explicit(
                    _TagClass.context,
                    3,
                    () => _encode_ComponentFilter,
                    $.BER
                ),
            },
            $.BER
        );
    }
    return _cached_encoder_for_ComponentFilter(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ComponentFilter */

/* eslint-enable */
