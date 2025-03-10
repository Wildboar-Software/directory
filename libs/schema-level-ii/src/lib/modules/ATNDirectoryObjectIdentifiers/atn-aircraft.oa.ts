/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { atn_aircraftIDName } from "../ATNDirectoryObjectIdentifiers/atn-aircraftIDName.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { id_oc_atn_Aircraft } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-Aircraft.va";




/* START_OF_SYMBOL_DEFINITION atn_aircraft */
/**
 * @summary atn_aircraft
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-aircraft OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {atn-aircraftIDName}
 *     MAY CONTAIN     {atn-per-certificate}
 *     ID              id-oc-atn-Aircraft
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_aircraft: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_aircraftIDName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_Aircraft /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_aircraft */

/* eslint-enable */
