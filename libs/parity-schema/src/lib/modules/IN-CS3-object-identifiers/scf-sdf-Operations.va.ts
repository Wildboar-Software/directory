/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_sdf_Operations */
/**
 * @summary scf_sdf_Operations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-sdf-Operations OBJECT IDENTIFIER ::= {modules in-cs3-scf-sdf-ops-args(16) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_sdf_Operations: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-scf-sdf-ops-args */ 16, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_sdf_Operations */

/* eslint-enable */
