/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { caseIgnoreMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { directoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_voPersonApplicationUID } from "../VOPerson/id-at-voPersonApplicationUID.va";





/* START_OF_SYMBOL_DEFINITION voPersonApplicationUID */
/**
 * @summary voPersonApplicationUID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonApplicationUID ATTRIBUTE ::= {
 *     WITH SYNTAX                    UnboundedDirectoryString
 *     EQUALITY MATCHING RULE        caseIgnoreMatch
 *     LDAP-SYNTAX                    directoryString.&id
 *     LDAP-NAME                    {"voPersonApplicationUID"}
 *     LDAP-DESC                    "voPerson Application-Specific User Identifier"
 *     ID                            id-at-voPersonApplicationUID
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const voPersonApplicationUID: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonApplicationUID" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "voPerson Application-Specific User Identifier" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_voPersonApplicationUID /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonApplicationUID */

/* eslint-enable */
