/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_dapConnection */
/**
 * @summary id_package_dapConnection
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-dapConnection OBJECT IDENTIFIER ::= {id-package dapConnection(10)}
 * ```
 *
 * @constant
 */
export const id_package_dapConnection: OBJECT_IDENTIFIER = new _OID(
    [/* dapConnection */ 10],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_dapConnection */

/* eslint-enable */
