/* eslint-disable */
import {
    UniqueIdentifier,
    _decode_UniqueIdentifier,
    _encode_UniqueIdentifier,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    UniqueIdentifier,
    _decode_UniqueIdentifier,
    _encode_UniqueIdentifier,
} from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION UniqueIdentifierOfBioParaInfo */
/**
 * @summary UniqueIdentifierOfBioParaInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * UniqueIdentifierOfBioParaInfo  ::=  UniqueIdentifier
 * ```
 */
export type UniqueIdentifierOfBioParaInfo = UniqueIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION UniqueIdentifierOfBioParaInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_UniqueIdentifierOfBioParaInfo */
let _cached_decoder_for_UniqueIdentifierOfBioParaInfo: $.ASN1Decoder<UniqueIdentifierOfBioParaInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_UniqueIdentifierOfBioParaInfo */

/* START_OF_SYMBOL_DEFINITION _decode_UniqueIdentifierOfBioParaInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) UniqueIdentifierOfBioParaInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {UniqueIdentifierOfBioParaInfo} The decoded data structure.
 */
export function _decode_UniqueIdentifierOfBioParaInfo(el: _Element) {
    if (!_cached_decoder_for_UniqueIdentifierOfBioParaInfo) {
        _cached_decoder_for_UniqueIdentifierOfBioParaInfo =
            _decode_UniqueIdentifier;
    }
    return _cached_decoder_for_UniqueIdentifierOfBioParaInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_UniqueIdentifierOfBioParaInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_UniqueIdentifierOfBioParaInfo */
let _cached_encoder_for_UniqueIdentifierOfBioParaInfo: $.ASN1Encoder<UniqueIdentifierOfBioParaInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_UniqueIdentifierOfBioParaInfo */

/* START_OF_SYMBOL_DEFINITION _encode_UniqueIdentifierOfBioParaInfo */
/**
 * @summary Encodes a(n) UniqueIdentifierOfBioParaInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The UniqueIdentifierOfBioParaInfo, encoded as an ASN.1 Element.
 */
export function _encode_UniqueIdentifierOfBioParaInfo(
    value: UniqueIdentifierOfBioParaInfo,
    elGetter: $.ASN1Encoder<UniqueIdentifierOfBioParaInfo>
) {
    if (!_cached_encoder_for_UniqueIdentifierOfBioParaInfo) {
        _cached_encoder_for_UniqueIdentifierOfBioParaInfo =
            _encode_UniqueIdentifier;
    }
    return _cached_encoder_for_UniqueIdentifierOfBioParaInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_UniqueIdentifierOfBioParaInfo */

/* eslint-enable */
