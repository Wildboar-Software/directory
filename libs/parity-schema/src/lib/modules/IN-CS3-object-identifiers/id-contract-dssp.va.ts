/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_dssp */
/**
 * @summary id_contract_dssp
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-dssp OBJECT IDENTIFIER ::= {id-contract dssp(19)}
 * ```
 *
 * @constant
 */
export const id_contract_dssp: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* dssp */ 19],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_dssp */

/* eslint-enable */
