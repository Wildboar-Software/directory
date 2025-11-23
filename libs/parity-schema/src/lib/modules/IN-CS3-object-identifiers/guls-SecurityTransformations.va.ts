/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION guls_SecurityTransformations */
/**
 * @summary guls_SecurityTransformations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * guls-SecurityTransformations OBJECT IDENTIFIER ::= {joint-iso-itu-t genericULS(20) modules(1) gulsSecurityTransformations(3)}
 * ```
 *
 * @constant
 */
export const guls_SecurityTransformations: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* genericULS */ 20, /* modules */ 1, /* gulsSecurityTransformations */ 3],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION guls_SecurityTransformations */

/* eslint-enable */
