/* eslint-disable */
import { ASN1Element as _Element, ASN1TagClass as _TagClass } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    AttributeSel_attSelect_allAttr,
    _decode_AttributeSel_attSelect_allAttr,
    _encode_AttributeSel_attSelect_allAttr,
} from '../OtherImplicitlyTaggedTypes/AttributeSel-attSelect-allAttr.ta';
import {
    AttributeSel_attSelect_attributes_Item,
    _decode_AttributeSel_attSelect_attributes_Item,
    _encode_AttributeSel_attSelect_attributes_Item,
} from '../OtherImplicitlyTaggedTypes/AttributeSel-attSelect-attributes-Item.ta';
export {
    AttributeSel_attSelect_allAttr,
    _decode_AttributeSel_attSelect_allAttr,
    _encode_AttributeSel_attSelect_allAttr,
} from '../OtherImplicitlyTaggedTypes/AttributeSel-attSelect-allAttr.ta';
export {
    AttributeSel_attSelect_attributes_Item,
    _decode_AttributeSel_attSelect_attributes_Item,
    _encode_AttributeSel_attSelect_attributes_Item,
} from '../OtherImplicitlyTaggedTypes/AttributeSel-attSelect-attributes-Item.ta';

/* START_OF_SYMBOL_DEFINITION AttributeSel_attSelect */
/**
 * @summary AttributeSel_attSelect
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeSel-attSelect ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export type AttributeSel_attSelect =
    | { allAttr: AttributeSel_attSelect_allAttr } /* CHOICE_ALT_ROOT */
    | {
          attributes: AttributeSel_attSelect_attributes_Item[];
      } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION AttributeSel_attSelect */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect */
let _cached_decoder_for_AttributeSel_attSelect: $.ASN1Decoder<AttributeSel_attSelect> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeSel_attSelect
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeSel_attSelect} The decoded data structure.
 */
export function _decode_AttributeSel_attSelect(el: _Element) {
    if (!_cached_decoder_for_AttributeSel_attSelect) {
        _cached_decoder_for_AttributeSel_attSelect =
            $._decode_extensible_choice<AttributeSel_attSelect>({
                'CONTEXT 0': [
                    'allAttr',
                    $._decode_implicit<AttributeSel_attSelect_allAttr>(
                        () => _decode_AttributeSel_attSelect_allAttr
                    ),
                ],
                'CONTEXT 1': [
                    'attributes',
                    $._decode_implicit<
                        AttributeSel_attSelect_attributes_Item[]
                    >(() =>
                        $._decodeSequenceOf<AttributeSel_attSelect_attributes_Item>(
                            () => _decode_AttributeSel_attSelect_attributes_Item
                        )
                    ),
                ],
            });
    }
    return _cached_decoder_for_AttributeSel_attSelect(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect */
let _cached_encoder_for_AttributeSel_attSelect: $.ASN1Encoder<AttributeSel_attSelect> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect */
/**
 * @summary Encodes a(n) AttributeSel_attSelect into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeSel_attSelect, encoded as an ASN.1 Element.
 */
export function _encode_AttributeSel_attSelect(
    value: AttributeSel_attSelect,
    elGetter: $.ASN1Encoder<AttributeSel_attSelect>
) {
    if (!_cached_encoder_for_AttributeSel_attSelect) {
        _cached_encoder_for_AttributeSel_attSelect =
            $._encode_choice<AttributeSel_attSelect>(
                {
                    allAttr: $._encode_implicit(
                        _TagClass.context,
                        0,
                        () => _encode_AttributeSel_attSelect_allAttr,
                        $.BER
                    ),
                    attributes: $._encode_implicit(
                        _TagClass.context,
                        1,
                        () =>
                            $._encodeSequenceOf<AttributeSel_attSelect_attributes_Item>(
                                () =>
                                    _encode_AttributeSel_attSelect_attributes_Item,
                                $.BER
                            ),
                        $.BER
                    ),
                },
                $.BER
            );
    }
    return _cached_encoder_for_AttributeSel_attSelect(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect */

/* eslint-enable */
