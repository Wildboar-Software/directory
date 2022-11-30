/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_scf_datatypes */
/**
 * @summary scf_scf_datatypes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-scf-datatypes OBJECT IDENTIFIER ::= {modules in-cs3-scf-scf-datatypes(20) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_scf_datatypes: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-scf-scf-datatypes */ 20, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_scf_datatypes */

/* eslint-enable */
