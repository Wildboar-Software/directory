/* eslint-disable */
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { organization } from "@wildboar/x500/SelectedObjectClasses";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_facility_name } from "../ATNDirectoryObjectIdentifiers/atn-facility-name.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { id_oc_atn_Atn_Organization } from "./id-oc-atn-Atn-Organization.va";




/* START_OF_SYMBOL_DEFINITION atn_organization */
/**
 * @summary atn_organization
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-organization OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organization}
 *     MUST CONTAIN    {atn-facility-name}
 *     MAY CONTAIN     {atn-per-certificate | atn-der-certificate}
 *     ID              id-oc-atn-Organization
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_organization: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ organization, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_facility_name, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_Atn_Organization /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_organization */

/* eslint-enable */
