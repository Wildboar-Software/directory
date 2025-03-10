/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_pkix } from "../WLANCertExtn-2010/id-pkix.va";


/* START_OF_SYMBOL_DEFINITION id_aca */
/**
 * @summary id_aca
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aca              OBJECT IDENTIFIER ::= { id-pkix 10 }
 * ```
 *
 * @constant
 */
export
const id_aca: OBJECT_IDENTIFIER = new _OID([
    10,
], id_pkix);
/* END_OF_SYMBOL_DEFINITION id_aca */

/* eslint-enable */
