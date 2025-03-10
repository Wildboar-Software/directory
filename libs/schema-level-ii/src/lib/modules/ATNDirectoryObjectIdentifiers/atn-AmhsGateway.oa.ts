/* eslint-disable */
import { mhs_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-acceptable-eits.oa";
import { mhs_deliverable_classes } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-classes.oa";
import { mhs_deliverable_content_types } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-content-types.oa";
import { mhs_exclusively_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-exclusively-acceptable-eits.oa";
import { mhs_maximum_content_length } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-maximum-content-length.oa";
import { mhs_or_addresses } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses.oa";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { owner } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa";
import { protocolInformation } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/protocolInformation.oa";
import { applicationEntity } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/applicationEntity.oa";
import { atn_AF_address } from "../ATNDirectoryObjectIdentifiers/atn-AF-address.oa";
import { atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa";
import { id_oc_atn_AmhsGateway } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-AmhsGateway.va";







/* START_OF_SYMBOL_DEFINITION atn_AmhsGateway */
/**
 * @summary atn_AmhsGateway
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-AmhsGateway OBJECT-CLASS ::= {
 *     SUBCLASS OF     {applicationEntity}
 *     MUST CONTAIN    {
 *         owner
 *         | mhs-deliverable-content-types
 *         | protocolInformation
 *         | mhs-deliverable-classes
 *         | mhs-or-addresses
 *         | atn-ipm-heading-extensions
 *     }
 *     MAY CONTAIN     {
 *         mhs-maximum-content-length
 *         | mhs-acceptable-eits
 *         | mhs-exclusively-acceptable-eits
 *         | atn-AF-address
 *     }
 *     ID              id-oc-atn-AmhsGateway
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_AmhsGateway: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ applicationEntity, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ owner, mhs_deliverable_content_types, protocolInformation, mhs_deliverable_classes, mhs_or_addresses, atn_ipm_heading_extensions, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ mhs_maximum_content_length, mhs_acceptable_eits, mhs_exclusively_acceptable_eits, atn_AF_address, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_AmhsGateway /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_AmhsGateway */

/* eslint-enable */
