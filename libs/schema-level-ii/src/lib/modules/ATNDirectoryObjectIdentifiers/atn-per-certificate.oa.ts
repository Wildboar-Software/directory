/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { octetString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa";
import { octetStringMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringMatch.oa";
import { octetStringSubstringsMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringSubstringsMatch.oa";
import {
    OCTET_STRING
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { id_at_atn_PerCertificate } from "../ATNDirectoryObjectIdentifiers/id-at-atn-PerCertificate.va";



/* START_OF_SYMBOL_DEFINITION atn_per_certificate */
/**
 * @summary atn_per_certificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-per-certificate ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING
 *     EQUALITY MATCHING RULE      octetStringMatch
 *     SUBSTRINGS MATCHING RULE    octetStringSubstringsMatch
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                   {"atn-per-certificate"}
 *     ID                          id-at-atn-PerCertificate
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export
const atn_per_certificate: ATTRIBUTE<OCTET_STRING> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodeOctetString,
    },
    encoderFor: {
        "&Type": $._encodeOctetString,
    },
    "&equality-match": octetStringMatch /* OBJECT_FIELD_SETTING */,
    "&substrings-match": octetStringSubstringsMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": octetString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-per-certificate" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_PerCertificate /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_per_certificate */

/* eslint-enable */
