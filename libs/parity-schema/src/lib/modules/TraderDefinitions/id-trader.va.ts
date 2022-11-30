/* eslint-disable */
import {
    joint_iso_itu_t,
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION id_trader */
/**
 * @summary id_trader
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader OBJECT IDENTIFIER ::= {joint-iso-itu-t trader(100)}
 * ```
 *
 * @constant
 */
export const id_trader: OBJECT_IDENTIFIER = new _OID(
    [/* trader */ 100],
    joint_iso_itu_t
);
/* END_OF_SYMBOL_DEFINITION id_trader */

/* eslint-enable */
