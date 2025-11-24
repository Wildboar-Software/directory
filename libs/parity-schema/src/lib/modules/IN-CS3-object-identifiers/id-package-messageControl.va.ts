/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_messageControl */
/**
 * @summary id_package_messageControl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-messageControl OBJECT IDENTIFIER ::= {id-package messageControl(44)}
 * ```
 *
 * @constant
 */
export const id_package_messageControl: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* messageControl */ 44],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_messageControl */

/* eslint-enable */
