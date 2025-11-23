/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_eduCourse } from "../EduCourseSchema/id-eduCourse.va";


/* START_OF_SYMBOL_DEFINITION id_oc_eduCourse */
/**
 * @summary id_oc_eduCourse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-eduCourse             OBJECT IDENTIFIER ::= { id-eduCourse 2 1 }
 * ```
 *
 * @constant
 */
export
const id_oc_eduCourse: OBJECT_IDENTIFIER = _OID.fromParts([
    2,
    1,
], id_eduCourse);
/* END_OF_SYMBOL_DEFINITION id_oc_eduCourse */

/* eslint-enable */
