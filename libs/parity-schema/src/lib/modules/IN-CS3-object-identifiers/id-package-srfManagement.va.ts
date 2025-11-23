/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_srfManagement */
/**
 * @summary id_package_srfManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-srfManagement OBJECT IDENTIFIER ::= {id-package srfManagement(66)}
 * ```
 *
 * @constant
 */
export const id_package_srfManagement: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* srfManagement */ 66],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_srfManagement */

/* eslint-enable */
