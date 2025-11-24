/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdInHistory */
/**
 * @summary id_at_pwdInHistory
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdInHistory              OBJECT IDENTIFIER ::= { id-ppolicy-at 4 }
 * ```
 *
 * @constant
 */
export const id_at_pwdInHistory: OBJECT_IDENTIFIER = _OID.fromParts(
    [4],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdInHistory */

/* eslint-enable */
