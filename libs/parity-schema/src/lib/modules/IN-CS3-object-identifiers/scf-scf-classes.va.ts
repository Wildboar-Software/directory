/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_scf_classes */
/**
 * @summary scf_scf_classes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-scf-classes OBJECT IDENTIFIER ::= {modules in-cs3-scf-scf-classes(21) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_scf_classes: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-scf-scf-classes */ 21, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_scf_classes */

/* eslint-enable */
