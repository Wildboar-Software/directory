/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_specializedResourceControl */
/**
 * @summary id_package_specializedResourceControl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-specializedResourceControl OBJECT IDENTIFIER ::= {id-package specializedResourceControl(42)}
 * ```
 *
 * @constant
 */
export const id_package_specializedResourceControl: OBJECT_IDENTIFIER =
    new _OID([/* specializedResourceControl */ 42], id_package);
/* END_OF_SYMBOL_DEFINITION id_package_specializedResourceControl */

/* eslint-enable */
