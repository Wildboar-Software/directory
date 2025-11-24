/* eslint-disable */
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { top } from "@wildboar/x500/InformationFramework";
import { VOPersonAttributes } from "../VOPerson/VOPersonAttributes.osa";
import { id_oc_voPersonObjectClass } from "../VOPerson/id-oc-voPersonObjectClass.va";




/* START_OF_SYMBOL_DEFINITION voPersonObjectClass */
/**
 * @summary voPersonObjectClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonObjectClass OBJECT-CLASS ::= {
 *     SUBCLASS OF            {top}
 *     KIND                auxiliary
 *     MAY CONTAIN            {VOPersonAttributes}
 *     LDAP-NAME            {"voPersonObjectClass"}
 *     LDAP-DESC            "REFEDS Virtual Organization Person"
 *     ID                    id-oc-voPersonObjectClass
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const voPersonObjectClass: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ...VOPersonAttributes, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonObjectClass" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "REFEDS Virtual Organization Person" /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_voPersonObjectClass /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonObjectClass */

/* eslint-enable */
