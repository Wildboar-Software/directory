/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';
export { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_traderInterface */
/**
 * @summary id_trader_at_traderInterface
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-traderInterface OBJECT IDENTIFIER ::= {id-trader-at 0}
 * ```
 *
 * @constant
 */
export const id_trader_at_traderInterface: OBJECT_IDENTIFIER = new _OID(
    [0],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_traderInterface */

/* eslint-enable */
