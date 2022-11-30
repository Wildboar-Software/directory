/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION common_datatypes */
/**
 * @summary common_datatypes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * common-datatypes OBJECT IDENTIFIER ::= {modules in-cs3-common-datatypes(1) version1(0)}
 * ```
 *
 * @constant
 */
export const common_datatypes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-common-datatypes */ 1, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION common_datatypes */

/* eslint-enable */
