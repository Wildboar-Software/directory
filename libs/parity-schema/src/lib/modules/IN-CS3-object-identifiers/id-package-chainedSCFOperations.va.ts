/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_chainedSCFOperations */
/**
 * @summary id_package_chainedSCFOperations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-chainedSCFOperations OBJECT IDENTIFIER ::= {id-package chainedSCFOperations(59)}
 * ```
 *
 * @constant
 */
export const id_package_chainedSCFOperations: OBJECT_IDENTIFIER = new _OID(
    [/* chainedSCFOperations */ 59],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_chainedSCFOperations */

/* eslint-enable */
