/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_callReport */
/**
 * @summary id_package_callReport
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-callReport OBJECT IDENTIFIER ::= {id-package callReport(32)}
 * ```
 *
 * @constant
 */
export const id_package_callReport: OBJECT_IDENTIFIER = new _OID(
    [/* callReport */ 32],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_callReport */

/* eslint-enable */
