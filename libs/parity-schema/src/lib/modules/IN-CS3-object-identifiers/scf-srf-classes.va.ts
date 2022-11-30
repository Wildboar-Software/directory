/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_srf_classes */
/**
 * @summary scf_srf_classes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-srf-classes OBJECT IDENTIFIER ::= {modules in-cs3-scf-srf-classes(11) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_srf_classes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-scf-srf-classes */ 11, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_srf_classes */

/* eslint-enable */
