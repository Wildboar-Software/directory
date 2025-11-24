/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiBusinessEntityNameForm } from '../UDDI-Schema/uddiBusinessEntityNameForm.oa';


/* START_OF_SYMBOL_DEFINITION uddiBusinessEntityStructureRule */
/**
 * @summary uddiBusinessEntityStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessEntityStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiBusinessEntityNameForm
 *     ID              1
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiBusinessEntityStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiBusinessEntityNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 1 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessEntityStructureRule */

/* eslint-enable */
