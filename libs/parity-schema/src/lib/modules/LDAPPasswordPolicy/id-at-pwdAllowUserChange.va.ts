/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdAllowUserChange */
/**
 * @summary id_at_pwdAllowUserChange
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdAllowUserChange        OBJECT IDENTIFIER ::= { id-ppolicy-at 14 }
 * ```
 *
 * @constant
 */
export const id_at_pwdAllowUserChange: OBJECT_IDENTIFIER = _OID.fromParts(
    [14],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdAllowUserChange */

/* eslint-enable */
