/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_uSIHandling */
/**
 * @summary id_package_uSIHandling
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-uSIHandling OBJECT IDENTIFIER ::= {id-package uSIHandling(40)}
 * ```
 *
 * @constant
 */
export const id_package_uSIHandling: OBJECT_IDENTIFIER = new _OID(
    [/* uSIHandling */ 40],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_uSIHandling */

/* eslint-enable */
