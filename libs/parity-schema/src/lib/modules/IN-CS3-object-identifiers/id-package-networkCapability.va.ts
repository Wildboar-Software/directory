/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_networkCapability */
/**
 * @summary id_package_networkCapability
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-networkCapability OBJECT IDENTIFIER ::= {id-package networkCapability(58)}
 * ```
 *
 * @constant
 */
export const id_package_networkCapability: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* networkCapability */ 58],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_networkCapability */

/* eslint-enable */
