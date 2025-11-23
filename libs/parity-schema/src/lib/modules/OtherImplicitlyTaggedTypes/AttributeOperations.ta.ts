/* eslint-disable */
import { ASN1Element as _Element, BIT_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION AttributeOperations */
/**
 * @summary AttributeOperations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeOperations  ::=  BIT STRING {
 *   read             (0),
 *   compare          (1),
 *   add              (2),
 *   modify           (3),
 *   delete           (4),
 *   deleteValue      (5),
 *   replaceAttribute (6),
 *   discloseOnError  (7) }
 * ```
 */
export type AttributeOperations = BIT_STRING;
/* END_OF_SYMBOL_DEFINITION AttributeOperations */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_read */
/**
 * @summary AttributeOperations_read
 * @constant
 */
export const AttributeOperations_read: number = 0; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_read */

/* START_OF_SYMBOL_DEFINITION read */
/**
 * @summary read
 * @constant
 */
export const read: number = AttributeOperations_read; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION read */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_compare */
/**
 * @summary AttributeOperations_compare
 * @constant
 */
export const AttributeOperations_compare: number = 1; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_compare */

/* START_OF_SYMBOL_DEFINITION compare */
/**
 * @summary compare
 * @constant
 */
export const compare: number =
    AttributeOperations_compare; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION compare */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_add */
/**
 * @summary AttributeOperations_add
 * @constant
 */
export const AttributeOperations_add: number = 2; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_add */

/* START_OF_SYMBOL_DEFINITION add */
/**
 * @summary add
 * @constant
 */
export const add: number = AttributeOperations_add; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION add */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_modify */
/**
 * @summary AttributeOperations_modify
 * @constant
 */
export const AttributeOperations_modify: number = 3; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_modify */

/* START_OF_SYMBOL_DEFINITION modify */
/**
 * @summary modify
 * @constant
 */
export const modify: number = AttributeOperations_modify; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION modify */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_delete_ */
/**
 * @summary AttributeOperations_delete_
 * @constant
 */
export const AttributeOperations_delete_: number = 4; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_delete_ */

/* START_OF_SYMBOL_DEFINITION delete_ */
/**
 * @summary delete_
 * @constant
 */
export const delete_: number =
    AttributeOperations_delete_; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION delete_ */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_deleteValue */
/**
 * @summary AttributeOperations_deleteValue
 * @constant
 */
export const AttributeOperations_deleteValue: number = 5; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_deleteValue */

/* START_OF_SYMBOL_DEFINITION deleteValue */
/**
 * @summary deleteValue
 * @constant
 */
export const deleteValue: number =
    AttributeOperations_deleteValue; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION deleteValue */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_replaceAttribute */
/**
 * @summary AttributeOperations_replaceAttribute
 * @constant
 */
export const AttributeOperations_replaceAttribute: number = 6; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_replaceAttribute */

/* START_OF_SYMBOL_DEFINITION replaceAttribute */
/**
 * @summary replaceAttribute
 * @constant
 */
export const replaceAttribute: number =
    AttributeOperations_replaceAttribute; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION replaceAttribute */

/* START_OF_SYMBOL_DEFINITION AttributeOperations_discloseOnError */
/**
 * @summary AttributeOperations_discloseOnError
 * @constant
 */
export const AttributeOperations_discloseOnError: number = 7; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AttributeOperations_discloseOnError */

/* START_OF_SYMBOL_DEFINITION discloseOnError */
/**
 * @summary discloseOnError
 * @constant
 */
export const discloseOnError: number =
    AttributeOperations_discloseOnError; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION discloseOnError */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeOperations */
let _cached_decoder_for_AttributeOperations: $.ASN1Decoder<AttributeOperations> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeOperations */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeOperations */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeOperations
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeOperations} The decoded data structure.
 */
export function _decode_AttributeOperations(el: _Element) {
    if (!_cached_decoder_for_AttributeOperations) {
        _cached_decoder_for_AttributeOperations = $._decodeBitString;
    }
    return _cached_decoder_for_AttributeOperations(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeOperations */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeOperations */
let _cached_encoder_for_AttributeOperations: $.ASN1Encoder<AttributeOperations> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeOperations */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeOperations */
/**
 * @summary Encodes a(n) AttributeOperations into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeOperations, encoded as an ASN.1 Element.
 */
export function _encode_AttributeOperations(
    value: AttributeOperations,
    elGetter: $.ASN1Encoder<AttributeOperations>
) {
    if (!_cached_encoder_for_AttributeOperations) {
        _cached_encoder_for_AttributeOperations = $._encodeBitString;
    }
    return _cached_encoder_for_AttributeOperations(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeOperations */

/* eslint-enable */
