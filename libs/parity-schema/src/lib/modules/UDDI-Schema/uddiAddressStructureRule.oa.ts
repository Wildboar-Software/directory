/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiAddressNameForm } from '../UDDI-Schema/uddiAddressNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
export { uddiAddressNameForm } from '../UDDI-Schema/uddiAddressNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiAddressStructureRule */
/**
 * @summary uddiAddressStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiAddressStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiAddressNameForm
 *     SUPERIOR RULES  {2}
 *     ID              3
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiAddressStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiAddressNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 3 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiAddressStructureRule */

/* eslint-enable */
