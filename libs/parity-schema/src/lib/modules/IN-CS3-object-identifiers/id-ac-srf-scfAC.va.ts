/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';
export { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';

/* START_OF_SYMBOL_DEFINITION id_ac_srf_scfAC */
/**
 * @summary id_ac_srf_scfAC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ac-srf-scfAC OBJECT IDENTIFIER ::= {id-ac srf-scfAC(14) version1(0)}
 * ```
 *
 * @constant
 */
export const id_ac_srf_scfAC: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* srf-scfAC */ 14, /* version1 */ 0],
    id_ac
);
/* END_OF_SYMBOL_DEFINITION id_ac_srf_scfAC */

/* eslint-enable */
