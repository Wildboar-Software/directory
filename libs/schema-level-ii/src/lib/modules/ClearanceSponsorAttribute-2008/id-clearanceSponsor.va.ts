/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";

/* START_OF_SYMBOL_DEFINITION id_clearanceSponsor */
/**
 * @summary id_clearanceSponsor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-clearanceSponsor OBJECT IDENTIFIER ::= {
 *     joint-iso-ccitt(2) country(16) us(840) organization(1) gov(101)
 *     dod(2) infosec(1) attributes(5) 68 }
 * ```
 *
 * @constant
 */
export
const id_clearanceSponsor: OBJECT_IDENTIFIER = _OID.fromParts([
    /* joint-iso-ccitt */ 2,
    /* country */ 16,
    /* us */ 840,
    /* organization */ 1,
    /* gov */ 101,
    /* dod */ 2,
    /* infosec */ 1,
    /* attributes */ 5,
    68,
]);
/* END_OF_SYMBOL_DEFINITION id_clearanceSponsor */

/* eslint-enable */
