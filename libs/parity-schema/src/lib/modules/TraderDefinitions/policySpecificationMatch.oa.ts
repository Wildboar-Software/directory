/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import { id_trader_mr_policySpecificationMatch } from '../TraderDefinitions/id-trader-mr-policySpecificationMatch.va';
import {
    PolicySpecification,
    _decode_PolicySpecification,
    _encode_PolicySpecification,
} from '../TraderDefinitions/PolicySpecification.ta';

/* START_OF_SYMBOL_DEFINITION policySpecificationMatch */
/**
 * @summary policySpecificationMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * policySpecificationMatch MATCHING-RULE ::= {
 *   SYNTAX  PolicySpecification
 *   ID      id-trader-mr-policySpecificationMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<PolicySpecification>}
 * @implements {MATCHING_RULE<PolicySpecification>}
 */
export const policySpecificationMatch: MATCHING_RULE<PolicySpecification> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_PolicySpecification,
    },
    encoderFor: {
        '&AssertionType': _encode_PolicySpecification,
    },
    '&id': id_trader_mr_policySpecificationMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION policySpecificationMatch */

/* eslint-enable */
