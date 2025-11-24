/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_oc } from '../LDAPPasswordPolicy/id-ppolicy-oc.va';

/* START_OF_SYMBOL_DEFINITION id_oc_pwdPolicy */
/**
 * @summary id_oc_pwdPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-pwdPolicy                 OBJECT IDENTIFIER ::= { id-ppolicy-oc 1 }
 * ```
 *
 * @constant
 */
export const id_oc_pwdPolicy: OBJECT_IDENTIFIER = _OID.fromParts([1], id_ppolicy_oc);
/* END_OF_SYMBOL_DEFINITION id_oc_pwdPolicy */

/* eslint-enable */
