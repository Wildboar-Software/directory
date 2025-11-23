/* eslint-disable */
import {
    OBJECT_IDENTIFIER,
    ASN1Element as _Element
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { HardwareModules, _decode_HardwareModules, _encode_HardwareModules } from "../CMSFirmwareWrapper/HardwareModules.ta";


/* START_OF_SYMBOL_DEFINITION CommunityIdentifier */
/**
 * @summary CommunityIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CommunityIdentifier  ::=  CHOICE {
 *     communityOID                OBJECT IDENTIFIER,
 *     hwModuleList                HardwareModules
 * }
 * ```
 */
export
type CommunityIdentifier =
    { communityOID: OBJECT_IDENTIFIER } /* CHOICE_ALT_ROOT */
    | { hwModuleList: HardwareModules } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifier */
let _cached_decoder_for_CommunityIdentifier: $.ASN1Decoder<CommunityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_CommunityIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) CommunityIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CommunityIdentifier} The decoded data structure.
 */
export
function _decode_CommunityIdentifier (el: _Element) {
    if (!_cached_decoder_for_CommunityIdentifier) { _cached_decoder_for_CommunityIdentifier = $._decode_inextensible_choice<CommunityIdentifier>({
    "UNIVERSAL 6": [ "communityOID", $._decodeObjectIdentifier ],
    "UNIVERSAL 16": [ "hwModuleList", _decode_HardwareModules ]
}); }
    return _cached_decoder_for_CommunityIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifier */
let _cached_encoder_for_CommunityIdentifier: $.ASN1Encoder<CommunityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_CommunityIdentifier */
/**
 * @summary Encodes a(n) CommunityIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CommunityIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_CommunityIdentifier (value: CommunityIdentifier, elGetter: $.ASN1Encoder<CommunityIdentifier>) {
    if (!_cached_encoder_for_CommunityIdentifier) { _cached_encoder_for_CommunityIdentifier = $._encode_choice<CommunityIdentifier>({
    "communityOID": $._encodeObjectIdentifier,
    "hwModuleList": _encode_HardwareModules,
}, $.BER); }
    return _cached_encoder_for_CommunityIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CommunityIdentifier */

/* eslint-enable */
