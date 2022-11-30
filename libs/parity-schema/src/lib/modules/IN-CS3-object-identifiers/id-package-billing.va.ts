/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_billing */
/**
 * @summary id_package_billing
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-billing OBJECT IDENTIFIER ::= {id-package billing(27)}
 * ```
 *
 * @constant
 */
export const id_package_billing: OBJECT_IDENTIFIER = new _OID(
    [/* billing */ 27],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_billing */

/* eslint-enable */
