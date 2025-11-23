/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { id_trader_nf_traderLink } from '../TraderDefinitions/id-trader-nf-traderLink.va';
import { linkId } from '../TraderDefinitions/linkId.oa';
import { traderLinkEntry } from '../TraderDefinitions/traderLinkEntry.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_trader_nf_traderLink } from '../TraderDefinitions/id-trader-nf-traderLink.va';
export { linkId } from '../TraderDefinitions/linkId.oa';
export { traderLinkEntry } from '../TraderDefinitions/traderLinkEntry.oa';

/* START_OF_SYMBOL_DEFINITION traderLinkEntryNF */
/**
 * @summary traderLinkEntryNF
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * traderLinkEntryNF NAME-FORM ::= {
 *   NAMES            traderLinkEntry
 *   WITH ATTRIBUTES  {linkId}
 *   ID               id-trader-nf-traderLink
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const traderLinkEntryNF: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': traderLinkEntry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [linkId] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_nf_traderLink /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderLinkEntryNF */

/* eslint-enable */
