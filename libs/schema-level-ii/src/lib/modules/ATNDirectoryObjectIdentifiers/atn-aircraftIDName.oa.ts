/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { integer } from "@wildboar/x500/SelectedAttributeTypes";
import { integerMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { integerOrderingMatch } from "@wildboar/x500/SelectedAttributeTypes";
import {
    INTEGER
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { id_at_atn_aircraftIDName } from "../ATNDirectoryObjectIdentifiers/id-at-atn-aircraftIDName.va";





/* START_OF_SYMBOL_DEFINITION atn_aircraftIDName */
/**
 * @summary atn_aircraftIDName
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-aircraftIDName ATTRIBUTE ::= {
 *     WITH SYNTAX                 INTEGER(0..16777215)
 *     EQUALITY MATCHING RULE      integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                   {"atn-aircraftIDName"}
 *     ID                          id-at-atn-aircraftIDName
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<INTEGER>}
 * @implements {ATTRIBUTE<INTEGER>}
 */
export
const atn_aircraftIDName: ATTRIBUTE<INTEGER> = {
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
    "&ldapName": [ "atn-aircraftIDName" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_aircraftIDName /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_aircraftIDName */

/* eslint-enable */
