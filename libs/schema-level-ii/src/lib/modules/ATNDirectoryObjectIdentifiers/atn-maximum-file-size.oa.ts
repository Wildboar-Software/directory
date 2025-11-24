/* eslint-disable */
import { ContentLength, _decode_ContentLength, _encode_ContentLength } from "@wildboar/x400/MTSAbstractService";
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { integer } from "@wildboar/x500/SelectedAttributeTypes";
import { integerMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { integerOrderingMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_atn_maximum_file_size } from "../ATNDirectoryObjectIdentifiers/id-at-atn-maximum-file-size.va";






/* START_OF_SYMBOL_DEFINITION atn_maximum_file_size */
/**
 * @summary atn_maximum_file_size
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-maximum-file-size ATTRIBUTE ::= {
 *     WITH SYNTAX                 ContentLength
 *     EQUALITY MATCHING RULE      integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                   {"atn-maximum-file-size"}
 *     ID                          id-at-atn-maximum-file-size
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ContentLength>}
 * @implements {ATTRIBUTE<ContentLength>}
 */
export
const atn_maximum_file_size: ATTRIBUTE<ContentLength> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_ContentLength,
    },
    encoderFor: {
        "&Type": _encode_ContentLength,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&ordering-match": integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": integer["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-maximum-file-size" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_maximum_file_size /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_maximum_file_size */

/* eslint-enable */
