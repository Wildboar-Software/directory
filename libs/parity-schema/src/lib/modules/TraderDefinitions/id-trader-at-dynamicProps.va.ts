/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';
export { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_dynamicProps */
/**
 * @summary id_trader_at_dynamicProps
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-dynamicProps OBJECT IDENTIFIER ::= {id-trader-at 41}
 * ```
 *
 * @constant
 */
export const id_trader_at_dynamicProps: OBJECT_IDENTIFIER = _OID.fromParts(
    [41],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_dynamicProps */

/* eslint-enable */
