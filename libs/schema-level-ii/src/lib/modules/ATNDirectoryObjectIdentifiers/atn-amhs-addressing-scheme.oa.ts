/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { integer } from "@wildboar/x500/SelectedAttributeTypes";
import { integerMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { integerOrderingMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { _decode_atn_amhs_addressing_scheme_Type, _encode_atn_amhs_addressing_scheme_Type, atn_amhs_addressing_scheme_Type } from "../ATNDirectoryObjectIdentifiers/atn-amhs-addressing-scheme-Type.ta";
import { id_at_atn_Amhs_addressing_scheme } from "../ATNDirectoryObjectIdentifiers/id-at-atn-Amhs-addressing-scheme.va";






/* START_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme */
/**
 * @summary atn_amhs_addressing_scheme
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhs-addressing-scheme ATTRIBUTE ::= {
 *     WITH SYNTAX                 INTEGER {xf(0), caas(1), other(2)}
 *     EQUALITY MATCHING RULE      integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                   {"atn-amhs-addressing-scheme"}
 *     ID                          id-at-atn-Amhs-addressing-scheme
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<atn_amhs_addressing_scheme_Type>}
 * @implements {ATTRIBUTE<atn_amhs_addressing_scheme_Type>}
 */
export
const atn_amhs_addressing_scheme: ATTRIBUTE<atn_amhs_addressing_scheme_Type> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_atn_amhs_addressing_scheme_Type,
    },
    encoderFor: {
        "&Type": _encode_atn_amhs_addressing_scheme_Type,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&ordering-match": integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": integer["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-amhs-addressing-scheme" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_Amhs_addressing_scheme /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme */

/* eslint-enable */
