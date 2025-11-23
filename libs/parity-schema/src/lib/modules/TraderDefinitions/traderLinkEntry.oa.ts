/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { defPassOnFollowRule } from '../TraderDefinitions/defPassOnFollowRule.oa';
import { id_trader_oc_traderLink } from '../TraderDefinitions/id-trader-oc-traderLink.va';
import { limitingFollowRule } from '../TraderDefinitions/limitingFollowRule.oa';
import { linkId } from '../TraderDefinitions/linkId.oa';
import { linkName } from '../TraderDefinitions/linkName.oa';
import { targetTraderInterfaceId } from '../TraderDefinitions/targetTraderInterfaceId.oa';
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
export { defPassOnFollowRule } from '../TraderDefinitions/defPassOnFollowRule.oa';
export { id_trader_oc_traderLink } from '../TraderDefinitions/id-trader-oc-traderLink.va';
export { limitingFollowRule } from '../TraderDefinitions/limitingFollowRule.oa';
export { linkId } from '../TraderDefinitions/linkId.oa';
export { linkName } from '../TraderDefinitions/linkName.oa';
export { targetTraderInterfaceId } from '../TraderDefinitions/targetTraderInterfaceId.oa';

/* START_OF_SYMBOL_DEFINITION traderLinkEntry */
/**
 * @summary traderLinkEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * traderLinkEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {linkName | linkId | targetTraderInterfaceId | defPassOnFollowRule |
 *       limitingFollowRule}
 *   ID            id-trader-oc-traderLink
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const traderLinkEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        linkName,
        linkId,
        targetTraderInterfaceId,
        defPassOnFollowRule,
        limitingFollowRule,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_traderLink /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderLinkEntry */

/* eslint-enable */
