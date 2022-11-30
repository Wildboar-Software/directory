/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

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
export const tc_Messages: OBJECT_IDENTIFIER = new _OID(
    [0, 0, 17, 773, /* modules */ 2, /* messages */ 1, /* version3 */ 3],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION tc_Messages */

/* eslint-enable */
