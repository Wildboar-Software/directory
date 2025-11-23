/* eslint-disable */
import { ASN1Element as _Element, BIT_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ObjectOperations */
/**
 * @summary ObjectOperations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ObjectOperations  ::=  BIT STRING {
 *   read            (0),
 *   add             (1),
 *   modify          (2),
 *   delete          (3),
 *   rename          (4),
 *   discloseOnError (5) }
 * ```
 */
export type ObjectOperations = BIT_STRING;
/* END_OF_SYMBOL_DEFINITION ObjectOperations */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_read */
/**
 * @summary ObjectOperations_read
 * @constant
 */
export const ObjectOperations_read: number = 0; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_read */

/* START_OF_SYMBOL_DEFINITION read */
/**
 * @summary read
 * @constant
 */
export const read: number = ObjectOperations_read; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION read */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_add */
/**
 * @summary ObjectOperations_add
 * @constant
 */
export const ObjectOperations_add: number = 1; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_add */

/* START_OF_SYMBOL_DEFINITION add */
/**
 * @summary add
 * @constant
 */
export const add: number = ObjectOperations_add; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION add */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_modify */
/**
 * @summary ObjectOperations_modify
 * @constant
 */
export const ObjectOperations_modify: number = 2; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_modify */

/* START_OF_SYMBOL_DEFINITION modify */
/**
 * @summary modify
 * @constant
 */
export const modify: number = ObjectOperations_modify; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION modify */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_delete_ */
/**
 * @summary ObjectOperations_delete_
 * @constant
 */
export const ObjectOperations_delete_: number = 3; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_delete_ */

/* START_OF_SYMBOL_DEFINITION delete_ */
/**
 * @summary delete_
 * @constant
 */
export const delete_: number = ObjectOperations_delete_; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION delete_ */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_rename */
/**
 * @summary ObjectOperations_rename
 * @constant
 */
export const ObjectOperations_rename: number = 4; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_rename */

/* START_OF_SYMBOL_DEFINITION rename */
/**
 * @summary rename
 * @constant
 */
export const rename: number = ObjectOperations_rename; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION rename */

/* START_OF_SYMBOL_DEFINITION ObjectOperations_discloseOnError */
/**
 * @summary ObjectOperations_discloseOnError
 * @constant
 */
export const ObjectOperations_discloseOnError: number = 5; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION ObjectOperations_discloseOnError */

/* START_OF_SYMBOL_DEFINITION discloseOnError */
/**
 * @summary discloseOnError
 * @constant
 */
export const discloseOnError: number =
    ObjectOperations_discloseOnError; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION discloseOnError */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectOperations */
let _cached_decoder_for_ObjectOperations: $.ASN1Decoder<ObjectOperations> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectOperations */

/* START_OF_SYMBOL_DEFINITION _decode_ObjectOperations */
/**
 * @summary Decodes an ASN.1 element into a(n) ObjectOperations
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ObjectOperations} The decoded data structure.
 */
export function _decode_ObjectOperations(el: _Element) {
    if (!_cached_decoder_for_ObjectOperations) {
        _cached_decoder_for_ObjectOperations = $._decodeBitString;
    }
    return _cached_decoder_for_ObjectOperations(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ObjectOperations */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectOperations */
let _cached_encoder_for_ObjectOperations: $.ASN1Encoder<ObjectOperations> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectOperations */

/* START_OF_SYMBOL_DEFINITION _encode_ObjectOperations */
/**
 * @summary Encodes a(n) ObjectOperations into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ObjectOperations, encoded as an ASN.1 Element.
 */
export function _encode_ObjectOperations(
    value: ObjectOperations,
    elGetter: $.ASN1Encoder<ObjectOperations>
) {
    if (!_cached_encoder_for_ObjectOperations) {
        _cached_encoder_for_ObjectOperations = $._encodeBitString;
    }
    return _cached_encoder_for_ObjectOperations(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ObjectOperations */

/* eslint-enable */
