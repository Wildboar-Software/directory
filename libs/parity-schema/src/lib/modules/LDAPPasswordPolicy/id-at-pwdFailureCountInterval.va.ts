/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';
export { id_ppolicy_at } from '../LDAPPasswordPolicy/id-ppolicy-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_pwdFailureCountInterval */
/**
 * @summary id_at_pwdFailureCountInterval
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-pwdFailureCountInterval   OBJECT IDENTIFIER ::= { id-ppolicy-at 12 }
 * ```
 *
 * @constant
 */
export const id_at_pwdFailureCountInterval: OBJECT_IDENTIFIER = _OID.fromParts(
    [12],
    id_ppolicy_at
);
/* END_OF_SYMBOL_DEFINITION id_at_pwdFailureCountInterval */

/* eslint-enable */
