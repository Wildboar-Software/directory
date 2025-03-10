/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { organizationalUnit } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_facility_name } from "../ATNDirectoryObjectIdentifiers/atn-facility-name.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { id_oc_atn_OrganisationalUnit } from "./id-oc-atn-OrganisationalUnit.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { organizationalUnit } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa";
export { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
export { atn_facility_name } from "../ATNDirectoryObjectIdentifiers/atn-facility-name.oa";
export { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";

/* START_OF_SYMBOL_DEFINITION atn_organizational_unit */
/**
 * @summary atn_organizational_unit
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-organizational-unit OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organizationalUnit}
 *     MAY CONTAIN     {
 *         atn-per-certificate
 *         | atn-der-certificate
 *         | atn-facility-name
 *     }
 *     ID              id-oc-atn-OrganizationalUnit
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_organizational_unit: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ organizationalUnit, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, atn_facility_name, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_OrganisationalUnit /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_organizational_unit */

/* eslint-enable */
