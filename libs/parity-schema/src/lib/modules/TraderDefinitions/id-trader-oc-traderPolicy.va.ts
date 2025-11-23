/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';
export { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc_traderPolicy */
/**
 * @summary id_trader_oc_traderPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc-traderPolicy OBJECT IDENTIFIER ::= {id-trader-oc 4}
 * ```
 *
 * @constant
 */
export const id_trader_oc_traderPolicy: OBJECT_IDENTIFIER = _OID.fromParts(
    [4],
    id_trader_oc
);
/* END_OF_SYMBOL_DEFINITION id_trader_oc_traderPolicy */

/* eslint-enable */
