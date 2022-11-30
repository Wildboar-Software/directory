/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION ros_InformationObjects */
/**
 * @summary ros_InformationObjects
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ros-InformationObjects OBJECT IDENTIFIER ::= {joint-iso-itu-t remote-operations(4) informationObjects(5) version1(0)}
 * ```
 *
 * @constant
 */
export const ros_InformationObjects: OBJECT_IDENTIFIER = new _OID(
    [/* remote-operations */ 4, /* informationObjects */ 5, /* version1 */ 0],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION ros_InformationObjects */

/* eslint-enable */
