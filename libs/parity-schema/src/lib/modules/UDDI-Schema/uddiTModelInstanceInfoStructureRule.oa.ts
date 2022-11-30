/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uddiTModelInstanceInfoNameForm } from '../UDDI-Schema/uddiTModelInstanceInfoNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uddiTModelInstanceInfoNameForm } from '../UDDI-Schema/uddiTModelInstanceInfoNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiTModelInstanceInfoStructureRule */
/**
 * @summary uddiTModelInstanceInfoStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiTModelInstanceInfoStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiTModelInstanceInfoNameForm
 *     SUPERIOR RULES  {5}
 *     ID              6
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiTModelInstanceInfoStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiTModelInstanceInfoNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 6 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModelInstanceInfoStructureRule */

/* eslint-enable */
