/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_trafficManagement */
/**
 * @summary id_package_trafficManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-trafficManagement OBJECT IDENTIFIER ::= {id-package trafficManagement(29)}
 * ```
 *
 * @constant
 */
export const id_package_trafficManagement: OBJECT_IDENTIFIER = new _OID(
    [/* trafficManagement */ 29],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_trafficManagement */

/* eslint-enable */
