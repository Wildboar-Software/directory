/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';
export { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf_serviceOffer */
/**
 * @summary id_trader_nf_serviceOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf-serviceOffer OBJECT IDENTIFIER ::= {id-trader-nf 1}
 * ```
 *
 * @constant
 */
export const id_trader_nf_serviceOffer: OBJECT_IDENTIFIER = new _OID(
    [1],
    id_trader_nf
);
/* END_OF_SYMBOL_DEFINITION id_trader_nf_serviceOffer */

/* eslint-enable */
