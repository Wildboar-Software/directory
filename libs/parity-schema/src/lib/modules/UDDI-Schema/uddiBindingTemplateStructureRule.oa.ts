/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uddiBindingTemplateNameForm } from '../UDDI-Schema/uddiBindingTemplateNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uddiBindingTemplateNameForm } from '../UDDI-Schema/uddiBindingTemplateNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiBindingTemplateStructureRule */
/**
 * @summary uddiBindingTemplateStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBindingTemplateStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiBindingTemplateNameForm
 *     SUPERIOR RULES  {4}
 *     ID              5
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiBindingTemplateStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiBindingTemplateNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 5 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBindingTemplateStructureRule */

/* eslint-enable */
