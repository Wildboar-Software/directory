/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { uddiPublisherAssertionNameForm } from '../UDDI-Schema/uddiPublisherAssertionNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
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
