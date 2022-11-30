/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdCheckQuality */
/**
 * @summary id_at_pwdCheckQuality
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdCheckQuality           OBJECT IDENTIFIER ::= { id-ppolicy-at 5 }
 * ```
 *
 * @constant
 */
export const id_at_pwdCheckQuality: OBJECT_IDENTIFIER = new _OID(
    [5],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdCheckQuality */

/* eslint-enable */
