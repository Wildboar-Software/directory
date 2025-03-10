/* eslint-disable */
import { EnvelopedData, _decode_EnvelopedData, _encode_EnvelopedData } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EnvelopedData.ta";
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
export { EnvelopedData, _decode_EnvelopedData, _encode_EnvelopedData } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EnvelopedData.ta";


/* START_OF_SYMBOL_DEFINITION WrappedFirmwareKey */
/**
 * @summary WrappedFirmwareKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * WrappedFirmwareKey  ::=  EnvelopedData
 * ```
 */
export
type WrappedFirmwareKey = EnvelopedData; // DefinedType
/* END_OF_SYMBOL_DEFINITION WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_WrappedFirmwareKey */
let _cached_decoder_for_WrappedFirmwareKey: $.ASN1Decoder<WrappedFirmwareKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _decode_WrappedFirmwareKey */
/**
 * @summary Decodes an ASN.1 element into a(n) WrappedFirmwareKey
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {WrappedFirmwareKey} The decoded data structure.
 */
export
function _decode_WrappedFirmwareKey (el: _Element) {
    if (!_cached_decoder_for_WrappedFirmwareKey) { _cached_decoder_for_WrappedFirmwareKey = _decode_EnvelopedData; }
    return _cached_decoder_for_WrappedFirmwareKey(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_WrappedFirmwareKey */
let _cached_encoder_for_WrappedFirmwareKey: $.ASN1Encoder<WrappedFirmwareKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _encode_WrappedFirmwareKey */
/**
 * @summary Encodes a(n) WrappedFirmwareKey into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The WrappedFirmwareKey, encoded as an ASN.1 Element.
 */
export
function _encode_WrappedFirmwareKey (value: WrappedFirmwareKey, elGetter: $.ASN1Encoder<WrappedFirmwareKey>) {
    if (!_cached_encoder_for_WrappedFirmwareKey) { _cached_encoder_for_WrappedFirmwareKey = _encode_EnvelopedData; }
    return _cached_encoder_for_WrappedFirmwareKey(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_WrappedFirmwareKey */

/* eslint-enable */
