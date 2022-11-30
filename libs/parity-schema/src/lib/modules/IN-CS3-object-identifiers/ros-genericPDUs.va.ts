/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION ros_genericPDUs */
/**
 * @summary ros_genericPDUs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ros-genericPDUs OBJECT IDENTIFIER ::= {joint-iso-itu-t remote-operations(4) generic-ROS-PDUs(6) version1(0)}
 * ```
 *
 * @constant
 */
export const ros_genericPDUs: OBJECT_IDENTIFIER = new _OID(
    [/* remote-operations */ 4, /* generic-ROS-PDUs */ 6, /* version1 */ 0],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION ros_genericPDUs */

/* eslint-enable */
