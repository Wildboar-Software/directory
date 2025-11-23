/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_callHandling */
/**
 * @summary id_package_callHandling
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-callHandling OBJECT IDENTIFIER ::= {id-package callHandling(20)}
 * ```
 *
 * @constant
 */
export const id_package_callHandling: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* callHandling */ 20],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_callHandling */

/* eslint-enable */
