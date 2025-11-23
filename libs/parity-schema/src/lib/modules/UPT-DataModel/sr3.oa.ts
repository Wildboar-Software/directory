/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { partnerNameForm } from '../UPT-DataModel/partnerNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
export { partnerNameForm } from '../UPT-DataModel/partnerNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr3 */
/**
 * @summary sr3
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr3 STRUCTURE-RULE ::= {
 *   NAME FORM       partnerNameForm
 *   SUPERIOR RULES  {sr1}
 *   ID              3
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr3: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': partnerNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 3 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr3 */

/* eslint-enable */
