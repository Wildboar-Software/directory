/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_mace } from "../EduMemberSchema/id-mace.va";


/* START_OF_SYMBOL_DEFINITION id_eduMember */
/**
 * @summary id_eduMember
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-eduMember                OBJECT IDENTIFIER ::= { id-mace eduMember(5) }
 * ```
 *
 * @constant
 */
export
const id_eduMember: OBJECT_IDENTIFIER = new _OID([
    /* eduMember */ 5,
], id_mace);
/* END_OF_SYMBOL_DEFINITION id_eduMember */

/* eslint-enable */
