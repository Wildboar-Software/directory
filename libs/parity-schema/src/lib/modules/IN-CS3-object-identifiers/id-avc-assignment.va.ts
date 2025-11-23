/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_avc } from '../IN-CS3-object-identifiers/id-avc.va';
export { id_avc } from '../IN-CS3-object-identifiers/id-avc.va';

/* START_OF_SYMBOL_DEFINITION id_avc_assignment */
/**
 * @summary id_avc_assignment
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-avc-assignment OBJECT IDENTIFIER ::= {id-avc assignment(1)}
 * ```
 *
 * @constant
 */
export const id_avc_assignment: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* assignment */ 1],
    id_avc
);
/* END_OF_SYMBOL_DEFINITION id_avc_assignment */

/* eslint-enable */
