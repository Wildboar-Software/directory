/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_pkix } from "../WLANCertExtn-2010/id-pkix.va";
export { id_pkix } from "../WLANCertExtn-2010/id-pkix.va";


/* START_OF_SYMBOL_DEFINITION id_pe */
/**
 * @summary id_pe
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pe               OBJECT IDENTIFIER ::= { id-pkix  1 }
 * ```
 *
 * @constant
 */
export
const id_pe: OBJECT_IDENTIFIER = new _OID([
    1,
], id_pkix);
/* END_OF_SYMBOL_DEFINITION id_pe */

/* eslint-enable */
