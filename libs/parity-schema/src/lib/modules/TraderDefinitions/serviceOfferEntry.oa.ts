/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { dynamicProps } from '../TraderDefinitions/dynamicProps.oa';
import { hasDynamicProperties } from '../TraderDefinitions/hasDynamicProperties.oa';
import { hasModifiableProperties } from '../TraderDefinitions/hasModifiableProperties.oa';
import { id_trader_oc_serviceOffer } from '../TraderDefinitions/id-trader-oc-serviceOffer.va';
import { serviceInterfaceId } from '../TraderDefinitions/serviceInterfaceId.oa';
import { serviceTypeId } from '../TraderDefinitions/serviceTypeId.oa';
import { sOfferId } from '../TraderDefinitions/sOfferId.oa';


/* START_OF_SYMBOL_DEFINITION serviceOfferEntry */
/**
 * @summary serviceOfferEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * serviceOfferEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {sOfferId | serviceInterfaceId | serviceTypeId | hasDynamicProperties |
 *       hasModifiableProperties}
 *   MAY CONTAIN   {dynamicProps}
 *   ID            id-trader-oc-serviceOffer
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const serviceOfferEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        sOfferId,
        serviceInterfaceId,
        serviceTypeId,
        hasDynamicProperties,
        hasModifiableProperties,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [dynamicProps] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_serviceOffer /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION serviceOfferEntry */

/* eslint-enable */
