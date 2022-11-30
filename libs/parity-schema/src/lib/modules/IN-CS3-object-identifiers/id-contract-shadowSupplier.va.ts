/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_shadowSupplier */
/**
 * @summary id_contract_shadowSupplier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-shadowSupplier OBJECT IDENTIFIER ::= {id-contract shadowSupplier(17)}
 * ```
 *
 * @constant
 */
export const id_contract_shadowSupplier: OBJECT_IDENTIFIER = new _OID(
    [/* shadowSupplier */ 17],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_shadowSupplier */

/* eslint-enable */
