/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_cusf_datatypes */
/**
 * @summary scf_cusf_datatypes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-cusf-datatypes OBJECT IDENTIFIER ::= {modules in-cs3-scf-cusf-datatypes(24) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_cusf_datatypes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-scf-cusf-datatypes */ 24, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_cusf_datatypes */

/* eslint-enable */
