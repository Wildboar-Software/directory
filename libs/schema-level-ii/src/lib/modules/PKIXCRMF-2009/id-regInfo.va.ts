/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_pkip } from "../PKIXCRMF-2009/id-pkip.va";


/* START_OF_SYMBOL_DEFINITION id_regInfo */
/**
 * @summary id_regInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-regInfo OBJECT IDENTIFIER ::= { id-pkip 2 }
 * ```
 *
 * @constant
 */
export
const id_regInfo: OBJECT_IDENTIFIER = new _OID([
    2,
], id_pkip);
/* END_OF_SYMBOL_DEFINITION id_regInfo */

/* eslint-enable */
