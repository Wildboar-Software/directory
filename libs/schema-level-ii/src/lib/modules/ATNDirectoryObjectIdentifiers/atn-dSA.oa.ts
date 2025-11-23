/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { dSA } from "@wildboar/x500/SelectedObjectClasses";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_version } from "../ATNDirectoryObjectIdentifiers/atn-version.oa";
import { id_oc_atn_AtnDirectorySystemAgent } from "./id-oc-atn-AtnDirectorySystemAgent.va";




/* START_OF_SYMBOL_DEFINITION atn_dSA */
/**
 * @summary atn_dSA
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-dSA OBJECT-CLASS ::= {
 *     SUBCLASS OF     {dSA}
 *     MUST CONTAIN    {
 *         atn-per-certificate
 *         | atn-der-certificate
 *         | atn-version
 *     }
 *     ID              id-oc-atn-DirectorySystemAgent }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_dSA: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ dSA, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_per_certificate, atn_der_certificate, atn_version, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_AtnDirectorySystemAgent /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_dSA */

/* eslint-enable */
