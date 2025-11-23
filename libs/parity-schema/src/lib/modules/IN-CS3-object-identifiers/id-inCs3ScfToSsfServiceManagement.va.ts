/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfServiceManagement */
/**
 * @summary id_inCs3ScfToSsfServiceManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-inCs3ScfToSsfServiceManagement OBJECT IDENTIFIER ::= {id-contract inCs3ScfToSsfServiceManagement(9)}
 * ```
 *
 * @constant
 */
export const id_inCs3ScfToSsfServiceManagement: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* inCs3ScfToSsfServiceManagement */ 9],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfServiceManagement */

/* eslint-enable */
