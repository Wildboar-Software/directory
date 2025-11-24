/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { boolean_ } from "@wildboar/x500/SelectedAttributeTypes";
import { booleanMatch } from "@wildboar/x500/SelectedAttributeTypes";
import {
    BOOLEAN
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { id_at_atn_group_of_addresses } from "../ATNDirectoryObjectIdentifiers/id-at-atn-group-of-addresses.va";




/* START_OF_SYMBOL_DEFINITION atn_group_of_addresses */
/**
 * @summary atn_group_of_addresses
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-group-of-addresses ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE      booleanMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   {"atn-group-of-addresses"}
 *     ID                          id-at-atn-group-of-addresses
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export
const atn_group_of_addresses: ATTRIBUTE<BOOLEAN> = {
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
    "&ldapName": [ "atn-group-of-addresses" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_group_of_addresses /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_group_of_addresses */

/* eslint-enable */
