/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy_control } from '../LDAPPasswordPolicy/id-ppolicy-control.va';

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
export const id_control_ppolicy: OBJECT_IDENTIFIER = _OID.fromParts(
    [1],
    id_ppolicy_control
);
/* END_OF_SYMBOL_DEFINITION id_control_ppolicy */

/* eslint-enable */
