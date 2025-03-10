/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_mace } from "../EduCourseSchema/id-mace.va";
export { id_mace } from "../EduCourseSchema/id-mace.va";


/* START_OF_SYMBOL_DEFINITION id_eduCourse */
/**
 * @summary id_eduCourse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-eduCourse                OBJECT IDENTIFIER ::= { id-mace eduOrg(6) }
 * ```
 *
 * @constant
 */
export
const id_eduCourse: OBJECT_IDENTIFIER = new _OID([
    /* eduOrg */ 6,
], id_mace);
/* END_OF_SYMBOL_DEFINITION id_eduCourse */

/* eslint-enable */
