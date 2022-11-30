/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy_control } from '../LDAPPasswordPolicy/id-ppolicy-control.va';
export { id_ppolicy_control } from '../LDAPPasswordPolicy/id-ppolicy-control.va';

/* START_OF_SYMBOL_DEFINITION id_control_ppolicy */
/**
 * @summary id_control_ppolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-control-ppolicy              OBJECT IDENTIFIER ::= { id-ppolicy-control 1 }
 * ```
 *
 * @constant
 */
export const id_control_ppolicy: OBJECT_IDENTIFIER = new _OID(
    [1],
    id_ppolicy_control
);
/* END_OF_SYMBOL_DEFINITION id_control_ppolicy */

/* eslint-enable */
