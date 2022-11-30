/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';

/* START_OF_SYMBOL_DEFINITION id_parentBlock */
/**
 * @summary id_parentBlock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-parentBlock          OBJECT IDENTIFIER ::= {itu-t recommendation(0) x(24) cms-profile(894) attribute(2) parentBlock(7)}
 * ```
 *
 * @constant
 */
export const id_parentBlock: OBJECT_IDENTIFIER = new _OID(
    [
        /* recommendation */ 0, /* x */ 24, /* cms-profile */ 894,
        /* attribute */ 2, /* parentBlock */ 7,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION id_parentBlock */

/* eslint-enable */
