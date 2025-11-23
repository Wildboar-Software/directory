/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';
export { id_contract } from '../IN-CS3-object-identifiers/id-contract.va';

/* START_OF_SYMBOL_DEFINITION id_inCs3SsfToScfServiceManagement */
/**
 * @summary id_inCs3SsfToScfServiceManagement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-inCs3SsfToScfServiceManagement OBJECT IDENTIFIER ::= {id-contract inCs3SsfToScfServiceManagement(10)}
 * ```
 *
 * @constant
 */
export const id_inCs3SsfToScfServiceManagement: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* inCs3SsfToScfServiceManagement */ 10],
    id_contract
);
/* END_OF_SYMBOL_DEFINITION id_inCs3SsfToScfServiceManagement */

/* eslint-enable */
