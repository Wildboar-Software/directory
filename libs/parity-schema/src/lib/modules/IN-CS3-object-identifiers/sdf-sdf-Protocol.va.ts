/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { modules } from '../IN-CS3-object-identifiers/modules.va';
export { modules } from '../IN-CS3-object-identifiers/modules.va';

/* START_OF_SYMBOL_DEFINITION sdf_sdf_Protocol */
/**
 * @summary sdf_sdf_Protocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sdf-sdf-Protocol OBJECT IDENTIFIER ::= {modules in-cs3-sdf-sdf-pkgs-contracts-acs(19) version1(0)}
 * ```
 *
 * @constant
 */
export const sdf_sdf_Protocol: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* in-cs3-sdf-sdf-pkgs-contracts-acs */ 19, /* version1 */ 0],
    modules
);
/* END_OF_SYMBOL_DEFINITION sdf_sdf_Protocol */

/* eslint-enable */
