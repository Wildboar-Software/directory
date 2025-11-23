/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { top } from "@wildboar/x500/InformationFramework";
import { eduCourseMember } from "../EduCourseSchema/eduCourseMember.oa";
import { eduCourseOffering } from "../EduCourseSchema/eduCourseOffering.oa";
import { id_oc_eduCourse } from "../EduCourseSchema/id-oc-eduCourse.va";




/* START_OF_SYMBOL_DEFINITION eduCourse */
/**
 * @summary eduCourse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduCourse OBJECT-CLASS ::= {
 *     SUBCLASS OF                {top}
 *     KIND                    auxiliary
 *     MAY CONTAIN                {eduCourseMember | eduCourseOffering}
 *     LDAP-NAME                {"eduCourse"}
 *     ID                        id-oc-eduCourse
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const eduCourse: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ eduCourseMember, eduCourseOffering, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "eduCourse" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_eduCourse /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduCourse */

/* eslint-enable */
