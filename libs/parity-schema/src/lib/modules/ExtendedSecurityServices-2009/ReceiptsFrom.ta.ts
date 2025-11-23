/* eslint-disable */
import {
    GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/CertificateExtensions';
import { ASN1Element as _Element, ASN1TagClass as _TagClass } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    AllOrFirstTier,
    _decode_AllOrFirstTier,
    _encode_AllOrFirstTier,
} from '../ExtendedSecurityServices-2009/AllOrFirstTier.ta';

/* START_OF_SYMBOL_DEFINITION ReceiptsFrom */
/**
 * @summary ReceiptsFrom
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ReceiptsFrom  ::=  CHOICE {
 *     allOrFirstTier [0] AllOrFirstTier,
 *         -- formerly "allOrNone [0]AllOrNone"
 *     receiptList [1] SEQUENCE OF GeneralNames }
 * ```
 */
export type ReceiptsFrom =
    | { allOrFirstTier: AllOrFirstTier } /* CHOICE_ALT_ROOT */
    | { receiptList: GeneralNames[] } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptsFrom */
let _cached_decoder_for_ReceiptsFrom: $.ASN1Decoder<ReceiptsFrom> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _decode_ReceiptsFrom */
/**
 * @summary Decodes an ASN.1 element into a(n) ReceiptsFrom
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ReceiptsFrom} The decoded data structure.
 */
export function _decode_ReceiptsFrom(el: _Element) {
    if (!_cached_decoder_for_ReceiptsFrom) {
        _cached_decoder_for_ReceiptsFrom =
            $._decode_inextensible_choice<ReceiptsFrom>({
                'CONTEXT 0': [
                    'allOrFirstTier',
                    $._decode_implicit<AllOrFirstTier>(
                        () => _decode_AllOrFirstTier
                    ),
                ],
                'CONTEXT 1': [
                    'receiptList',
                    $._decode_implicit<GeneralNames[]>(() =>
                        $._decodeSequenceOf<GeneralNames>(
                            () => _decode_GeneralNames
                        )
                    ),
                ],
            });
    }
    return _cached_decoder_for_ReceiptsFrom(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptsFrom */
let _cached_encoder_for_ReceiptsFrom: $.ASN1Encoder<ReceiptsFrom> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _encode_ReceiptsFrom */
/**
 * @summary Encodes a(n) ReceiptsFrom into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ReceiptsFrom, encoded as an ASN.1 Element.
 */
export function _encode_ReceiptsFrom(
    value: ReceiptsFrom,
    elGetter: $.ASN1Encoder<ReceiptsFrom>
) {
    if (!_cached_encoder_for_ReceiptsFrom) {
        _cached_encoder_for_ReceiptsFrom = $._encode_choice<ReceiptsFrom>(
            {
                allOrFirstTier: $._encode_implicit(
                    _TagClass.context,
                    0,
                    () => _encode_AllOrFirstTier,
                    $.BER
                ),
                receiptList: $._encode_implicit(
                    _TagClass.context,
                    1,
                    () =>
                        $._encodeSequenceOf<GeneralNames>(
                            () => _encode_GeneralNames,
                            $.BER
                        ),
                    $.BER
                ),
            },
            $.BER
        );
    }
    return _cached_encoder_for_ReceiptsFrom(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ReceiptsFrom */

/* eslint-enable */
