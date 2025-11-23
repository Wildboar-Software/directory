/* eslint-disable */
import { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
import { adminUnitNameForm } from '../UPT-DataModel/adminUnitNameForm.oa';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export {
    RuleIdentifier,
    _decode_RuleIdentifier,
    _encode_RuleIdentifier,
} from '@wildboar/x500/InformationFramework';
export { STRUCTURE_RULE } from '@wildboar/x500/InformationFramework';
export { adminUnitNameForm } from '../UPT-DataModel/adminUnitNameForm.oa';

/* START_OF_SYMBOL_DEFINITION sr2 */
/**
 * @summary sr2
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sr2 STRUCTURE-RULE ::= {
 *   NAME FORM       adminUnitNameForm
 *   SUPERIOR RULES  {sr1}
 *   ID              2
 * }
 * ```
 *
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export const sr2: STRUCTURE_RULE = {
    class: 'STRUCTURE-RULE',
    decoderFor: {},
    encoderFor: {},
    '&nameForm': adminUnitNameForm /* OBJECT_FIELD_SETTING */,
    '&id': 2 /* OBJECT_FIELD_SETTING */,
    '&SuperiorStructureRules':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr2 */

/* eslint-enable */
