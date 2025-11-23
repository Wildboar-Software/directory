/* eslint-disable */
import {
    ASN1Element as _Element,
    OBJECT_IDENTIFIER,
    OCTET_STRING,
    UTF8String,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION IetfAttrSyntax_values_Item */
/**
 * @summary IetfAttrSyntax_values_Item
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * IetfAttrSyntax-values-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export type IetfAttrSyntax_values_Item =
    | { octets: OCTET_STRING } /* CHOICE_ALT_ROOT */
    | { oid: OBJECT_IDENTIFIER } /* CHOICE_ALT_ROOT */
    | { string_: UTF8String } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION IetfAttrSyntax_values_Item */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_IetfAttrSyntax_values_Item */
let _cached_decoder_for_IetfAttrSyntax_values_Item: $.ASN1Decoder<IetfAttrSyntax_values_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_IetfAttrSyntax_values_Item */

/* START_OF_SYMBOL_DEFINITION _decode_IetfAttrSyntax_values_Item */
/**
 * @summary Decodes an ASN.1 element into a(n) IetfAttrSyntax_values_Item
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {IetfAttrSyntax_values_Item} The decoded data structure.
 */
export function _decode_IetfAttrSyntax_values_Item(el: _Element) {
    if (!_cached_decoder_for_IetfAttrSyntax_values_Item) {
        _cached_decoder_for_IetfAttrSyntax_values_Item =
            $._decode_extensible_choice<IetfAttrSyntax_values_Item>({
                'UNIVERSAL 4': ['octets', $._decodeOctetString],
                'UNIVERSAL 6': ['oid', $._decodeObjectIdentifier],
                'UNIVERSAL 12': ['string_', $._decodeUTF8String],
            });
    }
    return _cached_decoder_for_IetfAttrSyntax_values_Item(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_IetfAttrSyntax_values_Item */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_IetfAttrSyntax_values_Item */
let _cached_encoder_for_IetfAttrSyntax_values_Item: $.ASN1Encoder<IetfAttrSyntax_values_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_IetfAttrSyntax_values_Item */

/* START_OF_SYMBOL_DEFINITION _encode_IetfAttrSyntax_values_Item */
/**
 * @summary Encodes a(n) IetfAttrSyntax_values_Item into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The IetfAttrSyntax_values_Item, encoded as an ASN.1 Element.
 */
export function _encode_IetfAttrSyntax_values_Item(
    value: IetfAttrSyntax_values_Item,
    elGetter: $.ASN1Encoder<IetfAttrSyntax_values_Item>
) {
    if (!_cached_encoder_for_IetfAttrSyntax_values_Item) {
        _cached_encoder_for_IetfAttrSyntax_values_Item =
            $._encode_choice<IetfAttrSyntax_values_Item>(
                {
                    octets: $._encodeOctetString,
                    oid: $._encodeObjectIdentifier,
                    string_: $._encodeUTF8String,
                },
                $.BER
            );
    }
    return _cached_encoder_for_IetfAttrSyntax_values_Item(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_IetfAttrSyntax_values_Item */

/* eslint-enable */
