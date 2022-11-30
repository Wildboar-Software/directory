/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { callForwardingNameForm } from '../UPT-DataModel/callForwardingNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { callForwardingNameForm } from '../UPT-DataModel/callForwardingNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr9 */
/**
 * @summary sr9
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr9 STRUCTURE-RULE ::= {
 *   NAME FORM       callForwardingNameForm
 *   SUPERIOR RULES  {sr7}
 *   ID              9
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr9: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': callForwardingNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 9 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr9 */

/* eslint-enable */
