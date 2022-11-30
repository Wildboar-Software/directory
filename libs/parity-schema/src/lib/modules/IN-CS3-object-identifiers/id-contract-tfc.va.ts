/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_tfc */
/**
 * @summary id_contract_tfc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-tfc OBJECT IDENTIFIER ::= {id-contract tfc(22)}
 * ```
 *
 * @constant
 */
export const id_contract_tfc: OBJECT_IDENTIFIER = new _OID(
    [/* tfc */ 22],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_tfc */

/* eslint-enable */
