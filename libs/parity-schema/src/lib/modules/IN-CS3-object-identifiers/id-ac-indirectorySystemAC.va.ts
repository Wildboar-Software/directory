/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';
export { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';

/* START_OF_SYMBOL_DEFINITION id_ac_indirectorySystemAC */
/**
 * @summary id_ac_indirectorySystemAC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ac-indirectorySystemAC OBJECT IDENTIFIER ::= {id-ac indirectorySystemAC(15) version1(0)}
 * ```
 *
 * @constant
 */
export const id_ac_indirectorySystemAC: OBJECT_IDENTIFIER = new _OID(
    [/* indirectorySystemAC */ 15, /* version1 */ 0],
    id_ac
);
/* END_OF_SYMBOL_DEFINITION id_ac_indirectorySystemAC */

/* eslint-enable */
