/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { caseIgnoreMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa";
import { caseIgnoreOrderingMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreOrderingMatch.oa";
import { caseIgnoreSubstringsMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreSubstringsMatch.oa";
import { printableString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/printableString.oa";
import {
    PrintableString
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { id_at_atn_Net } from "../ATNDirectoryObjectIdentifiers/id-at-atn-Net.va";




/* START_OF_SYMBOL_DEFINITION atn_net */
/**
 * @summary atn_net
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-net ATTRIBUTE ::= {
 *     WITH SYNTAX                 PrintableString(SIZE(1..19))
 *     EQUALITY MATCHING RULE      caseIgnoreMatch
 *     ORDERING MATCHING RULE      caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreSubstringsMatch
 *     LDAP-SYNTAX                 printableString.&id
 *     LDAP-NAME                   {"atn-net"}
 *     ID                          id-at-atn-Net
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PrintableString>}
 * @implements {ATTRIBUTE<PrintableString>}
 */
export
const atn_net: ATTRIBUTE<PrintableString> = {
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
    "&ldapSyntax": printableString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-net" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_Net /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_net */

/* eslint-enable */
