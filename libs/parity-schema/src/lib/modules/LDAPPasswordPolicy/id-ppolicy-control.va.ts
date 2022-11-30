/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_ppolicy } from '../LDAPPasswordPolicy/id-ppolicy.va';
export { id_ppolicy } from '../LDAPPasswordPolicy/id-ppolicy.va';

/* START_OF_SYMBOL_DEFINITION id_ppolicy_control */
/**
 * @summary id_ppolicy_control
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ppolicy-control              OBJECT IDENTIFIER ::= { id-ppolicy 5 }
 * ```
 *
 * @constant
 */
export const id_ppolicy_control: OBJECT_IDENTIFIER = new _OID([5], id_ppolicy);
/* END_OF_SYMBOL_DEFINITION id_ppolicy_control */

/* eslint-enable */
