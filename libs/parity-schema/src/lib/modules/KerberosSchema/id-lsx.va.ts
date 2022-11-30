/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_kerberos } from '../KerberosSchema/id-kerberos.va';
export { id_kerberos } from '../KerberosSchema/id-kerberos.va';

/* START_OF_SYMBOL_DEFINITION id_lsx */
/**
 * @summary id_lsx
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-lsx  OBJECT IDENTIFIER ::= { id-kerberos 5 }
 * ```
 *
 * @constant
 */
export const id_lsx: OBJECT_IDENTIFIER = new _OID([5], id_kerberos);
/* END_OF_SYMBOL_DEFINITION id_lsx */

/* eslint-enable */
