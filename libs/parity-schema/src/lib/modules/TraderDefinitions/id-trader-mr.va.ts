/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader } from '../TraderDefinitions/id-trader.va';
export { id_trader } from '../TraderDefinitions/id-trader.va';

/* START_OF_SYMBOL_DEFINITION id_trader_mr */
/**
 * @summary id_trader_mr
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-mr OBJECT IDENTIFIER ::= {id-trader 13}
 * ```
 *
 * @constant
 */
export const id_trader_mr: OBJECT_IDENTIFIER = _OID.fromParts([13], id_trader);
/* END_OF_SYMBOL_DEFINITION id_trader_mr */

/* eslint-enable */
