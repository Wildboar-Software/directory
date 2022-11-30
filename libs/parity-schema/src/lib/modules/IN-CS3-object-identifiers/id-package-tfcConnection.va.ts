/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_tfcConnection */
/**
 * @summary id_package_tfcConnection
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-tfcConnection OBJECT IDENTIFIER ::= {id-package tfcConnection(65)}
 * ```
 *
 * @constant
 */
export const id_package_tfcConnection: OBJECT_IDENTIFIER = new _OID(
    [/* tfcConnection */ 65],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_tfcConnection */

/* eslint-enable */
