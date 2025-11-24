/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_oc } from '../IN-CS3-object-identifiers/id-oc.va';

/* START_OF_SYMBOL_DEFINITION id_oc_securityUserInfo */
/**
 * @summary id_oc_securityUserInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-securityUserInfo OBJECT IDENTIFIER ::= {id-oc securityUserInfo(1)}
 * ```
 *
 * @constant
 */
export const id_oc_securityUserInfo: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* securityUserInfo */ 1],
    id_oc
);
/* END_OF_SYMBOL_DEFINITION id_oc_securityUserInfo */

/* eslint-enable */
