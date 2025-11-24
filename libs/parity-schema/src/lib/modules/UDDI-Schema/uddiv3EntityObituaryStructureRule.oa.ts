/* eslint-disable */
import type { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiv3EntityObituaryNameForm } from '../UDDI-Schema/uddiv3EntityObituaryNameForm.oa';


/* START_OF_SYMBOL_DEFINITION uddiv3EntityObituaryStructureRule */
/**
 * @summary uddiv3EntityObituaryStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3EntityObituaryStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiv3EntityObituaryNameForm
 *     ID              10
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiv3EntityObituaryStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiv3EntityObituaryNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 10 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3EntityObituaryStructureRule */

/* eslint-enable */
