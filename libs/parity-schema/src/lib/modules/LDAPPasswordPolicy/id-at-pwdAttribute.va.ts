/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdAttribute */
/**
 * @summary id_at_pwdAttribute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdAttribute              OBJECT IDENTIFIER ::= { id-ppolicy-at 1 }
 * ```
 *
 * @constant
 */
export const id_at_pwdAttribute: OBJECT_IDENTIFIER = _OID.fromParts(
    [1],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdAttribute */

/* eslint-enable */
