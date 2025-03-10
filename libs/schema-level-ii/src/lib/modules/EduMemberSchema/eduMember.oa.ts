/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { hasMember } from "../EduMemberSchema/hasMember.oa";
import { id_oc_eduMember } from "../EduMemberSchema/id-oc-eduMember.va";
import { isMemberOf } from "../EduMemberSchema/isMemberOf.oa";




/* START_OF_SYMBOL_DEFINITION eduMember */
/**
 * @summary eduMember
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduMember OBJECT-CLASS ::= {
 *     SUBCLASS OF            {top}
 *     KIND                auxiliary
 *     MAY CONTAIN            {isMemberOf | hasMember}
 *     LDAP-NAME            {"eduMember"}
 *     ID                    id-oc-eduMember
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const eduMember: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ isMemberOf, hasMember, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "eduMember" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_eduMember /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduMember */

/* eslint-enable */
