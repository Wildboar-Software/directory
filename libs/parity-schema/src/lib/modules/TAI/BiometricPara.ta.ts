/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricPara_Item,
    _decode_BiometricPara_Item,
    _encode_BiometricPara_Item,
} from '../TAI/BiometricPara-Item.ta';
export {
    BiometricPara_Item,
    _decode_BiometricPara_Item,
    _encode_BiometricPara_Item,
} from '../TAI/BiometricPara-Item.ta';

/* START_OF_SYMBOL_DEFINITION BiometricPara */
/**
 * @summary BiometricPara
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricPara  ::=
 *   SEQUENCE OF
 *     SEQUENCE {biometricType   BIT STRING,
 *               --CBEFF defined type
 *               fMR-Value       INTEGER(-2147483648..2147483647),
 *               trialNumber     INTEGER OPTIONAL,
 *               requestQuality  INTEGER OPTIONAL,
 *               ...}
 * ```
 */
export type BiometricPara = BiometricPara_Item[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION BiometricPara */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara */
let _cached_decoder_for_BiometricPara: $.ASN1Decoder<BiometricPara> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPara */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPara
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPara} The decoded data structure.
 */
export function _decode_BiometricPara(el: _Element) {
    if (!_cached_decoder_for_BiometricPara) {
        _cached_decoder_for_BiometricPara =
            $._decodeSequenceOf<BiometricPara_Item>(
                () => _decode_BiometricPara_Item
            );
    }
    return _cached_decoder_for_BiometricPara(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara */
let _cached_encoder_for_BiometricPara: $.ASN1Encoder<BiometricPara> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPara */
/**
 * @summary Encodes a(n) BiometricPara into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPara, encoded as an ASN.1 Element.
 */
export function _encode_BiometricPara(
    value: BiometricPara,
    elGetter: $.ASN1Encoder<BiometricPara>
) {
    if (!_cached_encoder_for_BiometricPara) {
        _cached_encoder_for_BiometricPara =
            $._encodeSequenceOf<BiometricPara_Item>(
                () => _encode_BiometricPara_Item,
                $.BER
            );
    }
    return _cached_encoder_for_BiometricPara(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPara */

/* eslint-enable */
