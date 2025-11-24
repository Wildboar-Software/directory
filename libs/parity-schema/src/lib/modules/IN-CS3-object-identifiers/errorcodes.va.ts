/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION errorcodes */
/**
 * @summary errorcodes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * errorcodes OBJECT IDENTIFIER ::= {modules in-cs3-errorcodes(4) version1(0)}
 * ```
 *
 * @constant
 */
export const errorcodes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-errorcodes */ 4, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION errorcodes */

/* eslint-enable */
