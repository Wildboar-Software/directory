/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { ImplementedCryptoAlgorithms, _decode_ImplementedCryptoAlgorithms, _encode_ImplementedCryptoAlgorithms } from "../CMSFirmwareWrapper/ImplementedCryptoAlgorithms.ta";
import { id_aa_implCryptoAlgs } from "../CMSFirmwareWrapper/id-aa-implCryptoAlgs.va";




/* START_OF_SYMBOL_DEFINITION implCryptoAlgs */
/**
 * @summary implCryptoAlgs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * implCryptoAlgs ATTRIBUTE ::= {
 *     WITH SYNTAX         ImplementedCryptoAlgorithms
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-implCryptoAlgs
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ImplementedCryptoAlgorithms>}
 * @implements {ATTRIBUTE<ImplementedCryptoAlgorithms>}
 */
export
const implCryptoAlgs: ATTRIBUTE<ImplementedCryptoAlgorithms> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_ImplementedCryptoAlgorithms,
    },
    encoderFor: {
        "&Type": _encode_ImplementedCryptoAlgorithms,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_implCryptoAlgs /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION implCryptoAlgs */

/* eslint-enable */
