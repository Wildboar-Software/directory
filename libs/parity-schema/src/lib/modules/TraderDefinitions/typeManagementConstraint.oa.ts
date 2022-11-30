/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_trader_at_typeManagementConstraint } from '../TraderDefinitions/id-trader-at-typeManagementConstraint.va';
import {
    PolicySpecification,
    _decode_PolicySpecification,
    _encode_PolicySpecification,
} from '../TraderDefinitions/PolicySpecification.ta';
import { policySpecificationMatch } from '../TraderDefinitions/policySpecificationMatch.oa';

/* START_OF_SYMBOL_DEFINITION typeManagementConstraint */
/**
 * @summary typeManagementConstraint
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * typeManagementConstraint ATTRIBUTE ::= {
 *   WITH SYNTAX             PolicySpecification
 *   EQUALITY MATCHING RULE  policySpecificationMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-trader-at-typeManagementConstraint
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PolicySpecification>}
 * @implements {ATTRIBUTE<PolicySpecification>}
 */
export const typeManagementConstraint: ATTRIBUTE<PolicySpecification> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_PolicySpecification,
    },
    encoderFor: {
        '&Type': _encode_PolicySpecification,
    },
    '&equality-match': policySpecificationMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_typeManagementConstraint /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION typeManagementConstraint */

/* eslint-enable */
