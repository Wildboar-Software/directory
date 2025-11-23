/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION ros_UsefulDefinitions */
/**
 * @summary ros_UsefulDefinitions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ros-UsefulDefinitions OBJECT IDENTIFIER ::= {joint-iso-itu-t remote-operations(4) useful-definitions(7) version1(0)}
 * ```
 *
 * @constant
 */
export const ros_UsefulDefinitions: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* remote-operations */ 4, /* useful-definitions */ 7, /* version1 */ 0],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION ros_UsefulDefinitions */

/* eslint-enable */
