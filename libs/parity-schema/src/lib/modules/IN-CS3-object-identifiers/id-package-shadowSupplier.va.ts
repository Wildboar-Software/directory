/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_shadowSupplier */
/**
 * @summary id_package_shadowSupplier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-shadowSupplier OBJECT IDENTIFIER ::= {id-package shadowSupplier(53)}
 * ```
 *
 * @constant
 */
export const id_package_shadowSupplier: OBJECT_IDENTIFIER = new _OID(
    [/* shadowSupplier */ 53],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_shadowSupplier */

/* eslint-enable */
