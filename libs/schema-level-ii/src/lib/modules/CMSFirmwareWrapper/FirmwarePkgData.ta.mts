/* eslint-disable */
import {
    ASN1Element as _Element,
    OCTET_STRING
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION FirmwarePkgData */
/**
 * @summary FirmwarePkgData
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FirmwarePkgData  ::=  OCTET STRING
 * ```
 */
export
type FirmwarePkgData = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION FirmwarePkgData */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePkgData */
let _cached_decoder_for_FirmwarePkgData: $.ASN1Decoder<FirmwarePkgData> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePkgData */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePkgData */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePkgData
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePkgData} The decoded data structure.
 */
export
function _decode_FirmwarePkgData (el: _Element) {
    if (!_cached_decoder_for_FirmwarePkgData) { _cached_decoder_for_FirmwarePkgData = $._decodeOctetString; }
    return _cached_decoder_for_FirmwarePkgData(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePkgData */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePkgData */
let _cached_encoder_for_FirmwarePkgData: $.ASN1Encoder<FirmwarePkgData> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePkgData */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePkgData */
/**
 * @summary Encodes a(n) FirmwarePkgData into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePkgData, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePkgData (value: FirmwarePkgData, elGetter: $.ASN1Encoder<FirmwarePkgData>) {
    if (!_cached_encoder_for_FirmwarePkgData) { _cached_encoder_for_FirmwarePkgData = $._encodeOctetString; }
    return _cached_encoder_for_FirmwarePkgData(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePkgData */

/* eslint-enable */
