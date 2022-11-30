/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION id_kerberos */
/**
 * @summary id_kerberos
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-kerberos OBJECT IDENTIFIER ::= {
 *     joint-iso-ccitt(2)
 *     country(16)
 *     us(840)
 *     organization(1)
 *     novell(113719)
 *     applications(1)
 *     kerberos(301)
 * }
 * ```
 *
 * @constant
 */
export const id_kerberos: OBJECT_IDENTIFIER = new _OID([
    /* joint-iso-ccitt */ 2, /* country */ 16, /* us */ 840,
    /* organization */ 1, /* novell */ 113719, /* applications */ 1,
    /* kerberos */ 301,
]);
/* END_OF_SYMBOL_DEFINITION id_kerberos */

/* eslint-enable */
