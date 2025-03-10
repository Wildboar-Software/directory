/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ProtocolEncrKey, _decode_ProtocolEncrKey, _encode_ProtocolEncrKey } from "../PKIXCRMF-2009/ProtocolEncrKey.ta";
import { id_regCtrl_protocolEncrKey } from "../PKIXCRMF-2009/id-regCtrl-protocolEncrKey.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { ProtocolEncrKey, _decode_ProtocolEncrKey, _encode_ProtocolEncrKey } from "../PKIXCRMF-2009/ProtocolEncrKey.ta";
export { id_regCtrl_protocolEncrKey } from "../PKIXCRMF-2009/id-regCtrl-protocolEncrKey.va";


/* START_OF_SYMBOL_DEFINITION regCtrl_protocolEncrKey */
/**
 * @summary regCtrl_protocolEncrKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * regCtrl-protocolEncrKey ATTRIBUTE ::= {
 *     WITH SYNTAX     ProtocolEncrKey
 *     ID              id-regCtrl-protocolEncrKey
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ProtocolEncrKey>}
 * @implements {ATTRIBUTE<ProtocolEncrKey>}
 */
export
const regCtrl_protocolEncrKey: ATTRIBUTE<ProtocolEncrKey> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_ProtocolEncrKey,
    },
    encoderFor: {
        "&Type": _encode_ProtocolEncrKey,
    },
    "&id": id_regCtrl_protocolEncrKey /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION regCtrl_protocolEncrKey */

/* eslint-enable */
