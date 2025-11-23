/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_ct } from "../PKIXCRMF-2009/id-ct.va";


/* START_OF_SYMBOL_DEFINITION id_ct_encKeyWithID */
/**
 * @summary id_ct_encKeyWithID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ct-encKeyWithID OBJECT IDENTIFIER ::= {id-ct 21}
 * ```
 *
 * @constant
 */
export
const id_ct_encKeyWithID: OBJECT_IDENTIFIER = _OID.fromParts([
    21,
], id_ct);
/* END_OF_SYMBOL_DEFINITION id_ct_encKeyWithID */

/* eslint-enable */
