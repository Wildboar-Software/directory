/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_statusReporting */
/**
 * @summary id_package_statusReporting
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-statusReporting OBJECT IDENTIFIER ::= {id-package statusReporting(35)}
 * ```
 *
 * @constant
 */
export const id_package_statusReporting: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* statusReporting */ 35],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_statusReporting */

/* eslint-enable */
