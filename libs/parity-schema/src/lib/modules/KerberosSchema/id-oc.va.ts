/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_kerberos } from '../KerberosSchema/id-kerberos.va';
export { id_kerberos } from '../KerberosSchema/id-kerberos.va';

/* START_OF_SYMBOL_DEFINITION id_oc */
/**
 * @summary id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc   OBJECT IDENTIFIER ::= { id-kerberos 6 }
 * ```
 *
 * @constant
 */
export const id_oc: OBJECT_IDENTIFIER = _OID.fromParts([6], id_kerberos);
/* END_OF_SYMBOL_DEFINITION id_oc */

/* eslint-enable */
