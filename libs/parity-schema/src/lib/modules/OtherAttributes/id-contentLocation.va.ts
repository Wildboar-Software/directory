/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_contentLocation */
/**
 * @summary id_contentLocation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-contentLocation      OBJECT IDENTIFIER ::= {itu-t recommendation(0) x(24) cms-profile(894) attribute(2) contentLocation(2)}
 * ```
 *
 * @constant
 */
export const id_contentLocation: OBJECT_IDENTIFIER = _OID.fromParts(
    [
        /* recommendation */ 0, /* x */ 24, /* cms-profile */ 894,
        /* attribute */ 2, /* contentLocation */ 2,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION id_contentLocation */

/* eslint-enable */
