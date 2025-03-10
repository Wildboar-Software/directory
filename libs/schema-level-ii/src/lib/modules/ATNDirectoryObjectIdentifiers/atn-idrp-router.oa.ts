/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { device } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/device.oa";
import { atn_net } from "../ATNDirectoryObjectIdentifiers/atn-net.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_version } from "../ATNDirectoryObjectIdentifiers/atn-version.oa";
import { id_oc_atn_idrpRouter } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-idrpRouter.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { device } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/device.oa";
export { atn_net } from "../ATNDirectoryObjectIdentifiers/atn-net.oa";
export { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
export { atn_version } from "../ATNDirectoryObjectIdentifiers/atn-version.oa";
export { id_oc_atn_idrpRouter } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-idrpRouter.va";


/* START_OF_SYMBOL_DEFINITION atn_idrp_router */
/**
 * @summary atn_idrp_router
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-idrp-router OBJECT-CLASS ::= {
 *     SUBCLASS OF     {device}
 *     MUST CONTAIN    {
 *         atn-net
 *         | atn-per-certificate
 *         | atn-version
 *     }
 *     ID              id-oc-atn-idrpRouter
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_idrp_router: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ device, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_net, atn_per_certificate, atn_version, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_idrpRouter /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_idrp_router */

/* eslint-enable */
