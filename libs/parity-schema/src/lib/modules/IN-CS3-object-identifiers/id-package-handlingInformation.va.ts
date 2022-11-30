/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_handlingInformation */
/**
 * @summary id_package_handlingInformation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-handlingInformation OBJECT IDENTIFIER ::= {id-package handlingInformation(54)}
 * ```
 *
 * @constant
 */
export const id_package_handlingInformation: OBJECT_IDENTIFIER = new _OID(
    [/* handlingInformation */ 54],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_handlingInformation */

/* eslint-enable */
