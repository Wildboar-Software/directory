/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION scf_sdf_Protocol */
/**
 * @summary scf_sdf_Protocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * scf-sdf-Protocol OBJECT IDENTIFIER ::= {modules in-cs3-scf-sdf-pkgs-contracts-acs(17) version1(0)}
 * ```
 *
 * @constant
 */
export const scf_sdf_Protocol: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-scf-sdf-pkgs-contracts-acs */ 17, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION scf_sdf_Protocol */

/* eslint-enable */
