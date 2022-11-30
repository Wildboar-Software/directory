/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_maxAttempts */
/**
 * @summary id_at_maxAttempts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-maxAttempts OBJECT IDENTIFIER ::= {id-at maxAttempts(7)}
 * ```
 *
 * @constant
 */
export const id_at_maxAttempts: OBJECT_IDENTIFIER = new _OID(
    [/* maxAttempts */ 7],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_maxAttempts */

/* eslint-enable */
