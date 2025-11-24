/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { userProfileNameForm } from '../UPT-DataModel/userProfileNameForm.oa';


/* START_OF_SYMBOL_DEFINITION sr4 */
/**
 * @summary sr4
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr4 STRUCTURE-RULE ::= {
 *   NAME FORM       userProfileNameForm
 *   SUPERIOR RULES  {sr2}
 *   ID              4
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr4: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': userProfileNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 4 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr4 */

/* eslint-enable */
