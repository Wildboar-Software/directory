/* eslint-disable */
import { Extension, _decode_Extension, _encode_Extension } from "@wildboar/x500/AuthenticationFramework";
import {
    ASN1Element as _Element
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION ExtensionReq */
/**
 * @summary ExtensionReq
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ExtensionReq  ::=  SEQUENCE SIZE (1..MAX) OF Extension
 * ```
 */
export
type ExtensionReq = Extension[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ExtensionReq */
let _cached_decoder_for_ExtensionReq: $.ASN1Decoder<ExtensionReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _decode_ExtensionReq */
/**
 * @summary Decodes an ASN.1 element into a(n) ExtensionReq
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ExtensionReq} The decoded data structure.
 */
export
function _decode_ExtensionReq (el: _Element) {
    if (!_cached_decoder_for_ExtensionReq) { _cached_decoder_for_ExtensionReq = $._decodeSequenceOf<Extension>(() => _decode_Extension); }
    return _cached_decoder_for_ExtensionReq(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ExtensionReq */
let _cached_encoder_for_ExtensionReq: $.ASN1Encoder<ExtensionReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ExtensionReq */

/* START_OF_SYMBOL_DEFINITION _encode_ExtensionReq */
/**
 * @summary Encodes a(n) ExtensionReq into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ExtensionReq, encoded as an ASN.1 Element.
 */
export
function _encode_ExtensionReq (value: ExtensionReq, elGetter: $.ASN1Encoder<ExtensionReq>) {
    if (!_cached_encoder_for_ExtensionReq) { _cached_encoder_for_ExtensionReq = $._encodeSequenceOf<Extension>(() => _encode_Extension, $.BER); }
    return _cached_encoder_for_ExtensionReq(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ExtensionReq */

/* eslint-enable */
