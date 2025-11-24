/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_searchConstraint */
/**
 * @summary id_trader_at_searchConstraint
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-searchConstraint OBJECT IDENTIFIER ::= {id-trader-at 30}
 * ```
 *
 * @constant
 */
export const id_trader_at_searchConstraint: OBJECT_IDENTIFIER = _OID.fromParts(
    [30],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_searchConstraint */

/* eslint-enable */
