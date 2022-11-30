/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';
export { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf_traderLink */
/**
 * @summary id_trader_nf_traderLink
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf-traderLink OBJECT IDENTIFIER ::= {id-trader-nf 2}
 * ```
 *
 * @constant
 */
export const id_trader_nf_traderLink: OBJECT_IDENTIFIER = new _OID(
    [2],
    id_trader_nf
);
/* END_OF_SYMBOL_DEFINITION id_trader_nf_traderLink */

/* eslint-enable */
