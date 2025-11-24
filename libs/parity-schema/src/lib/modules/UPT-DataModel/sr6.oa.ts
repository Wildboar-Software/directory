/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { agreedServiceNameForm } from '../UPT-DataModel/agreedServiceNameForm.oa';


/* START_OF_SYMBOL_DEFINITION sr6 */
/**
 * @summary sr6
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr6 STRUCTURE-RULE ::= {
 *   NAME FORM       agreedServiceNameForm
 *   SUPERIOR RULES  {sr3}
 *   ID              6
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr6: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': agreedServiceNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 6 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr6 */

/* eslint-enable */
