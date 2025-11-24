/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdMustChange */
/**
 * @summary id_at_pwdMustChange
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdMustChange             OBJECT IDENTIFIER ::= { id-ppolicy-at 13 }
 * ```
 *
 * @constant
 */
export const id_at_pwdMustChange: OBJECT_IDENTIFIER = _OID.fromParts(
    [13],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdMustChange */

/* eslint-enable */
