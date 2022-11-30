/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';
export { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_defHopCount */
/**
 * @summary id_trader_at_defHopCount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-defHopCount OBJECT IDENTIFIER ::= {id-trader-at 12}
 * ```
 *
 * @constant
 */
export const id_trader_at_defHopCount: OBJECT_IDENTIFIER = new _OID(
    [12],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_defHopCount */

/* eslint-enable */
