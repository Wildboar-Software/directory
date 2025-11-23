/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_basicBCPDP */
/**
 * @summary id_package_basicBCPDP
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-basicBCPDP OBJECT IDENTIFIER ::= {id-package basicBCPDP(12)}
 * ```
 *
 * @constant
 */
export const id_package_basicBCPDP: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* basicBCPDP */ 12],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_basicBCPDP */

/* eslint-enable */
