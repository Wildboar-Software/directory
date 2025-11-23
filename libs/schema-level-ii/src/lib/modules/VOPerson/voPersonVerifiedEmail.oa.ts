/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { caseIgnoreMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { directoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_voPersonVerifiedEmail } from "../VOPerson/id-at-voPersonVerifiedEmail.va";





/* START_OF_SYMBOL_DEFINITION voPersonVerifiedEmail */
/**
 * @summary voPersonVerifiedEmail
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonVerifiedEmail ATTRIBUTE ::= {
 *     WITH SYNTAX                    UnboundedDirectoryString
 *     EQUALITY MATCHING RULE        caseIgnoreMatch
 *     LDAP-SYNTAX                    directoryString.&id
 *     LDAP-NAME                    {"voPersonVerifiedEmail"}
 *     LDAP-DESC                    "voPerson Verified Email Address"
 *     ID                            id-at-voPersonVerifiedEmail
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const voPersonVerifiedEmail: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonVerifiedEmail" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "voPerson Verified Email Address" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_voPersonVerifiedEmail /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonVerifiedEmail */

/* eslint-enable */
