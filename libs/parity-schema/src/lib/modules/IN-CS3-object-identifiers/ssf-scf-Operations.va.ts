/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION ssf_scf_Operations */
/**
 * @summary ssf_scf_Operations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ssf-scf-Operations OBJECT IDENTIFIER ::= {modules in-cs3-ssf-scf-ops-args(8) version1(0)}
 * ```
 *
 * @constant
 */
export const ssf_scf_Operations: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-ssf-scf-ops-args */ 8, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION ssf_scf_Operations */

/* eslint-enable */
