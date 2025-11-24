/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { calledUptUserNameForm } from '../UPT-DataModel/calledUptUserNameForm.oa';


/* START_OF_SYMBOL_DEFINITION sr7 */
/**
 * @summary sr7
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr7 STRUCTURE-RULE ::= {
 *   NAME FORM       calledUptUserNameForm
 *   SUPERIOR RULES  {sr4}
 *   ID              7
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr7: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': calledUptUserNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 7 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr7 */

/* eslint-enable */
