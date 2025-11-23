/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { callingUptUserNameForm } from '../UPT-DataModel/callingUptUserNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
export { callingUptUserNameForm } from '../UPT-DataModel/callingUptUserNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr8 */
/**
 * @summary sr8
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr8 STRUCTURE-RULE ::= {
 *   NAME FORM       callingUptUserNameForm
 *   SUPERIOR RULES  {sr4}
 *   ID              8
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr8: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': callingUptUserNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 8 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr8 */

/* eslint-enable */
