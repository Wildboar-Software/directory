/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { SSIDList, _decode_SSIDList, _encode_SSIDList } from "../WLANCertExtn-2010/SSIDList.ta";
import { id_aca_wlanSSID } from "../WLANCertExtn-2010/id-aca-wlanSSID.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SSIDList, _decode_SSIDList, _encode_SSIDList } from "../WLANCertExtn-2010/SSIDList.ta";
export { id_aca_wlanSSID } from "../WLANCertExtn-2010/id-aca-wlanSSID.va";

/* START_OF_SYMBOL_DEFINITION at_aca_wlanSSID */
/**
 * @summary at_aca_wlanSSID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at-aca-wlanSSID ATTRIBUTE ::= {
 *     WITH SYNTAX     SSIDList
 *     ID              id-aca-wlanSSID
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SSIDList>}
 * @implements {ATTRIBUTE<SSIDList>}
 */
export
const at_aca_wlanSSID: ATTRIBUTE<SSIDList> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_SSIDList,
    },
    encoderFor: {
        "&Type": _encode_SSIDList,
    },
    "&id": id_aca_wlanSSID /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION at_aca_wlanSSID */

/* eslint-enable */
