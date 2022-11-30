/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_cusf_Operations */
/**
 * @summary scf_cusf_Operations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-cusf-Operations OBJECT IDENTIFIER ::= {modules in-cs3-scf-cusf-ops-args(26) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_cusf_Operations: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-scf-cusf-ops-args */ 26, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_cusf_Operations */

/* eslint-enable */
