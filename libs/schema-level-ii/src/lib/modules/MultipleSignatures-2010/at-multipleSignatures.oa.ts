/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { MultipleSignatures, _decode_MultipleSignatures, _encode_MultipleSignatures } from "../MultipleSignatures-2010/MultipleSignatures.ta";
import { id_aa_multipleSignatures } from "../MultipleSignatures-2010/id-aa-multipleSignatures.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { MultipleSignatures, _decode_MultipleSignatures, _encode_MultipleSignatures } from "../MultipleSignatures-2010/MultipleSignatures.ta";
export { id_aa_multipleSignatures } from "../MultipleSignatures-2010/id-aa-multipleSignatures.va";


/* START_OF_SYMBOL_DEFINITION at_multipleSignatures */
/**
 * @summary at_multipleSignatures
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at-multipleSignatures ATTRIBUTE ::= {
 *     WITH SYNTAX     MultipleSignatures
 *     ID              id-aa-multipleSignatures
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MultipleSignatures>}
 * @implements {ATTRIBUTE<MultipleSignatures>}
 */
export
const at_multipleSignatures: ATTRIBUTE<MultipleSignatures> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_MultipleSignatures,
    },
    encoderFor: {
        "&Type": _encode_MultipleSignatures,
    },
    "&id": id_aa_multipleSignatures /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION at_multipleSignatures */

/* eslint-enable */
