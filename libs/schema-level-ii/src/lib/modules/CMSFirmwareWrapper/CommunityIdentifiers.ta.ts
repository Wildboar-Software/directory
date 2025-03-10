/* eslint-disable */
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { CommunityIdentifier, _decode_CommunityIdentifier, _encode_CommunityIdentifier } from "../CMSFirmwareWrapper/CommunityIdentifier.ta";
export { CommunityIdentifier, _decode_CommunityIdentifier, _encode_CommunityIdentifier } from "../CMSFirmwareWrapper/CommunityIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION CommunityIdentifiers */
/**
 * @summary CommunityIdentifiers
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CommunityIdentifiers  ::=  SEQUENCE OF CommunityIdentifier
 * ```
 */
export
type CommunityIdentifiers = CommunityIdentifier[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CommunityIdentifiers */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifiers */
let _cached_decoder_for_CommunityIdentifiers: $.ASN1Decoder<CommunityIdentifiers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifiers */

/* START_OF_SYMBOL_DEFINITION _decode_CommunityIdentifiers */
/**
 * @summary Decodes an ASN.1 element into a(n) CommunityIdentifiers
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CommunityIdentifiers} The decoded data structure.
 */
export
function _decode_CommunityIdentifiers (el: _Element) {
    if (!_cached_decoder_for_CommunityIdentifiers) { _cached_decoder_for_CommunityIdentifiers = $._decodeSequenceOf<CommunityIdentifier>(() => _decode_CommunityIdentifier); }
    return _cached_decoder_for_CommunityIdentifiers(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CommunityIdentifiers */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifiers */
let _cached_encoder_for_CommunityIdentifiers: $.ASN1Encoder<CommunityIdentifiers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifiers */

/* START_OF_SYMBOL_DEFINITION _encode_CommunityIdentifiers */
/**
 * @summary Encodes a(n) CommunityIdentifiers into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CommunityIdentifiers, encoded as an ASN.1 Element.
 */
export
function _encode_CommunityIdentifiers (value: CommunityIdentifiers, elGetter: $.ASN1Encoder<CommunityIdentifiers>) {
    if (!_cached_encoder_for_CommunityIdentifiers) { _cached_encoder_for_CommunityIdentifiers = $._encodeSequenceOf<CommunityIdentifier>(() => _encode_CommunityIdentifier, $.BER); }
    return _cached_encoder_for_CommunityIdentifiers(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CommunityIdentifiers */

/* eslint-enable */
