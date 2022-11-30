/* eslint-disable */
import { ASN1Element as _Element, UTF8String } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION DBRecord */
/**
 * @summary DBRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DBRecord  ::=  UTF8String
 * ```
 */
export type DBRecord = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION DBRecord */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DBRecord */
let _cached_decoder_for_DBRecord: $.ASN1Decoder<DBRecord> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DBRecord */

/* START_OF_SYMBOL_DEFINITION _decode_DBRecord */
/**
 * @summary Decodes an ASN.1 element into a(n) DBRecord
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DBRecord} The decoded data structure.
 */
export function _decode_DBRecord(el: _Element) {
    if (!_cached_decoder_for_DBRecord) {
        _cached_decoder_for_DBRecord = $._decodeUTF8String;
    }
    return _cached_decoder_for_DBRecord(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DBRecord */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DBRecord */
let _cached_encoder_for_DBRecord: $.ASN1Encoder<DBRecord> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DBRecord */

/* START_OF_SYMBOL_DEFINITION _encode_DBRecord */
/**
 * @summary Encodes a(n) DBRecord into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DBRecord, encoded as an ASN.1 Element.
 */
export function _encode_DBRecord(
    value: DBRecord,
    elGetter: $.ASN1Encoder<DBRecord>
) {
    if (!_cached_encoder_for_DBRecord) {
        _cached_encoder_for_DBRecord = $._encodeUTF8String;
    }
    return _cached_encoder_for_DBRecord(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DBRecord */

/* eslint-enable */
