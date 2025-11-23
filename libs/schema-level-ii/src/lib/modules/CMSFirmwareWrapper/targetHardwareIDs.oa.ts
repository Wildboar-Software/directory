/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { TargetHardwareIdentifiers, _decode_TargetHardwareIdentifiers, _encode_TargetHardwareIdentifiers } from "../CMSFirmwareWrapper/TargetHardwareIdentifiers.ta";
import { id_aa_targetHardwareIDs } from "../CMSFirmwareWrapper/id-aa-targetHardwareIDs.va";




/* START_OF_SYMBOL_DEFINITION targetHardwareIDs */
/**
 * @summary targetHardwareIDs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * targetHardwareIDs ATTRIBUTE ::= {
 *     WITH SYNTAX         TargetHardwareIdentifiers
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-targetHardwareIDs
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TargetHardwareIdentifiers>}
 * @implements {ATTRIBUTE<TargetHardwareIdentifiers>}
 */
export
const targetHardwareIDs: ATTRIBUTE<TargetHardwareIdentifiers> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_TargetHardwareIdentifiers,
    },
    encoderFor: {
        "&Type": _encode_TargetHardwareIdentifiers,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_targetHardwareIDs /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION targetHardwareIDs */

/* eslint-enable */
