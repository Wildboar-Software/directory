/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader } from '../TraderDefinitions/id-trader.va';
export { id_trader } from '../TraderDefinitions/id-trader.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc */
/**
 * @summary id_trader_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc OBJECT IDENTIFIER ::= {id-trader 6}
 * ```
 *
 * @constant
 */
export const id_trader_oc: OBJECT_IDENTIFIER = new _OID([6], id_trader);
/* END_OF_SYMBOL_DEFINITION id_trader_oc */

/* eslint-enable */
