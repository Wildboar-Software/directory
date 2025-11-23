/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { id_trader_nf_proxyOffer } from '../TraderDefinitions/id-trader-nf-proxyOffer.va';
import { proxyOfferEntry } from '../TraderDefinitions/proxyOfferEntry.oa';
import { proxyOfferId } from '../TraderDefinitions/proxyOfferId.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_trader_nf_proxyOffer } from '../TraderDefinitions/id-trader-nf-proxyOffer.va';
export { proxyOfferEntry } from '../TraderDefinitions/proxyOfferEntry.oa';
export { proxyOfferId } from '../TraderDefinitions/proxyOfferId.oa';

/* START_OF_SYMBOL_DEFINITION proxyOfferEntryNF */
/**
 * @summary proxyOfferEntryNF
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * proxyOfferEntryNF NAME-FORM ::= {
 *   NAMES            proxyOfferEntry
 *   WITH ATTRIBUTES  {proxyOfferId}
 *   ID               id-trader-nf-proxyOffer
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const proxyOfferEntryNF: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': proxyOfferEntry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [proxyOfferId] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_nf_proxyOffer /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION proxyOfferEntryNF */

/* eslint-enable */
