/* eslint-disable */
import { mhs_user_agent } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user-agent.oa";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa";
import { id_oc_atn_AmhsUserAgent } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-AmhsUserAgent.va";




/* START_OF_SYMBOL_DEFINITION atn_amhs_user_agent */
/**
 * @summary atn_amhs_user_agent
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhs-user-agent OBJECT-CLASS ::= {
 *     SUBCLASS OF     {mhs-user-agent}
 *     MUST CONTAIN    {atn-ipm-heading-extensions}
 *     ID              id-oc-atn-AmhsUserAgent
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_amhs_user_agent: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ mhs_user_agent, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_ipm_heading_extensions, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_AmhsUserAgent /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhs_user_agent */

/* eslint-enable */
