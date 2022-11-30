/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../Wildboar/id-at.va';
export { id_at } from '../Wildboar/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_sizeOfRestocking */
/**
 * @summary id_at_sizeOfRestocking
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-sizeOfRestocking          OBJECT IDENTIFIER ::= { id-at sizeOfRestocking(11) }
 * ```
 *
 * @constant
 */
export const id_at_sizeOfRestocking: OBJECT_IDENTIFIER = new _OID(
    [/* sizeOfRestocking */ 11],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_sizeOfRestocking */

/* eslint-enable */
