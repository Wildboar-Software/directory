/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { PKIPublicationInfo, _decode_PKIPublicationInfo, _encode_PKIPublicationInfo } from "../PKIXCRMF-2009/PKIPublicationInfo.ta";
import { id_regCtrl_pkiPublicationInfo } from "../PKIXCRMF-2009/id-regCtrl-pkiPublicationInfo.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { PKIPublicationInfo, _decode_PKIPublicationInfo, _encode_PKIPublicationInfo } from "../PKIXCRMF-2009/PKIPublicationInfo.ta";
export { id_regCtrl_pkiPublicationInfo } from "../PKIXCRMF-2009/id-regCtrl-pkiPublicationInfo.va";


/* START_OF_SYMBOL_DEFINITION regCtrl_pkiPublicationInfo */
/**
 * @summary regCtrl_pkiPublicationInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * regCtrl-pkiPublicationInfo ATTRIBUTE ::= {
 *     WITH SYNTAX     PKIPublicationInfo
 *     ID              id-regCtrl-pkiPublicationInfo
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PKIPublicationInfo>}
 * @implements {ATTRIBUTE<PKIPublicationInfo>}
 */
export
const regCtrl_pkiPublicationInfo: ATTRIBUTE<PKIPublicationInfo> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_PKIPublicationInfo,
    },
    encoderFor: {
        "&Type": _encode_PKIPublicationInfo,
    },
    "&id": id_regCtrl_pkiPublicationInfo /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION regCtrl_pkiPublicationInfo */

/* eslint-enable */
