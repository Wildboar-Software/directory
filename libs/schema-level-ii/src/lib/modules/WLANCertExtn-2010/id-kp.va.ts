/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_pkix } from "../WLANCertExtn-2010/id-pkix.va";
export { id_pkix } from "../WLANCertExtn-2010/id-pkix.va";


/* START_OF_SYMBOL_DEFINITION id_kp */
/**
 * @summary id_kp
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-kp               OBJECT IDENTIFIER ::= { id-pkix  3 }
 * ```
 *
 * @constant
 */
export
const id_kp: OBJECT_IDENTIFIER = new _OID([
    3,
], id_pkix);
/* END_OF_SYMBOL_DEFINITION id_kp */

/* eslint-enable */
