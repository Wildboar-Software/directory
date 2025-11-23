/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ppolicy } from '../LDAPPasswordPolicy/id-ppolicy.va';
export { id_ppolicy } from '../LDAPPasswordPolicy/id-ppolicy.va';

/* START_OF_SYMBOL_DEFINITION id_ppolicy_oc */
/**
 * @summary id_ppolicy_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ppolicy-oc                   OBJECT IDENTIFIER ::= { id-ppolicy 2 }
 * ```
 *
 * @constant
 */
export const id_ppolicy_oc: OBJECT_IDENTIFIER = _OID.fromParts([2], id_ppolicy);
/* END_OF_SYMBOL_DEFINITION id_ppolicy_oc */

/* eslint-enable */
