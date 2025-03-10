/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { boolean_ } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/boolean.oa";
import { booleanMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/booleanMatch.oa";
import {
    BOOLEAN
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { id_at_atn_use_of_amhs_security } from "../ATNDirectoryObjectIdentifiers/id-at-atn-use-of-amhs-security.va";




/* START_OF_SYMBOL_DEFINITION atn_use_of_amhs_security */
/**
 * @summary atn_use_of_amhs_security
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-use-of-amhs-security ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE      booleanMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   {"atn-use-of-amhs-security"}
 *     ID                          id-at-atn-use-of-amhs-security
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export
const atn_use_of_amhs_security: ATTRIBUTE<BOOLEAN> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodeBoolean,
    },
    encoderFor: {
        "&Type": $._encodeBoolean,
    },
    "&equality-match": booleanMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": boolean_["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-use-of-amhs-security" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_use_of_amhs_security /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_use_of_amhs_security */

/* eslint-enable */
