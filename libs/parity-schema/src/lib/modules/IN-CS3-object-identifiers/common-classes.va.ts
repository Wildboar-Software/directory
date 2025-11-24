/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';

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
export const common_classes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-common-classes */ 5, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION common_classes */

/* eslint-enable */
