/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION id_signerInfo */
/**
 * @summary id_signerInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-signerInfo           OBJECT IDENTIFIER ::= {itu-t recommendation(0) x(24) cms-profile(894) attribute(2) signerInfo(0)}
 * ```
 *
 * @constant
 */
export const id_signerInfo: OBJECT_IDENTIFIER = new _OID(
    [
        /* recommendation */ 0, /* x */ 24, /* cms-profile */ 894,
        /* attribute */ 2, /* signerInfo */ 0,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION id_signerInfo */

/* eslint-enable */
