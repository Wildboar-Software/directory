/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import { caseIgnoreMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { id_at_voPersonScopedAffiliation } from "../VOPerson/id-at-voPersonScopedAffiliation.va";





/* START_OF_SYMBOL_DEFINITION voPersonScopedAffiliation */
/**
 * @summary voPersonScopedAffiliation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonScopedAffiliation ATTRIBUTE ::= {
 *     WITH SYNTAX                    UnboundedDirectoryString
 *     EQUALITY MATCHING RULE        caseIgnoreMatch
 *     LDAP-SYNTAX                    directoryString.&id
 *     LDAP-NAME                    {"voPersonScopedAffiliation"}
 *     LDAP-DESC                    "voPerson Affiliation With Explicit Local Scope"
 *     ID                            id-at-voPersonScopedAffiliation
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export
const voPersonScopedAffiliation: ATTRIBUTE<UnboundedDirectoryString> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&Type": _encode_UnboundedDirectoryString,
    },
    "&equality-match": caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": directoryString["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonScopedAffiliation" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "voPerson Affiliation With Explicit Local Scope" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_voPersonScopedAffiliation /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonScopedAffiliation */

/* eslint-enable */
