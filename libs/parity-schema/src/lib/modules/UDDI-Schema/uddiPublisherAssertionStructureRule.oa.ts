/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
import { uddiPublisherAssertionNameForm } from '../UDDI-Schema/uddiPublisherAssertionNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta';
export { STRUCTURE_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca';
export { uddiPublisherAssertionNameForm } from '../UDDI-Schema/uddiPublisherAssertionNameForm.oa';

/* START_OF_SYMBOL_DEFINITION uddiPublisherAssertionStructureRule */
/**
 * @summary uddiPublisherAssertionStructureRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiPublisherAssertionStructureRule STRUCTURE-RULE ::= {
 *     NAME FORM       uddiPublisherAssertionNameForm
 *     ID              8
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const uddiPublisherAssertionStructureRule: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': uddiPublisherAssertionNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 8 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiPublisherAssertionStructureRule */

/* eslint-enable */
