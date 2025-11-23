/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION pilotAttributeType */
/**
 * @summary pilotAttributeType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotAttributeType OBJECT IDENTIFIER ::= {
 *     itu-t(0)
 *     data(9)
 *     pss(2342)
 *     ucl(19200300)
 *     pilot(100)
 *     pilotAttributeType(1)
 * }
 * ```
 *
 * @constant
 */
export const pilotAttributeType: OBJECT_IDENTIFIER = _OID.fromParts([
    /* itu-t */ 0, /* data */ 9, /* pss */ 2342, /* ucl */ 19200300,
    /* pilot */ 100, /* pilotAttributeType */ 1,
]);
/* END_OF_SYMBOL_DEFINITION pilotAttributeType */

/* eslint-enable */
