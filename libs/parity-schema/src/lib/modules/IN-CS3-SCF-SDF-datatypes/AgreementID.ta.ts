/* eslint-disable */
import { ASN1Element as _Element, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION AgreementID */
/**
 * @summary AgreementID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AgreementID  ::=  OBJECT IDENTIFIER
 * ```
 */
export type AgreementID = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION AgreementID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AgreementID */
let _cached_decoder_for_AgreementID: $.ASN1Decoder<AgreementID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AgreementID */

/* START_OF_SYMBOL_DEFINITION _decode_AgreementID */
/**
 * @summary Decodes an ASN.1 element into a(n) AgreementID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AgreementID} The decoded data structure.
 */
export function _decode_AgreementID(el: _Element) {
    if (!_cached_decoder_for_AgreementID) {
        _cached_decoder_for_AgreementID = $._decodeObjectIdentifier;
    }
    return _cached_decoder_for_AgreementID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AgreementID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AgreementID */
let _cached_encoder_for_AgreementID: $.ASN1Encoder<AgreementID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AgreementID */

/* START_OF_SYMBOL_DEFINITION _encode_AgreementID */
/**
 * @summary Encodes a(n) AgreementID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AgreementID, encoded as an ASN.1 Element.
 */
export function _encode_AgreementID(
    value: AgreementID,
    elGetter: $.ASN1Encoder<AgreementID>
) {
    if (!_cached_encoder_for_AgreementID) {
        _cached_encoder_for_AgreementID = $._encodeObjectIdentifier;
    }
    return _cached_encoder_for_AgreementID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AgreementID */

/* eslint-enable */
