/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_scfCallInitiation */
/**
 * @summary id_package_scfCallInitiation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-scfCallInitiation OBJECT IDENTIFIER ::= {id-package scfCallInitiation(25)}
 * ```
 *
 * @constant
 */
export const id_package_scfCallInitiation: OBJECT_IDENTIFIER = new _OID(
    [/* scfCallInitiation */ 25],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_scfCallInitiation */

/* eslint-enable */
