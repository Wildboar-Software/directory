/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_triggerManagement */
/**
 * @summary id_package_triggerManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-triggerManagement OBJECT IDENTIFIER ::= {id-package triggerManagement(39)}
 * ```
 *
 * @constant
 */
export const id_package_triggerManagement: OBJECT_IDENTIFIER = new _OID(
    [/* triggerManagement */ 39],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_triggerManagement */

/* eslint-enable */
