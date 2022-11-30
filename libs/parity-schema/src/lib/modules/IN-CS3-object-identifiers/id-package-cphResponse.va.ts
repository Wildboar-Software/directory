/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_cphResponse */
/**
 * @summary id_package_cphResponse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-cphResponse OBJECT IDENTIFIER ::= {id-package cphResponse(37)}
 * ```
 *
 * @constant
 */
export const id_package_cphResponse: OBJECT_IDENTIFIER = new _OID(
    [/* cphResponse */ 37],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_cphResponse */

/* eslint-enable */
