/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_transferStsi */
/**
 * @summary id_package_transferStsi
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-transferStsi OBJECT IDENTIFIER ::= {id-package chainedSCFOperations(60)}
 * ```
 *
 * @constant
 */
export const id_package_transferStsi: OBJECT_IDENTIFIER = new _OID(
    [/* chainedSCFOperations */ 60],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_transferStsi */

/* eslint-enable */
