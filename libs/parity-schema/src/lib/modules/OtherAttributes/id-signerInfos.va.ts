/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_signerInfos */
/**
 * @summary id_signerInfos
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-signerInfos             OBJECT IDENTIFIER ::= {itu-t recommendation(0) x(24) cms-profile(894) attribute(2) signerInfos(1)}
 * ```
 *
 * @constant
 */
export const id_signerInfos: OBJECT_IDENTIFIER = _OID.fromParts(
    [
        /* recommendation */ 0, /* x */ 24, /* cms-profile */ 894,
        /* attribute */ 2, /* signerInfos */ 1,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION id_signerInfos */

/* eslint-enable */
