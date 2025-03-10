/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { atn_amhsMD_naming_context } from "../ATNDirectoryObjectIdentifiers/atn-amhsMD-naming-context.oa";
import { atn_global_domain_identifier } from "../ATNDirectoryObjectIdentifiers/atn-global-domain-identifier.oa";
import { atn_icao_designator } from "../ATNDirectoryObjectIdentifiers/atn-icao-designator.oa";
import { id_oc_atn_amhsMD } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-amhsMD.va";
import { atn_amhs_addressing_scheme } from "./atn-amhs-addressing-scheme.oa";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { atn_amhsMD_naming_context } from "../ATNDirectoryObjectIdentifiers/atn-amhsMD-naming-context.oa";
export { atn_global_domain_identifier } from "../ATNDirectoryObjectIdentifiers/atn-global-domain-identifier.oa";
export { atn_icao_designator } from "../ATNDirectoryObjectIdentifiers/atn-icao-designator.oa";
export { id_oc_atn_amhsMD } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-amhsMD.va";

/* START_OF_SYMBOL_DEFINITION atn_amhsMD */
/**
 * @summary atn_amhsMD
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhsMD OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {
 *         commonName
 *         | atn-global-domain-identifier
 *         | atn-icao-designator
 *         | atn-amhsMD-addressing-scheme
 *     }
 *     MAY CONTAIN     {atn-amhsMD-naming-context}
 *     ID              id-oc-atn-amhsMD
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_amhsMD: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, atn_global_domain_identifier, atn_icao_designator, atn_amhs_addressing_scheme, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_amhsMD_naming_context, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_amhsMD /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhsMD */

/* eslint-enable */
