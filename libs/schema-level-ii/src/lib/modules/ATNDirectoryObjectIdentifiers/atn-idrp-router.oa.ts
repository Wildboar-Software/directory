/* eslint-disable */
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { device } from "@wildboar/x500/SelectedObjectClasses";
import { atn_net } from "../ATNDirectoryObjectIdentifiers/atn-net.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_version } from "../ATNDirectoryObjectIdentifiers/atn-version.oa";
import { id_oc_atn_idrpRouter } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-idrpRouter.va";





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
