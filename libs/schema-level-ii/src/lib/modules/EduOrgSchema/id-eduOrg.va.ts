/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_mace } from "../EduOrgSchema/id-mace.va";


/* START_OF_SYMBOL_DEFINITION id_eduOrg */
/**
 * @summary id_eduOrg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-eduOrg                           OBJECT IDENTIFIER ::= { id-mace eduOrg(2) }
 * ```
 *
 * @constant
 */
export
const id_eduOrg: OBJECT_IDENTIFIER = _OID.fromParts([
    /* eduOrg */ 2,
], id_mace);
/* END_OF_SYMBOL_DEFINITION id_eduOrg */

/* eslint-enable */
