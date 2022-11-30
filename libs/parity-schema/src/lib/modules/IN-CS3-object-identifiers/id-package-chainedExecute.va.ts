/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_chainedExecute */
/**
 * @summary id_package_chainedExecute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-chainedExecute OBJECT IDENTIFIER ::= {id-package chainedExecute(50)}
 * ```
 *
 * @constant
 */
export const id_package_chainedExecute: OBJECT_IDENTIFIER = new _OID(
    [/* chainedExecute */ 50],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_chainedExecute */

/* eslint-enable */
