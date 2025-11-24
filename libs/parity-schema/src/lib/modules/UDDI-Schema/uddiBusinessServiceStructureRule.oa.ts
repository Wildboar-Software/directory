/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiBusinessServiceNameForm } from '../UDDI-Schema/uddiBusinessServiceNameForm.oa';


/* START_OF_SYMBOL_DEFINITION uddiBusinessServiceStructureRule */
/**
 * @summary uddiBusinessServiceStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessServiceStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiBusinessServiceNameForm
 *     SUPERIOR RULES  {1}
 *     ID              4
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiBusinessServiceStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiBusinessServiceNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 4 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessServiceStructureRule */

/* eslint-enable */
