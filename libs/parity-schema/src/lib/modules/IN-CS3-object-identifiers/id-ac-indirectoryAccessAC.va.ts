/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';
export { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';

/* START_OF_SYMBOL_DEFINITION id_ac_indirectoryAccessAC */
/**
 * @summary id_ac_indirectoryAccessAC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ac-indirectoryAccessAC OBJECT IDENTIFIER ::= {id-ac indirectoryAccessAC(1) version1(0)}
 * ```
 *
 * @constant
 */
export const id_ac_indirectoryAccessAC: OBJECT_IDENTIFIER = new _OID(
    [/* indirectoryAccessAC */ 1, /* version1 */ 0],
    id_ac
);
/* END_OF_SYMBOL_DEFINITION id_ac_indirectoryAccessAC */

/* eslint-enable */
