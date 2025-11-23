/* eslint-disable */
import { mhs_or_addresses } from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { id_at_atn_amhs_global_domain_identifier } from "./id-at-atn-amhs-global-domain-identifier.va";



/* START_OF_SYMBOL_DEFINITION atn_global_domain_identifier */
/**
 * @summary atn_global_domain_identifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-global-domain-identifier ATTRIBUTE ::= {
 *     SUBTYPE OF                  mhs-or-addresses
 *     SINGLE VALUE                TRUE
 *     ID                          id-at-atn-amhs-global-domain-identifier
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export
const atn_global_domain_identifier: ATTRIBUTE = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": undefined,
    },
    encoderFor: {
        "&Type": undefined,
    },
    "&derivation": mhs_or_addresses /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_amhs_global_domain_identifier /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_global_domain_identifier */

/* eslint-enable */
