/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';
export { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc_traderLink */
/**
 * @summary id_trader_oc_traderLink
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc-traderLink OBJECT IDENTIFIER ::= {id-trader-oc 3}
 * ```
 *
 * @constant
 */
export const id_trader_oc_traderLink: OBJECT_IDENTIFIER = new _OID(
    [3],
    id_trader_oc
);
/* END_OF_SYMBOL_DEFINITION id_trader_oc_traderLink */

/* eslint-enable */
