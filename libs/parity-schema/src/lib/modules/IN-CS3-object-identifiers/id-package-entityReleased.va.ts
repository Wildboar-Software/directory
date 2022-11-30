/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_entityReleased */
/**
 * @summary id_package_entityReleased
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-entityReleased OBJECT IDENTIFIER ::= {id-package entityReleased(38)}
 * ```
 *
 * @constant
 */
export const id_package_entityReleased: OBJECT_IDENTIFIER = new _OID(
    [/* entityReleased */ 38],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_entityReleased */

/* eslint-enable */
