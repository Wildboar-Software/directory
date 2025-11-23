/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { caseExactMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { directoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_hasMember } from "../EduMemberSchema/id-at-hasMember.va";





/* START_OF_SYMBOL_DEFINITION hasMember */
/**
 * @summary hasMember
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * hasMember ATTRIBUTE ::= {
 *     WITH SYNTAX                UnboundedDirectoryString
 *     EQUALITY MATCHING RULE  caseExactMatch
 *     LDAP-SYNTAX                directoryString.&id
 *     LDAP-NAME                {"hasMember"}
 *     LDAP-DESC               "identifiers for entities that are members of the group"
 *     OBSOLETE                TRUE
 *     ID                        id-at-hasMember
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const hasMember: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseExactMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "hasMember" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "identifiers for entities that are members of the group" /* OBJECT_FIELD_SETTING */,
    "&obsolete": true /* OBJECT_FIELD_SETTING */,
    "&id": id_at_hasMember /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION hasMember */

/* eslint-enable */
