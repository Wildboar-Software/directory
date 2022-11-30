/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_notification */
/**
 * @summary id_package_notification
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-notification OBJECT IDENTIFIER ::= {id-package notification(55)}
 * ```
 *
 * @constant
 */
export const id_package_notification: OBJECT_IDENTIFIER = new _OID(
    [/* notification */ 55],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_notification */

/* eslint-enable */
