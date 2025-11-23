/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { boolean_ } from "@wildboar/x500/SelectedAttributeTypes";
import { booleanMatch } from "@wildboar/x500/SelectedAttributeTypes";
import {
    BOOLEAN
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { id_at_atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/id-at-atn-ipm-heading-extensions.va";




/* START_OF_SYMBOL_DEFINITION atn_ipm_heading_extensions */
/**
 * @summary atn_ipm_heading_extensions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-ipm-heading-extensions ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE      booleanMatch
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   {"atn-ipm-heading-extensions"}
 *     ID                          id-at-atn-ipm-heading-extensions
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export
const atn_ipm_heading_extensions: ATTRIBUTE<BOOLEAN> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodeBoolean,
    },
    encoderFor: {
        "&Type": $._encodeBoolean,
    },
    "&equality-match": booleanMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": boolean_["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-ipm-heading-extensions" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_ipm_heading_extensions /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_ipm_heading_extensions */

/* eslint-enable */
