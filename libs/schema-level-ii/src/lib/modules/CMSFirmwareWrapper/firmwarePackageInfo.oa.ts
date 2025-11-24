/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { FirmwarePackageInfo, _decode_FirmwarePackageInfo, _encode_FirmwarePackageInfo } from "../CMSFirmwareWrapper/FirmwarePackageInfo.ta";
import { id_aa_firmwarePackageInfo } from "../CMSFirmwareWrapper/id-aa-firmwarePackageInfo.va";




/* START_OF_SYMBOL_DEFINITION firmwarePackageInfo */
/**
 * @summary firmwarePackageInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * firmwarePackageInfo ATTRIBUTE ::= {
 *     WITH SYNTAX         FirmwarePackageInfo
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-firmwarePackageInfo
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<FirmwarePackageInfo>}
 * @implements {ATTRIBUTE<FirmwarePackageInfo>}
 */
export
const firmwarePackageInfo: ATTRIBUTE<FirmwarePackageInfo> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_FirmwarePackageInfo,
    },
    encoderFor: {
        "&Type": _encode_FirmwarePackageInfo,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_firmwarePackageInfo /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION firmwarePackageInfo */

/* eslint-enable */
