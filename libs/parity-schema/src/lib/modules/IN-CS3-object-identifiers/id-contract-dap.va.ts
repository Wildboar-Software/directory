/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_dap */
/**
 * @summary id_contract_dap
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-dap OBJECT IDENTIFIER ::= {id-contract dap(1)}
 * ```
 *
 * @constant
 */
export const id_contract_dap: OBJECT_IDENTIFIER = new _OID(
    [/* dap */ 1],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_dap */

/* eslint-enable */
