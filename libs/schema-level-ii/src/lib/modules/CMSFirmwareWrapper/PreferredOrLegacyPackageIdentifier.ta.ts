/* eslint-disable */
import {
    OCTET_STRING,
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PreferredPackageIdentifier, _decode_PreferredPackageIdentifier, _encode_PreferredPackageIdentifier } from "../CMSFirmwareWrapper/PreferredPackageIdentifier.ta";
export { PreferredPackageIdentifier, _decode_PreferredPackageIdentifier, _encode_PreferredPackageIdentifier } from "../CMSFirmwareWrapper/PreferredPackageIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION PreferredOrLegacyPackageIdentifier */
/**
 * @summary PreferredOrLegacyPackageIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PreferredOrLegacyPackageIdentifier  ::=  CHOICE {
 *     preferred   PreferredPackageIdentifier,
 *     legacy      OCTET STRING
 * }
 * ```
 */
export
type PreferredOrLegacyPackageIdentifier =
    { preferred: PreferredPackageIdentifier } /* CHOICE_ALT_ROOT */
    | { legacy: OCTET_STRING } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION PreferredOrLegacyPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredOrLegacyPackageIdentifier */
let _cached_decoder_for_PreferredOrLegacyPackageIdentifier: $.ASN1Decoder<PreferredOrLegacyPackageIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredOrLegacyPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_PreferredOrLegacyPackageIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) PreferredOrLegacyPackageIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PreferredOrLegacyPackageIdentifier} The decoded data structure.
 */
export
function _decode_PreferredOrLegacyPackageIdentifier (el: _Element) {
    if (!_cached_decoder_for_PreferredOrLegacyPackageIdentifier) { _cached_decoder_for_PreferredOrLegacyPackageIdentifier = $._decode_inextensible_choice<PreferredOrLegacyPackageIdentifier>({
    "UNIVERSAL 16": [ "preferred", _decode_PreferredPackageIdentifier ],
    "UNIVERSAL 4": [ "legacy", $._decodeOctetString ]
}); }
    return _cached_decoder_for_PreferredOrLegacyPackageIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PreferredOrLegacyPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredOrLegacyPackageIdentifier */
let _cached_encoder_for_PreferredOrLegacyPackageIdentifier: $.ASN1Encoder<PreferredOrLegacyPackageIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredOrLegacyPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_PreferredOrLegacyPackageIdentifier */
/**
 * @summary Encodes a(n) PreferredOrLegacyPackageIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PreferredOrLegacyPackageIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_PreferredOrLegacyPackageIdentifier (value: PreferredOrLegacyPackageIdentifier, elGetter: $.ASN1Encoder<PreferredOrLegacyPackageIdentifier>) {
    if (!_cached_encoder_for_PreferredOrLegacyPackageIdentifier) { _cached_encoder_for_PreferredOrLegacyPackageIdentifier = $._encode_choice<PreferredOrLegacyPackageIdentifier>({
    "preferred": _encode_PreferredPackageIdentifier,
    "legacy": $._encodeOctetString,
}, $.BER); }
    return _cached_encoder_for_PreferredOrLegacyPackageIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PreferredOrLegacyPackageIdentifier */

/* eslint-enable */
