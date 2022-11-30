/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uddiv3EntityObituaryNameForm } from '../UDDI-Schema/uddiv3EntityObituaryNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uddiv3EntityObituaryNameForm } from '../UDDI-Schema/uddiv3EntityObituaryNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiv3EntityObituaryStructureRule */
/**
 * @summary uddiv3EntityObituaryStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3EntityObituaryStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiv3EntityObituaryNameForm
 *     ID              10
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiv3EntityObituaryStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiv3EntityObituaryNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 10 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3EntityObituaryStructureRule */

/* eslint-enable */
