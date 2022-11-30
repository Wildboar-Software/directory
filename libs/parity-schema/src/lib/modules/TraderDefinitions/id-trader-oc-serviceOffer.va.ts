/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';
export { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc_serviceOffer */
/**
 * @summary id_trader_oc_serviceOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc-serviceOffer OBJECT IDENTIFIER ::= {id-trader-oc 1}
 * ```
 *
 * @constant
 */
export const id_trader_oc_serviceOffer: OBJECT_IDENTIFIER = new _OID(
    [1],
    id_trader_oc
);
/* END_OF_SYMBOL_DEFINITION id_trader_oc_serviceOffer */

/* eslint-enable */
