/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_triggerCallManagement */
/**
 * @summary id_package_triggerCallManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-triggerCallManagement OBJECT IDENTIFIER ::= {id-package triggerCallManagement(63)}
 * ```
 *
 * @constant
 */
export const id_package_triggerCallManagement: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* triggerCallManagement */ 63],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_triggerCallManagement */

/* eslint-enable */
