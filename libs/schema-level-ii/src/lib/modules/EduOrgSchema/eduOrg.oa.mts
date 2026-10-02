/* eslint-disable */
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { top } from "@wildboar/x500/InformationFramework";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import { eduOrgHomePageURI } from "../EduOrgSchema/eduOrgHomePageURI.oa.mjs";
import { eduOrgIdentityAuthNPolicyURI } from "../EduOrgSchema/eduOrgIdentityAuthNPolicyURI.oa.mjs";
import { eduOrgLegalName } from "../EduOrgSchema/eduOrgLegalName.oa.mjs";
import { eduOrgSuperiorURI } from "../EduOrgSchema/eduOrgSuperiorURI.oa.mjs";
import { eduOrgWhitePagesURI } from "../EduOrgSchema/eduOrgWhitePagesURI.oa.mjs";
import { id_oc_eduOrg } from "../EduOrgSchema/id-oc-eduOrg.va.mjs";






/* START_OF_SYMBOL_DEFINITION eduOrg */
/**
 * @summary eduOrg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduOrg OBJECT-CLASS ::= {
 *     SUBCLASS OF            {top}
 *     KIND                auxiliary
 *     MAY CONTAIN            {
 *         commonName
 *         | eduOrgHomePageURI
 *         | eduOrgIdentityAuthNPolicyURI
 *         | eduOrgLegalName
 *         | eduOrgSuperiorURI
 *         | eduOrgWhitePagesURI
 *     }
 *     LDAP-NAME            {"eduOrg"}
 *     ID                    id-oc-eduOrg
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const eduOrg: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ commonName, eduOrgHomePageURI, eduOrgIdentityAuthNPolicyURI, eduOrgLegalName, eduOrgSuperiorURI, eduOrgWhitePagesURI, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "eduOrg" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_eduOrg /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduOrg */

/* eslint-enable */
