/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uddiv3SubscriptionNameForm } from '../UDDI-Schema/uddiv3SubscriptionNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uddiv3SubscriptionNameForm } from '../UDDI-Schema/uddiv3SubscriptionNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiv3SubscriptionStructureRule */
/**
 * @summary uddiv3SubscriptionStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3SubscriptionStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiv3SubscriptionNameForm
 *     ID              9
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiv3SubscriptionStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiv3SubscriptionNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 9 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3SubscriptionStructureRule */

/* eslint-enable */
