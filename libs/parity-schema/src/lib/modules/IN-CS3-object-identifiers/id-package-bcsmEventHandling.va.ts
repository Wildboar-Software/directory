/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_bcsmEventHandling */
/**
 * @summary id_package_bcsmEventHandling
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-bcsmEventHandling OBJECT IDENTIFIER ::= {id-package bcsmEventHandling(21)}
 * ```
 *
 * @constant
 */
export const id_package_bcsmEventHandling: OBJECT_IDENTIFIER = new _OID(
    [/* bcsmEventHandling */ 21],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_bcsmEventHandling */

/* eslint-enable */
