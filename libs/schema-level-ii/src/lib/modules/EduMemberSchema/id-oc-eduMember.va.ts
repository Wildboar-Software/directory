/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_eduMember } from "../EduMemberSchema/id-eduMember.va";
export { id_eduMember } from "../EduMemberSchema/id-eduMember.va";


/* START_OF_SYMBOL_DEFINITION id_oc_eduMember */
/**
 * @summary id_oc_eduMember
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-eduMember             OBJECT IDENTIFIER ::= { id-eduMember 2 1 }
 * ```
 *
 * @constant
 */
export
const id_oc_eduMember: OBJECT_IDENTIFIER = new _OID([
    2,
    1,
], id_eduMember);
/* END_OF_SYMBOL_DEFINITION id_oc_eduMember */

/* eslint-enable */
