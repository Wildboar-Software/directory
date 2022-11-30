/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';
export { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';

/* START_OF_SYMBOL_DEFINITION id_ac_cs3_scf_ssfGenericAC */
/**
 * @summary id_ac_cs3_scf_ssfGenericAC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ac-cs3-scf-ssfGenericAC OBJECT IDENTIFIER ::= {id-ac scf-ssfGenericAC(8) version1(0)}
 * ```
 *
 * @constant
 */
export const id_ac_cs3_scf_ssfGenericAC: OBJECT_IDENTIFIER = new _OID(
    [/* scf-ssfGenericAC */ 8, /* version1 */ 0],
    id_ac
);
/* END_OF_SYMBOL_DEFINITION id_ac_cs3_scf_ssfGenericAC */

/* eslint-enable */
