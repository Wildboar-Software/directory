/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ImplementedCompressAlgorithms, _decode_ImplementedCompressAlgorithms, _encode_ImplementedCompressAlgorithms } from "../CMSFirmwareWrapper/ImplementedCompressAlgorithms.ta";
import { id_aa_implCompressAlgs } from "../CMSFirmwareWrapper/id-aa-implCompressAlgs.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { ImplementedCompressAlgorithms, _decode_ImplementedCompressAlgorithms, _encode_ImplementedCompressAlgorithms } from "../CMSFirmwareWrapper/ImplementedCompressAlgorithms.ta";
export { id_aa_implCompressAlgs } from "../CMSFirmwareWrapper/id-aa-implCompressAlgs.va";


/* START_OF_SYMBOL_DEFINITION implCompressAlgs */
/**
 * @summary implCompressAlgs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * implCompressAlgs ATTRIBUTE ::= {
 *     WITH SYNTAX         ImplementedCompressAlgorithms
 *     SINGLE VALUE        TRUE -- See: https://datatracker.ietf.org/doc/html/rfc4108#section-2.2
 *     ID                  id-aa-implCompressAlgs
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ImplementedCompressAlgorithms>}
 * @implements {ATTRIBUTE<ImplementedCompressAlgorithms>}
 */
export
const implCompressAlgs: ATTRIBUTE<ImplementedCompressAlgorithms> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_ImplementedCompressAlgorithms,
    },
    encoderFor: {
        "&Type": _encode_ImplementedCompressAlgorithms,
    },
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_aa_implCompressAlgs /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION implCompressAlgs */

/* eslint-enable */
