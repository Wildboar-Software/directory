/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdMaxAge */
/**
 * @summary id_at_pwdMaxAge
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdMaxAge                 OBJECT IDENTIFIER ::= { id-ppolicy-at 3 }
 * ```
 *
 * @constant
 */
export const id_at_pwdMaxAge: OBJECT_IDENTIFIER = _OID.fromParts([3], id_ppolicy_at);
/* END_OF_SYMBOL_DEFINITION id_at_pwdMaxAge */

/* eslint-enable */
