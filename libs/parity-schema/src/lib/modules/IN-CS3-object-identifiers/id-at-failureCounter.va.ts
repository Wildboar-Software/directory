/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_failureCounter */
/**
 * @summary id_at_failureCounter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-failureCounter OBJECT IDENTIFIER ::= {id-at failureCounter(6)}
 * ```
 *
 * @constant
 */
export const id_at_failureCounter: OBJECT_IDENTIFIER = new _OID(
    [/* failureCounter */ 6],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_failureCounter */

/* eslint-enable */
