/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import { caseExactIA5Match } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactIA5Match.oa";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { id_at_eduOrgIdentityAuthNPolicyURI } from "../EduOrgSchema/id-at-eduOrgIdentityAuthNPolicyURI.va";





/* START_OF_SYMBOL_DEFINITION eduOrgIdentityAuthNPolicyURI */
/**
 * @summary eduOrgIdentityAuthNPolicyURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduOrgIdentityAuthNPolicyURI ATTRIBUTE ::= {
 *     WITH SYNTAX                    UnboundedDirectoryString
 *     EQUALITY MATCHING RULE        caseExactIA5Match
 *     LDAP-SYNTAX                    directoryString.&id
 *     LDAP-NAME                    {"eduOrgIdentityAuthNPolicyURI"}
 *     LDAP-DESC                    "eduOrg per Internet2 and EDUCAUSE"
 *     ID                            id-at-eduOrgIdentityAuthNPolicyURI
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const eduOrgIdentityAuthNPolicyURI: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseExactIA5Match /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "eduOrgIdentityAuthNPolicyURI" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "eduOrg per Internet2 and EDUCAUSE" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_eduOrgIdentityAuthNPolicyURI /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduOrgIdentityAuthNPolicyURI */

/* eslint-enable */
