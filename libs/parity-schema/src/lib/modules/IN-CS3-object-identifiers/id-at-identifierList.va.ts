/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_identifierList */
/**
 * @summary id_at_identifierList
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-identifierList OBJECT IDENTIFIER ::= {id-at identifierList(3)}
 * ```
 *
 * @constant
 */
export const id_at_identifierList: OBJECT_IDENTIFIER = new _OID(
    [/* identifierList */ 3],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_identifierList */

/* eslint-enable */
