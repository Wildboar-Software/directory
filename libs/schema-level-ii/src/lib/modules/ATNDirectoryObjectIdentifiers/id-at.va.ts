/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";


/* START_OF_SYMBOL_DEFINITION id_at */
/**
 * @summary id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at OBJECT IDENTIFIER ::= {iso(1) identified-organisation(3) icao(27) atn-directory(7) at 1}
 * ```
 *
 * @constant
 */
export
const id_at: OBJECT_IDENTIFIER = _OID.fromParts([
    /* iso */ 1,
    /* identified-organisation */ 3,
    /* icao */ 27,
    /* atn-directory */ 7,
    1,
]);
/* END_OF_SYMBOL_DEFINITION id_at */

/* eslint-enable */
