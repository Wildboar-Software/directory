/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uptProviderNameForm } from '../UPT-DataModel/uptProviderNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uptProviderNameForm } from '../UPT-DataModel/uptProviderNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr1 */
/**
 * @summary sr1
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr1 STRUCTURE-RULE ::= {
 *   NAME FORM       uptProviderNameForm
 *   SUPERIOR RULES  {sr0}
 *   ID              1
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr1: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uptProviderNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 1 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr1 */

/* eslint-enable */
