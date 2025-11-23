/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_search */
/**
 * @summary id_package_search
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-search OBJECT IDENTIFIER ::= {id-package search(2)}
 * ```
 *
 * @constant
 */
export const id_package_search: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* search */ 2],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_search */

/* eslint-enable */
