/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { DecryptKeyIdentifier, _decode_DecryptKeyIdentifier, _encode_DecryptKeyIdentifier } from "../CMSFirmwareWrapper/DecryptKeyIdentifier.ta";
import { id_aa_decryptKeyID } from "../CMSFirmwareWrapper/id-aa-decryptKeyID.va";




/* START_OF_SYMBOL_DEFINITION decryptKeyID */
/**
 * @summary decryptKeyID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * decryptKeyID ATTRIBUTE ::= {
 *     WITH SYNTAX         DecryptKeyIdentifier
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-decryptKeyID
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DecryptKeyIdentifier>}
 * @implements {ATTRIBUTE<DecryptKeyIdentifier>}
 */
export
const decryptKeyID: ATTRIBUTE<DecryptKeyIdentifier> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_DecryptKeyIdentifier,
    },
    encoderFor: {
        "&Type": _encode_DecryptKeyIdentifier,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_decryptKeyID /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION decryptKeyID */

/* eslint-enable */
