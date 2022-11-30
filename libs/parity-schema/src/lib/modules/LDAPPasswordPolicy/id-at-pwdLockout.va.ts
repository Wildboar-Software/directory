/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdLockout */
/**
 * @summary id_at_pwdLockout
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdLockout                OBJECT IDENTIFIER ::= { id-ppolicy-at 9 }
 * ```
 *
 * @constant
 */
export const id_at_pwdLockout: OBJECT_IDENTIFIER = new _OID([9], id_ppolicy_at);
/* END_OF_SYMBOL_DEFINITION id_at_pwdLockout */

/* eslint-enable */
