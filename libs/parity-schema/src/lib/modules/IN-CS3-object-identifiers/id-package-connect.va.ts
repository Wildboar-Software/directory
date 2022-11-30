/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_connect */
/**
 * @summary id_package_connect
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-connect OBJECT IDENTIFIER ::= {id-package connect(19)}
 * ```
 *
 * @constant
 */
export const id_package_connect: OBJECT_IDENTIFIER = new _OID(
    [/* connect */ 19],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_connect */

/* eslint-enable */
