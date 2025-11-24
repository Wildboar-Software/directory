/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at } from '../TraderDefinitions/id-trader-at.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_sOfferId */
/**
 * @summary id_trader_at_sOfferId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-sOfferId OBJECT IDENTIFIER ::= {id-trader-at 32}
 * ```
 *
 * @constant
 */
export const id_trader_at_sOfferId: OBJECT_IDENTIFIER = _OID.fromParts(
    [32],
    id_trader_at
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_sOfferId */

/* eslint-enable */
