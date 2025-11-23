/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { constraintRecipe } from '../TraderDefinitions/constraintRecipe.oa';
import { dynamicProps } from '../TraderDefinitions/dynamicProps.oa';
import { hasDynamicProperties } from '../TraderDefinitions/hasDynamicProperties.oa';
import { hasModifiableProperties } from '../TraderDefinitions/hasModifiableProperties.oa';
import { id_trader_oc_proxyOffer } from '../TraderDefinitions/id-trader-oc-proxyOffer.va';
import { ifMatchAll } from '../TraderDefinitions/ifMatchAll.oa';
import { proxyLookUpInterfaceId } from '../TraderDefinitions/proxyLookUpInterfaceId.oa';
import { proxyOfferId } from '../TraderDefinitions/proxyOfferId.oa';
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
export { constraintRecipe } from '../TraderDefinitions/constraintRecipe.oa';
export { dynamicProps } from '../TraderDefinitions/dynamicProps.oa';
export { hasDynamicProperties } from '../TraderDefinitions/hasDynamicProperties.oa';
export { hasModifiableProperties } from '../TraderDefinitions/hasModifiableProperties.oa';
export { id_trader_oc_proxyOffer } from '../TraderDefinitions/id-trader-oc-proxyOffer.va';
export { ifMatchAll } from '../TraderDefinitions/ifMatchAll.oa';
export { proxyLookUpInterfaceId } from '../TraderDefinitions/proxyLookUpInterfaceId.oa';
export { proxyOfferId } from '../TraderDefinitions/proxyOfferId.oa';

/* START_OF_SYMBOL_DEFINITION proxyOfferEntry */
/**
 * @summary proxyOfferEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * proxyOfferEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {proxyOfferId | proxyLookUpInterfaceId | hasDynamicProperties |
 *       hasModifiableProperties | ifMatchAll | constraintRecipe}
 *   MAY CONTAIN   {dynamicProps}
 *   ID            id-trader-oc-proxyOffer
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const proxyOfferEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        proxyOfferId,
        proxyLookUpInterfaceId,
        hasDynamicProperties,
        hasModifiableProperties,
        ifMatchAll,
        constraintRecipe,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [dynamicProps] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_proxyOffer /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION proxyOfferEntry */

/* eslint-enable */
