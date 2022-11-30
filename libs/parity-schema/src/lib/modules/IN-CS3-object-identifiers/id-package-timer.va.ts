/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_timer */
/**
 * @summary id_package_timer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-timer OBJECT IDENTIFIER ::= {id-package timer(26)}
 * ```
 *
 * @constant
 */
export const id_package_timer: OBJECT_IDENTIFIER = new _OID(
    [/* timer */ 26],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_timer */

/* eslint-enable */
