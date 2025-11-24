/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiContactNameForm } from '../UDDI-Schema/uddiContactNameForm.oa';


/* START_OF_SYMBOL_DEFINITION uddiContactStructureRule */
/**
 * @summary uddiContactStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiContactStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiContactNameForm
 *     SUPERIOR RULES  {1}
 *     ID              2
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiContactStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiContactNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 2 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiContactStructureRule */

/* eslint-enable */
