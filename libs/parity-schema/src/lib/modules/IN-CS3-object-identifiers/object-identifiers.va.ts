/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION object_identifiers */
/**
 * @summary object_identifiers
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * object-identifiers OBJECT IDENTIFIER ::= {modules in-cs3-object-identifiers(0) version1(0)}
 * ```
 *
 * @constant
 */
export const object_identifiers: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-object-identifiers */ 0, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION object_identifiers */

/* eslint-enable */
