/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_ssfCallProcessing */
/**
 * @summary id_package_ssfCallProcessing
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-ssfCallProcessing OBJECT IDENTIFIER ::= {id-package ssfCallProcessing(24)}
 * ```
 *
 * @constant
 */
export const id_package_ssfCallProcessing: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* ssfCallProcessing */ 24],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_ssfCallProcessing */

/* eslint-enable */
