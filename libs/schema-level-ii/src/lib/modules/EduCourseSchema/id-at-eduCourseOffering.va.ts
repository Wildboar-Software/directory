/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_eduCourse } from "../EduCourseSchema/id-eduCourse.va";


/* START_OF_SYMBOL_DEFINITION id_at_eduCourseOffering */
/**
 * @summary id_at_eduCourseOffering
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-eduCourseOffering     OBJECT IDENTIFIER ::= { id-eduCourse 1 1 }
 * ```
 *
 * @constant
 */
export
const id_at_eduCourseOffering: OBJECT_IDENTIFIER = _OID.fromParts([
    1,
    1,
], id_eduCourse);
/* END_OF_SYMBOL_DEFINITION id_at_eduCourseOffering */

/* eslint-enable */
