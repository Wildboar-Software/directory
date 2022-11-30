/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdAccountLockedTime */
/**
 * @summary id_at_pwdAccountLockedTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdAccountLockedTime      OBJECT IDENTIFIER ::= { id-ppolicy-at 17 }
 * ```
 *
 * @constant
 */
export const id_at_pwdAccountLockedTime: OBJECT_IDENTIFIER = new _OID(
    [17],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdAccountLockedTime */

/* eslint-enable */
