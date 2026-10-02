/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";


/* START_OF_SYMBOL_DEFINITION id_aa_wrappedFirmwareKey */
/**
 * @summary id_aa_wrappedFirmwareKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aa-wrappedFirmwareKey OBJECT IDENTIFIER ::= {
 *     iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9)
 *     smime(16) aa(2) 39 }
 * ```
 *
 * @constant
 */
export
const id_aa_wrappedFirmwareKey: OBJECT_IDENTIFIER = _OID.fromParts([
    /* iso */ 1,
    /* member-body */ 2,
    /* us */ 840,
    /* rsadsi */ 113549,
    /* pkcs */ 1,
    /* pkcs9 */ 9,
    /* smime */ 16,
    /* aa */ 2,
    39,
]);
/* END_OF_SYMBOL_DEFINITION id_aa_wrappedFirmwareKey */

/* eslint-enable */
