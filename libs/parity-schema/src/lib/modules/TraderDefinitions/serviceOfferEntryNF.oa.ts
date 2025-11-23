/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { id_trader_nf_serviceOffer } from '../TraderDefinitions/id-trader-nf-serviceOffer.va';
import { serviceOfferEntry } from '../TraderDefinitions/serviceOfferEntry.oa';
import { sOfferId } from '../TraderDefinitions/sOfferId.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_trader_nf_serviceOffer } from '../TraderDefinitions/id-trader-nf-serviceOffer.va';
export { serviceOfferEntry } from '../TraderDefinitions/serviceOfferEntry.oa';
export { sOfferId } from '../TraderDefinitions/sOfferId.oa';

/* START_OF_SYMBOL_DEFINITION serviceOfferEntryNF */
/**
 * @summary serviceOfferEntryNF
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * serviceOfferEntryNF NAME-FORM ::= {
 *   NAMES            serviceOfferEntry
 *   WITH ATTRIBUTES  {sOfferId}
 *   ID               id-trader-nf-serviceOffer
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const serviceOfferEntryNF: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': serviceOfferEntry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sOfferId] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_nf_serviceOffer /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION serviceOfferEntryNF */

/* eslint-enable */
