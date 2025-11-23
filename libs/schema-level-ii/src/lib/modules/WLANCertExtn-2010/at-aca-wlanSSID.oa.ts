/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { SSIDList, _decode_SSIDList, _encode_SSIDList } from "../WLANCertExtn-2010/SSIDList.ta";
import { id_aca_wlanSSID } from "../WLANCertExtn-2010/id-aca-wlanSSID.va";




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
