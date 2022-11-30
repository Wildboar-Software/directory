/* eslint-disable */
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
import {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/DirectoryString.ta';
import { ASN1Element as _Element, ASN1TagClass as _TagClass } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
export {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/DirectoryString.ta';
export { ub_policy_string_rule } from '../TraderDefinitions/ub-policy-string-rule.va';

/* START_OF_SYMBOL_DEFINITION PolicySpecification */
/**
 * @summary PolicySpecification
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PolicySpecification  ::=  CHOICE {
 *   stringRule      [0]  DirectoryString{ub-policy-string-rule},
 *   policyObjectId  [1]  DistinguishedName
 * }
 * ```
 */
export type PolicySpecification =
    | { stringRule: DirectoryString } /* CHOICE_ALT_ROOT */
    | { policyObjectId: DistinguishedName } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION PolicySpecification */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PolicySpecification */
let _cached_decoder_for_PolicySpecification: $.ASN1Decoder<PolicySpecification> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PolicySpecification */

/* START_OF_SYMBOL_DEFINITION _decode_PolicySpecification */
/**
 * @summary Decodes an ASN.1 element into a(n) PolicySpecification
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PolicySpecification} The decoded data structure.
 */
export function _decode_PolicySpecification(el: _Element) {
    if (!_cached_decoder_for_PolicySpecification) {
        _cached_decoder_for_PolicySpecification =
            $._decode_inextensible_choice<PolicySpecification>({
                'CONTEXT 0': [
                    'stringRule',
                    $._decode_explicit<DirectoryString>(
                        () => _decode_DirectoryString
                    ),
                ],
                'CONTEXT 1': [
                    'policyObjectId',
                    $._decode_implicit<DistinguishedName>(
                        () => _decode_DistinguishedName
                    ),
                ],
            });
    }
    return _cached_decoder_for_PolicySpecification(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PolicySpecification */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PolicySpecification */
let _cached_encoder_for_PolicySpecification: $.ASN1Encoder<PolicySpecification> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PolicySpecification */

/* START_OF_SYMBOL_DEFINITION _encode_PolicySpecification */
/**
 * @summary Encodes a(n) PolicySpecification into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PolicySpecification, encoded as an ASN.1 Element.
 */
export function _encode_PolicySpecification(
    value: PolicySpecification,
    elGetter: $.ASN1Encoder<PolicySpecification>
) {
    if (!_cached_encoder_for_PolicySpecification) {
        _cached_encoder_for_PolicySpecification =
            $._encode_choice<PolicySpecification>(
                {
                    stringRule: $._encode_explicit(
                        _TagClass.context,
                        0,
                        () => _encode_DirectoryString,
                        $.BER
                    ),
                    policyObjectId: $._encode_implicit(
                        _TagClass.context,
                        1,
                        () => _encode_DistinguishedName,
                        $.BER
                    ),
                },
                $.BER
            );
    }
    return _cached_encoder_for_PolicySpecification(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PolicySpecification */

/* eslint-enable */
