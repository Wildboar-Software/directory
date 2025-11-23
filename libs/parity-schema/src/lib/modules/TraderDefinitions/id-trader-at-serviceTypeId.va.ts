/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';
export { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_serviceTypeId */
/**
 * @summary id_trader_at_serviceTypeId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-serviceTypeId OBJECT IDENTIFIER ::= {id-trader-at 33}
 * ```
 *
 * @constant
 */
export const id_trader_at_serviceTypeId: OBJECT_IDENTIFIER = _OID.fromParts(
    [33],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_serviceTypeId */

/* eslint-enable */
