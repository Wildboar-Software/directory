/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_inchainedModify */
/**
 * @summary id_package_inchainedModify
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-inchainedModify OBJECT IDENTIFIER ::= {id-package inchainedModify(48)}
 * ```
 *
 * @constant
 */
export const id_package_inchainedModify: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* inchainedModify */ 48],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_inchainedModify */

/* eslint-enable */
