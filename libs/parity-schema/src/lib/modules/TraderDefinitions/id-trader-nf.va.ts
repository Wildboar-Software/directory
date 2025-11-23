/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader } from '../TraderDefinitions/id-trader.va';
export { id_trader } from '../TraderDefinitions/id-trader.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf */
/**
 * @summary id_trader_nf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf OBJECT IDENTIFIER ::= {id-trader 15}
 * ```
 *
 * @constant
 */
export const id_trader_nf: OBJECT_IDENTIFIER = _OID.fromParts([15], id_trader);
/* END_OF_SYMBOL_DEFINITION id_trader_nf */

/* eslint-enable */
