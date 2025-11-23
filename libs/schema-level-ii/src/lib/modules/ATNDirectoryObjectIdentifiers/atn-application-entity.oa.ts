/* eslint-disable */
import { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { applicationEntity } from "@wildboar/x500/SelectedObjectClasses";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_version } from "../ATNDirectoryObjectIdentifiers/atn-version.oa";
import { id_oc_atn_ApplicationEntity } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-ApplicationEntity.va";





/* START_OF_SYMBOL_DEFINITION atn_application_entity */
/**
 * @summary atn_application_entity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-application-entity OBJECT-CLASS ::= {
 *     SUBCLASS OF     {applicationEntity}
 *     MAY CONTAIN     {
 *         atn-per-certificate
 *         | atn-der-certificate
 *         | atn-version
 *     }
 *     ID              id-oc-atn-ApplicationEntity
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_application_entity: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ applicationEntity, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, atn_version, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_ApplicationEntity /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_application_entity */

/* eslint-enable */
