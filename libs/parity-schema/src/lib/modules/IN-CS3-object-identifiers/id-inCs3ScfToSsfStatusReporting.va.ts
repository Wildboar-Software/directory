/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfStatusReporting */
/**
 * @summary id_inCs3ScfToSsfStatusReporting
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-inCs3ScfToSsfStatusReporting OBJECT IDENTIFIER ::= {id-contract inCs3ScfToSsfStatusReporting(11)}
 * ```
 *
 * @constant
 */
export const id_inCs3ScfToSsfStatusReporting: OBJECT_IDENTIFIER = new _OID(
    [/* inCs3ScfToSsfStatusReporting */ 11],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfStatusReporting */

/* eslint-enable */
