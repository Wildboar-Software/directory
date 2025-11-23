/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION contexts */
/**
 * @summary contexts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * contexts OBJECT IDENTIFIER ::= {itu-t recommendation q 1218 modules(0) contexts(8) selectedContexts(1)
 *    version(1)}
 * ```
 *
 * @constant
 */
export const contexts: OBJECT_IDENTIFIER = _OID.fromParts(
    [
        0, 0, 17, 1218, /* modules */ 0, /* contexts */ 8,
        /* selectedContexts */ 1, /* version */ 1,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION contexts */

/* eslint-enable */
