/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION ssf_scf_Protocol */
/**
 * @summary ssf_scf_Protocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ssf-scf-Protocol OBJECT IDENTIFIER ::= {modules in-cs3-ssf-scf-pkgs-contracts-acs(9) version1(0)}
 * ```
 *
 * @constant
 */
export const ssf_scf_Protocol: OBJECT_IDENTIFIER = new _OID(
    [/* in-cs3-ssf-scf-pkgs-contracts-acs */ 9, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION ssf_scf_Protocol */

/* eslint-enable */
