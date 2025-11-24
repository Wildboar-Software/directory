/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_interfaceReference */
/**
 * @summary id_trader_at_interfaceReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-interfaceReference OBJECT IDENTIFIER ::= {id-trader-at 60}
 * ```
 *
 * @constant
 */
export const id_trader_at_interfaceReference: OBJECT_IDENTIFIER = _OID.fromParts(
    [60],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_interfaceReference */

/* eslint-enable */
