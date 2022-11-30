/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION errorcodes */
/**
 * @summary errorcodes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * errorcodes OBJECT IDENTIFIER ::= {modules in-cs3-errorcodes(4) version1(0)}
 * ```
 *
 * @constant
 */
export const errorcodes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-errorcodes */ 4, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION errorcodes */

/* eslint-enable */
