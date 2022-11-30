/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdGraceUseTime */
/**
 * @summary id_at_pwdGraceUseTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdGraceUseTime           OBJECT IDENTIFIER ::= { id-ppolicy-at 21 }
 * ```
 *
 * @constant
 */
export const id_at_pwdGraceUseTime: OBJECT_IDENTIFIER = new _OID(
    [21],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdGraceUseTime */

/* eslint-enable */
