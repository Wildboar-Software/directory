/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION common_classes */
/**
 * @summary common_classes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * common-classes OBJECT IDENTIFIER ::= {modules in-cs3-common-classes(5) version1(0)}
 * ```
 *
 * @constant
 */
export const common_classes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-common-classes */ 5, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION common_classes */

/* eslint-enable */
