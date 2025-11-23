/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_pe } from "./id-pe.va";

/* START_OF_SYMBOL_DEFINITION id_pe_wlanSSID */
/**
 * @summary id_pe_wlanSSID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pe-wlanSSID      OBJECT IDENTIFIER ::= { id-pe 13 }
 * ```
 *
 * @constant
 */
export
const id_pe_wlanSSID: OBJECT_IDENTIFIER = _OID.fromParts([
    13,
], id_pe);
/* END_OF_SYMBOL_DEFINITION id_pe_wlanSSID */

/* eslint-enable */
