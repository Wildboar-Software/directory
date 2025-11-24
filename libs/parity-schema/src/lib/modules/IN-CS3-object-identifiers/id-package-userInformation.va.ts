/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_userInformation */
/**
 * @summary id_package_userInformation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-userInformation OBJECT IDENTIFIER ::= {id-package userInformation(57)}
 * ```
 *
 * @constant
 */
export const id_package_userInformation: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* userInformation */ 57],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_userInformation */

/* eslint-enable */
