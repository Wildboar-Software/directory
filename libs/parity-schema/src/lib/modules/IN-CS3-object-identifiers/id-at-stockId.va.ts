/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_stockId */
/**
 * @summary id_at_stockId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-stockId OBJECT IDENTIFIER ::= {id-at stockId(9)}
 * ```
 *
 * @constant
 */
export const id_at_stockId: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* stockId */ 9],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_stockId */

/* eslint-enable */
