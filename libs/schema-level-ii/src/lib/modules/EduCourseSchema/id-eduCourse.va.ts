/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_mace } from "../EduCourseSchema/id-mace.va";


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
const id_eduCourse: OBJECT_IDENTIFIER = _OID.fromParts([
    /* eduOrg */ 6,
], id_mace);
/* END_OF_SYMBOL_DEFINITION id_eduCourse */

/* eslint-enable */
