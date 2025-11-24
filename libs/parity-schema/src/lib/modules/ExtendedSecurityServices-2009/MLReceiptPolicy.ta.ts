/* eslint-disable */
import {
    type GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/CertificateExtensions';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    NULL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION MLReceiptPolicy */
/**
 * @summary MLReceiptPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MLReceiptPolicy  ::=  CHOICE {
 *     none         [0] NULL,
 *     insteadOf    [1] SEQUENCE SIZE (1..MAX) OF GeneralNames,
 *     inAdditionTo [2] SEQUENCE SIZE (1..MAX) OF GeneralNames }
 * ```
 */
export type MLReceiptPolicy =
    | { none: NULL } /* CHOICE_ALT_ROOT */
    | { insteadOf: GeneralNames[] } /* CHOICE_ALT_ROOT */
    | { inAdditionTo: GeneralNames[] } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MLReceiptPolicy */
let _cached_decoder_for_MLReceiptPolicy: $.ASN1Decoder<MLReceiptPolicy> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _decode_MLReceiptPolicy */
/**
 * @summary Decodes an ASN.1 element into a(n) MLReceiptPolicy
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MLReceiptPolicy} The decoded data structure.
 */
export function _decode_MLReceiptPolicy(el: _Element) {
    if (!_cached_decoder_for_MLReceiptPolicy) {
        _cached_decoder_for_MLReceiptPolicy =
            $._decode_inextensible_choice<MLReceiptPolicy>({
                'CONTEXT 0': [
                    'none',
                    $._decode_implicit<NULL>(() => $._decodeNull),
                ],
                'CONTEXT 1': [
                    'insteadOf',
                    $._decode_implicit<GeneralNames[]>(() =>
                        $._decodeSequenceOf<GeneralNames>(
                            () => _decode_GeneralNames
                        )
                    ),
                ],
                'CONTEXT 2': [
                    'inAdditionTo',
                    $._decode_implicit<GeneralNames[]>(() =>
                        $._decodeSequenceOf<GeneralNames>(
                            () => _decode_GeneralNames
                        )
                    ),
                ],
            });
    }
    return _cached_decoder_for_MLReceiptPolicy(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MLReceiptPolicy */
let _cached_encoder_for_MLReceiptPolicy: $.ASN1Encoder<MLReceiptPolicy> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _encode_MLReceiptPolicy */
/**
 * @summary Encodes a(n) MLReceiptPolicy into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MLReceiptPolicy, encoded as an ASN.1 Element.
 */
export function _encode_MLReceiptPolicy(
    value: MLReceiptPolicy,
    elGetter: $.ASN1Encoder<MLReceiptPolicy>
) {
    if (!_cached_encoder_for_MLReceiptPolicy) {
        _cached_encoder_for_MLReceiptPolicy = $._encode_choice<MLReceiptPolicy>(
            {
                none: $._encode_implicit(
                    _TagClass.context,
                    0,
                    () => $._encodeNull,
                    $.BER
                ),
                insteadOf: $._encode_implicit(
                    _TagClass.context,
                    1,
                    () =>
                        $._encodeSequenceOf<GeneralNames>(
                            () => _encode_GeneralNames,
                            $.BER
                        ),
                    $.BER
                ),
                inAdditionTo: $._encode_implicit(
                    _TagClass.context,
                    2,
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
    return _cached_encoder_for_MLReceiptPolicy(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MLReceiptPolicy */

/* eslint-enable */
