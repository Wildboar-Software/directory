/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';
export { id_trader_oc } from '../TraderDefinitions/id-trader-oc.va';

/* START_OF_SYMBOL_DEFINITION id_trader_oc_interfaceEntry */
/**
 * @summary id_trader_oc_interfaceEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-oc-interfaceEntry OBJECT IDENTIFIER ::= {id-trader-oc 5}
 * ```
 *
 * @constant
 */
export const id_trader_oc_interfaceEntry: OBJECT_IDENTIFIER = _OID.fromParts(
    [5],
    id_trader_oc
);
/* END_OF_SYMBOL_DEFINITION id_trader_oc_interfaceEntry */

/* eslint-enable */
