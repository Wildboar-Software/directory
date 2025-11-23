/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_aa_signingCertificate */
/**
 * @summary id_aa_signingCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aa-signingCertificate OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9)
 *     smime(16) id-aa(2) 12 }
 * ```
 *
 * @constant
 */
export const id_aa_signingCertificate: OBJECT_IDENTIFIER = _OID.fromParts([
    /* iso */ 1, /* member-body */ 2, /* us */ 840, /* rsadsi */ 113549,
    /* pkcs */ 1, /* pkcs9 */ 9, /* smime */ 16, /* id-aa */ 2, 12,
]);
/* END_OF_SYMBOL_DEFINITION id_aa_signingCertificate */

/* eslint-enable */
