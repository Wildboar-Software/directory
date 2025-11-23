/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { id_trader_oc_traderPolicy } from '../TraderDefinitions/id-trader-oc-traderPolicy.va';
import { offerAcceptanceConstraint } from '../TraderDefinitions/offerAcceptanceConstraint.oa';
import { searchConstraint } from '../TraderDefinitions/searchConstraint.oa';
import { typeManagementConstraint } from '../TraderDefinitions/typeManagementConstraint.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { id_trader_oc_traderPolicy } from '../TraderDefinitions/id-trader-oc-traderPolicy.va';
export { offerAcceptanceConstraint } from '../TraderDefinitions/offerAcceptanceConstraint.oa';
export { searchConstraint } from '../TraderDefinitions/searchConstraint.oa';
export { typeManagementConstraint } from '../TraderDefinitions/typeManagementConstraint.oa';

/* START_OF_SYMBOL_DEFINITION traderPolicyEntry */
/**
 * @summary traderPolicyEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * traderPolicyEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN  {commonName}
 *   MAY CONTAIN
 *     {typeManagementConstraint | searchConstraint | offerAcceptanceConstraint}
 *   ID            id-trader-oc-traderPolicy
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const traderPolicyEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        typeManagementConstraint,
        searchConstraint,
        offerAcceptanceConstraint,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_traderPolicy /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderPolicyEntry */

/* eslint-enable */
