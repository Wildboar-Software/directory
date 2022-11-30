/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_source */
/**
 * @summary id_at_source
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-source OBJECT IDENTIFIER ::= {id-at source(10)}
 * ```
 *
 * @constant
 */
export const id_at_source: OBJECT_IDENTIFIER = new _OID(
    [/* source */ 10],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_source */

/* eslint-enable */
