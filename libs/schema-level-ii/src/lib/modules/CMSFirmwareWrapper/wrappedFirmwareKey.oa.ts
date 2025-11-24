/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { WrappedFirmwareKey, _decode_WrappedFirmwareKey, _encode_WrappedFirmwareKey } from "../CMSFirmwareWrapper/WrappedFirmwareKey.ta";
import { id_aa_wrappedFirmwareKey } from "../CMSFirmwareWrapper/id-aa-wrappedFirmwareKey.va";




/* START_OF_SYMBOL_DEFINITION wrappedFirmwareKey */
/**
 * @summary wrappedFirmwareKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * wrappedFirmwareKey ATTRIBUTE ::= {
 *     WITH SYNTAX         WrappedFirmwareKey
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-wrappedFirmwareKey
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<WrappedFirmwareKey>}
 * @implements {ATTRIBUTE<WrappedFirmwareKey>}
 */
export
const wrappedFirmwareKey: ATTRIBUTE<WrappedFirmwareKey> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_WrappedFirmwareKey,
    },
    encoderFor: {
        "&Type": _encode_WrappedFirmwareKey,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_wrappedFirmwareKey /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION wrappedFirmwareKey */

/* eslint-enable */
