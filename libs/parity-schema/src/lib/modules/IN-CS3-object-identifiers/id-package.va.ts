/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_package */
/**
 * @summary id_package
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package OBJECT IDENTIFIER ::= {id-cs3 package(27)}
 * ```
 *
 * @constant
 */
export const id_package: OBJECT_IDENTIFIER = new _OID(
    [/* package */ 27],
    id_cs3
);
/* END_OF_SYMBOL_DEFINITION id_package */

/* eslint-enable */
