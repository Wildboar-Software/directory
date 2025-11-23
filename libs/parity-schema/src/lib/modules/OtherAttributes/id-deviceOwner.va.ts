/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_deviceOwner */
/**
 * @summary id_deviceOwner
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-deviceOwner                  OBJECT IDENTIFIER ::= { joint-iso-ccitt(2)
 *     country(16) us(840) organization(1) gov(101) dod(2) infosec(1) attributes(5)
 *     69 }
 * ```
 *
 * @constant
 */
export const id_deviceOwner: OBJECT_IDENTIFIER = _OID.fromParts([
    /* joint-iso-ccitt */ 2, /* country */ 16, /* us */ 840,
    /* organization */ 1, /* gov */ 101, /* dod */ 2, /* infosec */ 1,
    /* attributes */ 5, 69,
]);
/* END_OF_SYMBOL_DEFINITION id_deviceOwner */

/* eslint-enable */
