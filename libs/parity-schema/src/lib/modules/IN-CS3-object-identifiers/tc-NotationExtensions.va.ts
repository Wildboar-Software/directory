/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION tc_NotationExtensions */
/**
 * @summary tc_NotationExtensions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tc-NotationExtensions OBJECT IDENTIFIER ::= {itu-t recommendation q 775 modules(2) notation-extension(4) version1(1)}
 * ```
 *
 * @constant
 */
export const tc_NotationExtensions: OBJECT_IDENTIFIER = new _OID(
    [
        0, 0, 17, 775, /* modules */ 2, /* notation-extension */ 4,
        /* version1 */ 1,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION tc_NotationExtensions */

/* eslint-enable */
