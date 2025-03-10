/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { integer } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa";
import { integerMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
import { integerOrderingMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerOrderingMatch.oa";
import {
    INTEGER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { id_at_atn_Version } from "./id-at-atn-Version.va";




/* START_OF_SYMBOL_DEFINITION atn_version */
/**
 * @summary atn_version
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-version ATTRIBUTE ::= {
 *     WITH SYNTAX                 INTEGER
 *     EQUALITY MATCHING RULE      integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                   {"atn-version"}
 *     ID                          id-at-atn-version
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<INTEGER>}
 * @implements {ATTRIBUTE<INTEGER>}
 */
export
const atn_version: ATTRIBUTE<INTEGER> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodeInteger,
    },
    encoderFor: {
        "&Type": $._encodeInteger,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&ordering-match": integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": integer["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-version" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_Version /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_version */

/* eslint-enable */
