/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_at_so } from '../PrinterServiceOfferDefinitions/id-trader-at-so.va';
export { id_trader_at_so } from '../PrinterServiceOfferDefinitions/id-trader-at-so.va';

/* START_OF_SYMBOL_DEFINITION id_trader_at_so_queueLength */
/**
 * @summary id_trader_at_so_queueLength
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-at-so-queueLength OBJECT IDENTIFIER ::= {id-trader-at-so 10}
 * ```
 *
 * @constant
 */
export const id_trader_at_so_queueLength: OBJECT_IDENTIFIER = _OID.fromParts(
    [10],
    id_trader_at_so
);
/* END_OF_SYMBOL_DEFINITION id_trader_at_so_queueLength */

/* eslint-enable */
