/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { id_trader_nf_traderPolicy } from '../TraderDefinitions/id-trader-nf-traderPolicy.va';
import { traderPolicyEntry } from '../TraderDefinitions/traderPolicyEntry.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { id_trader_nf_traderPolicy } from '../TraderDefinitions/id-trader-nf-traderPolicy.va';
export { traderPolicyEntry } from '../TraderDefinitions/traderPolicyEntry.oa';

/* START_OF_SYMBOL_DEFINITION traderPolicyEntryNF */
/**
 * @summary traderPolicyEntryNF
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * traderPolicyEntryNF NAME-FORM ::= {
 *   NAMES            traderPolicyEntry
 *   WITH ATTRIBUTES  {commonName}
 *   ID               id-trader-nf-traderPolicy
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const traderPolicyEntryNF: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': traderPolicyEntry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_nf_traderPolicy /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderPolicyEntryNF */

/* eslint-enable */
