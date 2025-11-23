/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION errortypes */
/**
 * @summary errortypes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * errortypes OBJECT IDENTIFIER ::= {modules in-cs3-errortypes(2) version1(0)}
 * ```
 *
 * @constant
 */
export const errortypes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-errortypes */ 2, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION errortypes */

/* eslint-enable */
