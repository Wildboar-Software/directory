/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    IssuerAndSerialNumber,
    _decode_IssuerAndSerialNumber,
    _encode_IssuerAndSerialNumber,
} from '../ExtendedSecurityServices-2009/IssuerAndSerialNumber.ta';
import {
    SubjectKeyIdentifier,
    _decode_SubjectKeyIdentifier,
    _encode_SubjectKeyIdentifier,
} from '../ExtendedSecurityServices-2009/SubjectKeyIdentifier.ta';

/* START_OF_SYMBOL_DEFINITION EntityIdentifier */
/**
 * @summary EntityIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * EntityIdentifier  ::=  CHOICE {
 *     issuerAndSerialNumber IssuerAndSerialNumber,
 *     subjectKeyIdentifier SubjectKeyIdentifier }
 * ```
 */
export type EntityIdentifier =
    | { issuerAndSerialNumber: IssuerAndSerialNumber } /* CHOICE_ALT_ROOT */
    | { subjectKeyIdentifier: SubjectKeyIdentifier } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EntityIdentifier */
let _cached_decoder_for_EntityIdentifier: $.ASN1Decoder<EntityIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_EntityIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) EntityIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EntityIdentifier} The decoded data structure.
 */
export function _decode_EntityIdentifier(el: _Element) {
    if (!_cached_decoder_for_EntityIdentifier) {
        _cached_decoder_for_EntityIdentifier =
            $._decode_inextensible_choice<EntityIdentifier>({
                'UNIVERSAL 16': [
                    'issuerAndSerialNumber',
                    _decode_IssuerAndSerialNumber,
                ],
                'UNIVERSAL 4': [
                    'subjectKeyIdentifier',
                    _decode_SubjectKeyIdentifier,
                ],
            });
    }
    return _cached_decoder_for_EntityIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EntityIdentifier */
let _cached_encoder_for_EntityIdentifier: $.ASN1Encoder<EntityIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EntityIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_EntityIdentifier */
/**
 * @summary Encodes a(n) EntityIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EntityIdentifier, encoded as an ASN.1 Element.
 */
export function _encode_EntityIdentifier(
    value: EntityIdentifier,
    elGetter: $.ASN1Encoder<EntityIdentifier>
) {
    if (!_cached_encoder_for_EntityIdentifier) {
        _cached_encoder_for_EntityIdentifier =
            $._encode_choice<EntityIdentifier>(
                {
                    issuerAndSerialNumber: _encode_IssuerAndSerialNumber,
                    subjectKeyIdentifier: _encode_SubjectKeyIdentifier,
                },
                $.BER
            );
    }
    return _cached_encoder_for_EntityIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EntityIdentifier */

/* eslint-enable */
