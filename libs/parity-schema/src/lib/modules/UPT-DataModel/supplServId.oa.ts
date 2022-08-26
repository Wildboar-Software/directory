/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
import { AttributeUsage, _enum_for_AttributeUsage, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { AttributeUsage, _enum_for_AttributeUsage, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { SS_Code, SS_Code_clip /* IMPORTED_LONG_NAMED_INTEGER */, clip /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_clir /* IMPORTED_LONG_NAMED_INTEGER */, clir /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_colp /* IMPORTED_LONG_NAMED_INTEGER */, colp /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_colr /* IMPORTED_LONG_NAMED_INTEGER */, colr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_mci /* IMPORTED_LONG_NAMED_INTEGER */, mci /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfu /* IMPORTED_LONG_NAMED_INTEGER */, cfu /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfb /* IMPORTED_LONG_NAMED_INTEGER */, cfb /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfna /* IMPORTED_LONG_NAMED_INTEGER */, cfna /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfnr /* IMPORTED_LONG_NAMED_INTEGER */, cfnr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_civr /* IMPORTED_LONG_NAMED_INTEGER */, civr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_tvr /* IMPORTED_LONG_NAMED_INTEGER */, tvr /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_SS_Code, _encode_SS_Code } from "../UPT-DataModel/SS-Code.ta";
export { SS_Code, SS_Code_clip /* IMPORTED_LONG_NAMED_INTEGER */, clip /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_clir /* IMPORTED_LONG_NAMED_INTEGER */, clir /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_colp /* IMPORTED_LONG_NAMED_INTEGER */, colp /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_colr /* IMPORTED_LONG_NAMED_INTEGER */, colr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_mci /* IMPORTED_LONG_NAMED_INTEGER */, mci /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfu /* IMPORTED_LONG_NAMED_INTEGER */, cfu /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfb /* IMPORTED_LONG_NAMED_INTEGER */, cfb /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfna /* IMPORTED_LONG_NAMED_INTEGER */, cfna /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_cfnr /* IMPORTED_LONG_NAMED_INTEGER */, cfnr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_civr /* IMPORTED_LONG_NAMED_INTEGER */, civr /* IMPORTED_SHORT_NAMED_INTEGER */, SS_Code_tvr /* IMPORTED_LONG_NAMED_INTEGER */, tvr /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_SS_Code, _encode_SS_Code } from "../UPT-DataModel/SS-Code.ta";
import { integerMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
export { integerMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
import { id_at_supplServId } from "../UPT-DataModel/id-at-supplServId.va";
export { id_at_supplServId } from "../UPT-DataModel/id-at-supplServId.va";


/* START_OF_SYMBOL_DEFINITION supplServId */
/**
 * @summary supplServId
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * supplServId ATTRIBUTE ::= {
 *   WITH SYNTAX             SS-Code
 *   EQUALITY MATCHING RULE  integerMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-supplServId
 * }
 * ```
 * 
 * @constant
 * @type {ATTRIBUTE<SS_Code>}
 * @implements {ATTRIBUTE<SS_Code>}
 */
export
const supplServId: ATTRIBUTE<SS_Code> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_SS_Code,
    },
    encoderFor: {
        "&Type": _encode_SS_Code,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&single-valued": true /* OBJECT_FIELD_SETTING */,
    "&id": id_at_supplServId /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION supplServId */

/* eslint-enable */
