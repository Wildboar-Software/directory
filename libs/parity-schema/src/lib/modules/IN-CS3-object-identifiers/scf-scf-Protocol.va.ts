/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_scf_Protocol */
/**
 * @summary scf_scf_Protocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-scf-Protocol OBJECT IDENTIFIER ::= {modules in-cs3-scf-scf-pkgs-contracts-acs(23) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_scf_Protocol: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-scf-scf-pkgs-contracts-acs */ 23, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_scf_Protocol */

/* eslint-enable */
