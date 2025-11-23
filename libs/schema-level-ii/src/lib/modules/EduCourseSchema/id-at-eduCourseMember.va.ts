/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_eduCourse } from "../EduCourseSchema/id-eduCourse.va";


/* START_OF_SYMBOL_DEFINITION id_at_eduCourseMember */
/**
 * @summary id_at_eduCourseMember
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-eduCourseMember       OBJECT IDENTIFIER ::= { id-eduCourse 1 2 }
 * ```
 *
 * @constant
 */
export
const id_at_eduCourseMember: OBJECT_IDENTIFIER = _OID.fromParts([
    1,
    2,
], id_eduCourse);
/* END_OF_SYMBOL_DEFINITION id_at_eduCourseMember */

/* eslint-enable */
