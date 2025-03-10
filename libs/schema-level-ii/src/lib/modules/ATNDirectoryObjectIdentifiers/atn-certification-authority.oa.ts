/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { certificationAuthority } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/certificationAuthority.oa";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { id_oc_atn_CertificationAuthority } from "./id-oc-atn-CertificationAuthority.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { certificationAuthority } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/certificationAuthority.oa";
export { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
export { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";

/* START_OF_SYMBOL_DEFINITION atn_certification_authority */
/**
 * @summary atn_certification_authority
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-certification-authority OBJECT-CLASS ::= {
 *     SUBCLASS OF     {certificationAuthority}
 *     KIND            auxiliary
 *     MAY CONTAIN     {atn-per-certificate | atn-der-certificate}
 *     ID              id-oc-atn-certificationAuthority
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_certification_authority: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ certificationAuthority, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_CertificationAuthority /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_certification_authority */

/* eslint-enable */
