/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { countryNameForm } from '@wildboar/x500/SelectedObjectClasses';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
export { countryNameForm } from '@wildboar/x500/SelectedObjectClasses';

/* START_OF_SYMBOL_DEFINITION sr0 */
/**
 * @summary sr0
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr0 STRUCTURE-RULE ::= {NAME FORM  countryNameForm
 *                         ID         0
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr0: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': countryNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 0 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr0 */

/* eslint-enable */
