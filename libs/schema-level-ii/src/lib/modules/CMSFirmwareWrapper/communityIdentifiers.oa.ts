/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { CommunityIdentifiers, _decode_CommunityIdentifiers, _encode_CommunityIdentifiers } from "../CMSFirmwareWrapper/CommunityIdentifiers.ta";
import { id_aa_communityIdentifiers } from "../CMSFirmwareWrapper/id-aa-communityIdentifiers.va";




/* START_OF_SYMBOL_DEFINITION communityIdentifiers */
/**
 * @summary communityIdentifiers
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * communityIdentifiers ATTRIBUTE ::= {
 *     WITH SYNTAX         CommunityIdentifiers
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-communityIdentifiers
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<CommunityIdentifiers>}
 * @implements {ATTRIBUTE<CommunityIdentifiers>}
 */
export
const communityIdentifiers: ATTRIBUTE<CommunityIdentifiers> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_CommunityIdentifiers,
    },
    encoderFor: {
        "&Type": _encode_CommunityIdentifiers,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_communityIdentifiers /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION communityIdentifiers */

/* eslint-enable */
