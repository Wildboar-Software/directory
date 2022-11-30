/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_modify */
/**
 * @summary id_package_modify
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-modify OBJECT IDENTIFIER ::= {id-package modify(3)}
 * ```
 *
 * @constant
 */
export const id_package_modify: OBJECT_IDENTIFIER = new _OID(
    [/* modify */ 3],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_modify */

/* eslint-enable */
