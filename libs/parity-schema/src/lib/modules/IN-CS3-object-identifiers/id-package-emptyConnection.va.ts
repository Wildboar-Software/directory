/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_emptyConnection */
/**
 * @summary id_package_emptyConnection
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-emptyConnection OBJECT IDENTIFIER ::= {id-package emptyConnection(60)}
 * ```
 *
 * @constant
 */
export const id_package_emptyConnection: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* emptyConnection */ 60],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_emptyConnection */

/* eslint-enable */
