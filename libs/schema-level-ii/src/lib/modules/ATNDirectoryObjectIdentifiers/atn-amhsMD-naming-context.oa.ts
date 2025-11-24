/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { caseIgnoreMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { caseIgnoreOrderingMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { caseIgnoreSubstringsMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { printableString } from "@wildboar/x500/SelectedAttributeTypes";
import {
    PrintableString
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { id_at_atn_AmhsMD_naming_context } from "../ATNDirectoryObjectIdentifiers/id-at-atn-AmhsMD-naming-context.va";




/* START_OF_SYMBOL_DEFINITION atn_amhsMD_naming_context */
/**
 * @summary atn_amhsMD_naming_context
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhsMD-naming-context ATTRIBUTE ::= {
 *     WITH SYNTAX                 PrintableString(SIZE(1..64))
 *     EQUALITY MATCHING RULE      caseIgnoreMatch
 *     ORDERING MATCHING RULE      caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 printableString.&id
 *     LDAP-NAME                   {"atn-amhsMD-naming-context"}
 *     ID                          id-at-atn-AmhsMD-naming-context
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PrintableString>}
 * @implements {ATTRIBUTE<PrintableString>}
 */
export
const atn_amhsMD_naming_context: ATTRIBUTE<PrintableString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodePrintableString,
    },
    encoderFor: {
        "&Type": $._encodePrintableString,
    },
    "&equality-match": caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    "&ordering-match": caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    "&substrings-match": caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": printableString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-amhsMD-naming-context" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_AmhsMD_naming_context /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhsMD_naming_context */

/* eslint-enable */
