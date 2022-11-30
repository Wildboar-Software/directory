/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdGraceExpire */
/**
 * @summary id_at_pwdGraceExpire
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdGraceExpire            OBJECT IDENTIFIER ::= { id-ppolicy-at 30 }
 * ```
 *
 * @constant
 */
export const id_at_pwdGraceExpire: OBJECT_IDENTIFIER = new _OID(
    [30],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdGraceExpire */

/* eslint-enable */
