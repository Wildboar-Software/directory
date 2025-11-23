/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION operationcodes */
/**
 * @summary operationcodes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * operationcodes OBJECT IDENTIFIER ::= {modules in-cs3-operationcodes(3) version1(0)}
 * ```
 *
 * @constant
 */
export const operationcodes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-operationcodes */ 3, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION operationcodes */

/* eslint-enable */
