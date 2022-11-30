/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_srf_scf */
/**
 * @summary id_contract_srf_scf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-srf-scf OBJECT IDENTIFIER ::= {id-contract srf-scf(13)}
 * ```
 *
 * @constant
 */
export const id_contract_srf_scf: OBJECT_IDENTIFIER = new _OID(
    [/* srf-scf */ 13],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_srf_scf */

/* eslint-enable */
