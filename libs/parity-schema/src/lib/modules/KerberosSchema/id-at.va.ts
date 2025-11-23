/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_kerberos } from '../KerberosSchema/id-kerberos.va';
export { id_kerberos } from '../KerberosSchema/id-kerberos.va';

/* START_OF_SYMBOL_DEFINITION id_at */
/**
 * @summary id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at   OBJECT IDENTIFIER ::= { id-kerberos 4 }
 * ```
 *
 * @constant
 */
export const id_at: OBJECT_IDENTIFIER = _OID.fromParts([4], id_kerberos);
/* END_OF_SYMBOL_DEFINITION id_at */

/* eslint-enable */
