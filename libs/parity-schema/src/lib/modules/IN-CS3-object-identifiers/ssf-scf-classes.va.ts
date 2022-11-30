/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION ssf_scf_classes */
/**
 * @summary ssf_scf_classes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ssf-scf-classes OBJECT IDENTIFIER ::= {modules in-cs3-ssf-scf-classes(7) version1(0)}
 * ```
 *
 * @constant
 */
export const ssf_scf_classes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-ssf-scf-classes */ 7, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION ssf_scf_classes */

/* eslint-enable */
