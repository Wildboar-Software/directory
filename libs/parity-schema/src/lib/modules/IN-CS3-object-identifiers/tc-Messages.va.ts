/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION tc_Messages */
/**
 * @summary tc_Messages
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tc-Messages OBJECT IDENTIFIER ::= {itu-t recommendation q 773 modules(2) messages(1) version3(3)}
 * ```
 *
 * @constant
 */
export const tc_Messages: OBJECT_IDENTIFIER = _OID.fromParts(
    [0, 0, 17, 773, /* modules */ 2, /* messages */ 1, /* version3 */ 3],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION tc_Messages */

/* eslint-enable */
