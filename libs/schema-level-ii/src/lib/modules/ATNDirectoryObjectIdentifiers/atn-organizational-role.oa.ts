/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { organizationalRole } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalRole.oa";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { id_oc_atn_OrganizationalRole } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-OrganizationalRole.va";


/* START_OF_SYMBOL_DEFINITION atn_organizational_role */
/**
 * @summary atn_organizational_role
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-organizational-role OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organizationalRole}
 *     MUST CONTAIN    {}
 *     MAY CONTAIN     {
 *         atn-per-certificate |
 *         atn-der-certificate
 *     }
 *     ID              id-oc-atn-OrganizationalRole
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_organizational_role: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ organizationalRole, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_OrganizationalRole /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_organizational_role */

/* eslint-enable */
