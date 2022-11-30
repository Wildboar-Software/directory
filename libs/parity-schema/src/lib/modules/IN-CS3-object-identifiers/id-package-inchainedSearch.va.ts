/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_inchainedSearch */
/**
 * @summary id_package_inchainedSearch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-inchainedSearch OBJECT IDENTIFIER ::= {id-package inchainedSearch(49)}
 * ```
 *
 * @constant
 */
export const id_package_inchainedSearch: OBJECT_IDENTIFIER = new _OID(
    [/* inchainedSearch */ 49],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_inchainedSearch */

/* eslint-enable */
