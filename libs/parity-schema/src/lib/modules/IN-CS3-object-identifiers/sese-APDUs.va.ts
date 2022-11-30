/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION sese_APDUs */
/**
 * @summary sese_APDUs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sese-APDUs OBJECT IDENTIFIER ::= {joint-iso-itu-t genericULS(20) modules(1) seseAPDUs(6)}
 * ```
 *
 * @constant
 */
export const sese_APDUs: OBJECT_IDENTIFIER = new _OID(
    [/* genericULS */ 20, /* modules */ 1, /* seseAPDUs */ 6],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION sese_APDUs */

/* eslint-enable */
