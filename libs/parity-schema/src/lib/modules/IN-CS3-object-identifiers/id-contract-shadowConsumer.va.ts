/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_contract_shadowConsumer */
/**
 * @summary id_contract_shadowConsumer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contract-shadowConsumer OBJECT IDENTIFIER ::= {id-contract shadowConsumer(15)}
 * ```
 *
 * @constant
 */
export const id_contract_shadowConsumer: OBJECT_IDENTIFIER = new _OID(
    [/* shadowConsumer */ 15],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_contract_shadowConsumer */

/* eslint-enable */
