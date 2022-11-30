/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION pilotObjectClass */
/**
 * @summary pilotObjectClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotObjectClass OBJECT IDENTIFIER ::= {
 *     itu-t(0)
 *     data(9)
 *     pss(2342)
 *     ucl(19200300)
 *     pilot(100)
 *     pilotAttributeType(4)
 * }
 * ```
 *
 * @constant
 */
export const pilotObjectClass: OBJECT_IDENTIFIER = new _OID([
    /* itu-t */ 0, /* data */ 9, /* pss */ 2342, /* ucl */ 19200300,
    /* pilot */ 100, /* pilotAttributeType */ 4,
]);
/* END_OF_SYMBOL_DEFINITION pilotObjectClass */

/* eslint-enable */
