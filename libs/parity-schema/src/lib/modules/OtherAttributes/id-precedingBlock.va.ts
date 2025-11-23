/* eslint-disable */
import { itu_t, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_precedingBlock */
/**
 * @summary id_precedingBlock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-precedingBlock       OBJECT IDENTIFIER ::= {itu-t recommendation(0) x(24) cms-profile(894) attribute(2) precedingBlock(4)}
 * ```
 *
 * @constant
 */
export const id_precedingBlock: OBJECT_IDENTIFIER = _OID.fromParts(
    [
        /* recommendation */ 0, /* x */ 24, /* cms-profile */ 894,
        /* attribute */ 2, /* precedingBlock */ 4,
    ],
    itu_t
);
/* END_OF_SYMBOL_DEFINITION id_precedingBlock */

/* eslint-enable */
