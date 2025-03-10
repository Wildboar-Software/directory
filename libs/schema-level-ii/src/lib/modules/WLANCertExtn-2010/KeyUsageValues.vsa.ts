/* eslint-disable */
import {
    ASN1Element as _Element,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION KeyUsageValues */
/**
 * @summary KeyUsageValues
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * KeyUsageValues OBJECT IDENTIFIER ::= {id-kp-eapOverPPP | id-kp-eapOverLAN}
 * ```
 *
 * @type {OBJECT_IDENTIFIER}
 */
export
type KeyUsageValues = OBJECT_IDENTIFIER; // VALUE_SET_TYPE
/* END_OF_SYMBOL_DEFINITION KeyUsageValues */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_KeyUsageValues */
let _cached_decoder_for_KeyUsageValues: $.ASN1Decoder<KeyUsageValues> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_KeyUsageValues */

/* START_OF_SYMBOL_DEFINITION _decode_KeyUsageValues */
export
function _decode_KeyUsageValues (el: _Element) {    if (!_cached_decoder_for_KeyUsageValues) { _cached_decoder_for_KeyUsageValues = $._decodeObjectIdentifier; }    return _cached_decoder_for_KeyUsageValues(el);}
/* END_OF_SYMBOL_DEFINITION _decode_KeyUsageValues */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_KeyUsageValues */
let _cached_encoder_for_KeyUsageValues: $.ASN1Encoder<KeyUsageValues> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_KeyUsageValues */

/* START_OF_SYMBOL_DEFINITION _encode_KeyUsageValues */
export
function _encode_KeyUsageValues (value: KeyUsageValues, elGetter: $.ASN1Encoder<KeyUsageValues>) {    if (!_cached_encoder_for_KeyUsageValues) { _cached_encoder_for_KeyUsageValues = $._encodeObjectIdentifier; }    return _cached_encoder_for_KeyUsageValues(value, elGetter);}
/* END_OF_SYMBOL_DEFINITION _encode_KeyUsageValues */

/* eslint-enable */
