/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { eduCourseMember } from "../EduCourseSchema/eduCourseMember.oa";
import { eduCourseOffering } from "../EduCourseSchema/eduCourseOffering.oa";
import { id_oc_eduCourse } from "../EduCourseSchema/id-oc-eduCourse.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { eduCourseMember } from "../EduCourseSchema/eduCourseMember.oa";
export { eduCourseOffering } from "../EduCourseSchema/eduCourseOffering.oa";
export { id_oc_eduCourse } from "../EduCourseSchema/id-oc-eduCourse.va";


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
