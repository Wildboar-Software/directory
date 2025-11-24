/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { caseExactIA5Match } from "@wildboar/x500/SelectedAttributeTypes";
import { directoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_eduOrgWhitePagesURI } from "../EduOrgSchema/id-at-eduOrgWhitePagesURI.va";





/* START_OF_SYMBOL_DEFINITION eduOrgWhitePagesURI */
/**
 * @summary eduOrgWhitePagesURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduOrgWhitePagesURI ATTRIBUTE ::= {
 *     WITH SYNTAX                    UnboundedDirectoryString
 *     EQUALITY MATCHING RULE        caseExactIA5Match
 *     LDAP-SYNTAX                    directoryString.&id
 *     LDAP-NAME                    {"eduOrgWhitePagesURI"}
 *     LDAP-DESC                    "eduOrg per Internet2 and EDUCAUSE"
 *     ID                            id-at-eduOrgWhitePagesURI
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const eduOrgWhitePagesURI: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseExactIA5Match /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "eduOrgWhitePagesURI" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "eduOrg per Internet2 and EDUCAUSE" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_eduOrgWhitePagesURI /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduOrgWhitePagesURI */

/* eslint-enable */
