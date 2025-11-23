/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_assistConnectionEstablishment */
/**
 * @summary id_package_assistConnectionEstablishment
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-assistConnectionEstablishment OBJECT IDENTIFIER ::= {id-package assistConnectionEstablishment(16)}
 * ```
 *
 * @constant
 */
export const id_package_assistConnectionEstablishment: OBJECT_IDENTIFIER =
    _OID.fromParts([/* assistConnectionEstablishment */ 16], id_package);
/* END_OF_SYMBOL_DEFINITION id_package_assistConnectionEstablishment */

/* eslint-enable */
