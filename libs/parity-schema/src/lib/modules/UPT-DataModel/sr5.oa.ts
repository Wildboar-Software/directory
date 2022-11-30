/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { userProfileAliasNameForm } from '../UPT-DataModel/userProfileAliasNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { userProfileAliasNameForm } from '../UPT-DataModel/userProfileAliasNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr5 */
/**
 * @summary sr5
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr5 STRUCTURE-RULE ::= {
 *   NAME FORM       userProfileAliasNameForm
 *   SUPERIOR RULES  {sr2}
 *   ID              5
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr5: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': userProfileAliasNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 5 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr5 */

/* eslint-enable */
