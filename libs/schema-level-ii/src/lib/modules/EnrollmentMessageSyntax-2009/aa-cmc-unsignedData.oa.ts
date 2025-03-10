/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { CMCUnsignedData, _decode_CMCUnsignedData, _encode_CMCUnsignedData } from "../EnrollmentMessageSyntax-2009/CMCUnsignedData.ta";
import { id_aa_cmc_unsignedData } from "./id-aa-cmc-unsignedData.va";



/* START_OF_SYMBOL_DEFINITION aa_cmc_unsignedData */
/**
 * @summary aa_cmc_unsignedData
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-cmc-unsignedData ATTRIBUTE ::= {
 *     WITH SYNTAX        CMCUnsignedData
 *     ID                id-at-aa-cmc-unsignedData
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<CMCUnsignedData>}
 * @implements {ATTRIBUTE<CMCUnsignedData>}
 */
export
const aa_cmc_unsignedData: ATTRIBUTE<CMCUnsignedData> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_CMCUnsignedData,
    },
    encoderFor: {
        "&Type": _encode_CMCUnsignedData,
    },
    "&id": id_aa_cmc_unsignedData /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION aa_cmc_unsignedData */

/* eslint-enable */
