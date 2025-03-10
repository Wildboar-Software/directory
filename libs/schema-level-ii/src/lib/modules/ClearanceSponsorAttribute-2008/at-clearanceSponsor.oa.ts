/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { caseIgnoreMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { ClearanceSponsorType, _decode_ClearanceSponsorType, _encode_ClearanceSponsorType } from "../ClearanceSponsorAttribute-2008/ClearanceSponsorType.ta";
import { id_clearanceSponsor } from "../ClearanceSponsorAttribute-2008/id-clearanceSponsor.va";

/* START_OF_SYMBOL_DEFINITION at_clearanceSponsor */
/**
 * @summary at_clearanceSponsor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at-clearanceSponsor ATTRIBUTE ::= {
 *     WITH SYNTAX             ClearanceSponsorType
 *     EQUALITY MATCHING RULE  caseIgnoreMatch
 *     LDAP-SYNTAX             directoryString.&id
 *     LDAP-NAME               {"clearanceSponsor"}
 *     LDAP-DESC               "Clearance Sponsor per IETF RFC 5917"
 *     ID                      id-clearanceSponsor
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ClearanceSponsorType>}
 * @implements {ATTRIBUTE<ClearanceSponsorType>}
 */
export
const at_clearanceSponsor: ATTRIBUTE<ClearanceSponsorType> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_ClearanceSponsorType,
    },
    encoderFor: {
        "&Type": _encode_ClearanceSponsorType,
    },
    "&equality-match": caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "clearanceSponsor" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Clearance Sponsor per IETF RFC 5917" /* OBJECT_FIELD_SETTING */,
    "&id": id_clearanceSponsor /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION at_clearanceSponsor */

/* eslint-enable */
