/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_pen_internet2 } from "../EduOrgSchema/id-pen-internet2.va";


/* START_OF_SYMBOL_DEFINITION id_mace */
/**
 * @summary id_mace
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-mace                             OBJECT IDENTIFIER ::= { id-pen-internet2 mace(1) }
 * ```
 *
 * @constant
 */
export
const id_mace: OBJECT_IDENTIFIER = _OID.fromParts([
    /* mace */ 1,
], id_pen_internet2);
/* END_OF_SYMBOL_DEFINITION id_mace */

/* eslint-enable */
