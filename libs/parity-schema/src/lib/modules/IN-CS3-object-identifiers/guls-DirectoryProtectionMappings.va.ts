/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION guls_DirectoryProtectionMappings */
/**
 * @summary guls_DirectoryProtectionMappings
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * guls-DirectoryProtectionMappings OBJECT IDENTIFIER ::= {joint-iso-itu-t genericULS(20) modules(1) dirProtectionMappings(4)}
 * ```
 *
 * @constant
 */
export const guls_DirectoryProtectionMappings: OBJECT_IDENTIFIER = new _OID(
    [/* genericULS */ 20, /* modules */ 1, /* dirProtectionMappings */ 4],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION guls_DirectoryProtectionMappings */

/* eslint-enable */
