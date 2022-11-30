/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdMinDelay */
/**
 * @summary id_at_pwdMinDelay
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdMinDelay               OBJECT IDENTIFIER ::= { id-ppolicy-at 24 }
 * ```
 *
 * @constant
 */
export const id_at_pwdMinDelay: OBJECT_IDENTIFIER = new _OID(
    [24],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdMinDelay */

/* eslint-enable */
