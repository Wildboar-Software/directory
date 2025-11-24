/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader } from '../TraderDefinitions/id-trader.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at */
/**
 * @summary id_trader_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at OBJECT IDENTIFIER ::= {id-trader 4}
 * ```
 *
 * @constant
 */
export const id_trader_at: OBJECT_IDENTIFIER = _OID.fromParts([4], id_trader);
/* END_OF_SYMBOL_DEFINITION id_trader_at */

/* eslint-enable */
