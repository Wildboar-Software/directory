/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';
export { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_maxHopCount */
/**
 * @summary id_trader_at_maxHopCount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-maxHopCount OBJECT IDENTIFIER ::= {id-trader-at 13}
 * ```
 *
 * @constant
 */
export const id_trader_at_maxHopCount: OBJECT_IDENTIFIER = new _OID(
    [13],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_maxHopCount */

/* eslint-enable */
