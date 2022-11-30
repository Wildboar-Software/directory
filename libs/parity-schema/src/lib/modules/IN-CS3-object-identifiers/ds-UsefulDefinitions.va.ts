/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION ds_UsefulDefinitions */
/**
 * @summary ds_UsefulDefinitions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ds-UsefulDefinitions OBJECT IDENTIFIER ::= {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 3}
 * ```
 *
 * @constant
 */
export const ds_UsefulDefinitions: OBJECT_IDENTIFIER = new _OID(
    [/* ds */ 5, /* module */ 1, /* usefulDefinitions */ 0, 3],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION ds_UsefulDefinitions */

/* eslint-enable */
