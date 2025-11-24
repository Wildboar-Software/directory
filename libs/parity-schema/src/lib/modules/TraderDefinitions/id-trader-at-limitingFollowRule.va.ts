/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_limitingFollowRule */
/**
 * @summary id_trader_at_limitingFollowRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-limitingFollowRule OBJECT IDENTIFIER ::= {id-trader-at 50}
 * ```
 *
 * @constant
 */
export const id_trader_at_limitingFollowRule: OBJECT_IDENTIFIER = _OID.fromParts(
    [50],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_limitingFollowRule */

/* eslint-enable */
