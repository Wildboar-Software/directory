/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { integer } from "@wildboar/x500/SelectedAttributeTypes";
import { integerMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { integerOrderingMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { BinarySigningTime, _decode_BinarySigningTime, _encode_BinarySigningTime } from "./BinarySigningTime.ta";
import { id_aa_binarySigningTime } from "./id-aa-binarySigningTime.va";




/* START_OF_SYMBOL_DEFINITION aa_binarySigningTime */
/**
 * @summary aa_binarySigningTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-binarySigningTime ATTRIBUTE ::= {
 *     WITH SYNTAX             BinarySigningTime
 *     EQUALITY MATCHING RULE  integerMatch
 *     ORDERING MATCHING RULE  integerOrderingMatch
 *     SINGLE VALUE            TRUE
 *     LDAP-SYNTAX             integer.&id
 *     LDAP-NAME               {"binarySigningTime"}
 *     LDAP-DESC               "The number seconds since midnight Jan 1, 1970 UTC."
 *     ID                      id-aa-binarySigningTime
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BinarySigningTime>}
 * @implements {ATTRIBUTE<BinarySigningTime>}
 */
export
const aa_binarySigningTime: ATTRIBUTE<BinarySigningTime> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_BinarySigningTime,
    },
    encoderFor: {
        "&Type": _encode_BinarySigningTime,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&ordering-match": integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": integer["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "binarySigningTime" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "The number seconds since midnight Jan 1, 1970 UTC." /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_binarySigningTime /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION aa_binarySigningTime */

/* eslint-enable */
