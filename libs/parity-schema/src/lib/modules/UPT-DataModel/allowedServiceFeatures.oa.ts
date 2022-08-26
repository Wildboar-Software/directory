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
import { Service, Service_isdnTelephony /* IMPORTED_LONG_NAMED_INTEGER */, isdnTelephony /* IMPORTED_SHORT_NAMED_INTEGER */, Service_icRegistration /* IMPORTED_LONG_NAMED_INTEGER */, icRegistration /* IMPORTED_SHORT_NAMED_INTEGER */, Service_serviceProfileModification /* IMPORTED_LONG_NAMED_INTEGER */, serviceProfileModification /* IMPORTED_SHORT_NAMED_INTEGER */, Service_standard /* IMPORTED_LONG_NAMED_INTEGER */, standard /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingUnconditional /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingUnconditional /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnNoReply /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnNoReply /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnBusy /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnBusy /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnTime /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnTime /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnCallingLine /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnCallingLine /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_Service, _encode_Service } from "../UPT-DataModel/Service.ta";
export { Service, Service_isdnTelephony /* IMPORTED_LONG_NAMED_INTEGER */, isdnTelephony /* IMPORTED_SHORT_NAMED_INTEGER */, Service_icRegistration /* IMPORTED_LONG_NAMED_INTEGER */, icRegistration /* IMPORTED_SHORT_NAMED_INTEGER */, Service_serviceProfileModification /* IMPORTED_LONG_NAMED_INTEGER */, serviceProfileModification /* IMPORTED_SHORT_NAMED_INTEGER */, Service_standard /* IMPORTED_LONG_NAMED_INTEGER */, standard /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingUnconditional /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingUnconditional /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnNoReply /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnNoReply /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnBusy /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnBusy /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnTime /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnTime /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnCallingLine /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnCallingLine /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_Service, _encode_Service } from "../UPT-DataModel/Service.ta";
import { integerMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
export { integerMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
import { id_at_allowedServiceFeatures } from "../UPT-DataModel/id-at-allowedServiceFeatures.va";
export { id_at_allowedServiceFeatures } from "../UPT-DataModel/id-at-allowedServiceFeatures.va";


/* START_OF_SYMBOL_DEFINITION allowedServiceFeatures */
/**
 * @summary allowedServiceFeatures
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * allowedServiceFeatures ATTRIBUTE ::= {
 *   WITH SYNTAX             Service
 *   EQUALITY MATCHING RULE  integerMatch
 *   ID                      id-at-allowedServiceFeatures
 * }
 * ```
 * 
 * @constant
 * @type {ATTRIBUTE<Service>}
 * @implements {ATTRIBUTE<Service>}
 */
export
const allowedServiceFeatures: ATTRIBUTE<Service> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_Service,
    },
    encoderFor: {
        "&Type": _encode_Service,
    },
    "&equality-match": integerMatch /* OBJECT_FIELD_SETTING */,
    "&id": id_at_allowedServiceFeatures /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION allowedServiceFeatures */

/* eslint-enable */
