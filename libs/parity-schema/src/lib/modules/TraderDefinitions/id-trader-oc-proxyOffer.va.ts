/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';
export { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc_proxyOffer */
/**
 * @summary id_trader_oc_proxyOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc-proxyOffer OBJECT IDENTIFIER ::= {id-trader-oc 2}
 * ```
 *
 * @constant
 */
export const id_trader_oc_proxyOffer: OBJECT_IDENTIFIER = new _OID(
    [2],
    id_trader_oc
);
/* END_OF_SYMBOL_DEFINITION id_trader_oc_proxyOffer */

/* eslint-enable */
