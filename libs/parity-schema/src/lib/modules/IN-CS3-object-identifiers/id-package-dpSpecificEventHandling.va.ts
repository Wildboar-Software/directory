/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_dpSpecificEventHandling */
/**
 * @summary id_package_dpSpecificEventHandling
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-dpSpecificEventHandling OBJECT IDENTIFIER ::= {id-package dpSpecificEventHandling(22)}
 * ```
 *
 * @constant
 */
export const id_package_dpSpecificEventHandling: OBJECT_IDENTIFIER = new _OID(
    [/* dpSpecificEventHandling */ 22],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_dpSpecificEventHandling */

/* eslint-enable */
