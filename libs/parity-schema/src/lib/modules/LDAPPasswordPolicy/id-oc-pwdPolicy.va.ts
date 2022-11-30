/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_oc } from '../LDAPPasswordPolicy/id-ppolicy-oc.va';
export { id_ppolicy_oc } from '../LDAPPasswordPolicy/id-ppolicy-oc.va';

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
export const id_oc_pwdPolicy: OBJECT_IDENTIFIER = new _OID([1], id_ppolicy_oc);
/* END_OF_SYMBOL_DEFINITION id_oc_pwdPolicy */

/* eslint-enable */
