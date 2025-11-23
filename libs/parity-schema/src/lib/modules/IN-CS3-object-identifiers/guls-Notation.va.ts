/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION guls_Notation */
/**
 * @summary guls_Notation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * guls-Notation OBJECT IDENTIFIER ::= {joint-iso-itu-t genericULS(20) modules(1) notation(1)}
 * ```
 *
 * @constant
 */
export const guls_Notation: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* genericULS */ 20, /* modules */ 1, /* notation */ 1],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION guls_Notation */

/* eslint-enable */
