/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdLastSuccess */
/**
 * @summary id_at_pwdLastSuccess
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdLastSuccess            OBJECT IDENTIFIER ::= { id-ppolicy-at 29 }
 * ```
 *
 * @constant
 */
export const id_at_pwdLastSuccess: OBJECT_IDENTIFIER = _OID.fromParts(
    [29],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdLastSuccess */

/* eslint-enable */
