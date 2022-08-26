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
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { dhcpAddressState } from "../DHCP-Schema/dhcpAddressState.oa";
export { dhcpAddressState } from "../DHCP-Schema/dhcpAddressState.oa";
import { dhcpExpirationTime } from "../DHCP-Schema/dhcpExpirationTime.oa";
export { dhcpExpirationTime } from "../DHCP-Schema/dhcpExpirationTime.oa";
import { dhcpStartTimeOfState } from "../DHCP-Schema/dhcpStartTimeOfState.oa";
export { dhcpStartTimeOfState } from "../DHCP-Schema/dhcpStartTimeOfState.oa";
import { dhcpLastTransactionTime } from "../DHCP-Schema/dhcpLastTransactionTime.oa";
export { dhcpLastTransactionTime } from "../DHCP-Schema/dhcpLastTransactionTime.oa";
import { dhcpBootpFlag } from "../DHCP-Schema/dhcpBootpFlag.oa";
export { dhcpBootpFlag } from "../DHCP-Schema/dhcpBootpFlag.oa";
import { dhcpDomainName } from "../DHCP-Schema/dhcpDomainName.oa";
export { dhcpDomainName } from "../DHCP-Schema/dhcpDomainName.oa";
import { dhcpDnsStatus } from "../DHCP-Schema/dhcpDnsStatus.oa";
export { dhcpDnsStatus } from "../DHCP-Schema/dhcpDnsStatus.oa";
import { dhcpRequestedHostName } from "../DHCP-Schema/dhcpRequestedHostName.oa";
export { dhcpRequestedHostName } from "../DHCP-Schema/dhcpRequestedHostName.oa";
import { dhcpAssignedHostName } from "../DHCP-Schema/dhcpAssignedHostName.oa";
export { dhcpAssignedHostName } from "../DHCP-Schema/dhcpAssignedHostName.oa";
import { dhcpReservedForClient } from "../DHCP-Schema/dhcpReservedForClient.oa";
export { dhcpReservedForClient } from "../DHCP-Schema/dhcpReservedForClient.oa";
import { dhcpAssignedToClient } from "../DHCP-Schema/dhcpAssignedToClient.oa";
export { dhcpAssignedToClient } from "../DHCP-Schema/dhcpAssignedToClient.oa";
import { dhcpRelayAgentInfo } from "../DHCP-Schema/dhcpRelayAgentInfo.oa";
export { dhcpRelayAgentInfo } from "../DHCP-Schema/dhcpRelayAgentInfo.oa";
import { dhcpHWAddress } from "../DHCP-Schema/dhcpHWAddress.oa";
export { dhcpHWAddress } from "../DHCP-Schema/dhcpHWAddress.oa";
import { dhcpErrorLog } from "../DHCP-Schema/dhcpErrorLog.oa";
export { dhcpErrorLog } from "../DHCP-Schema/dhcpErrorLog.oa";


/* START_OF_SYMBOL_DEFINITION dhcpLog */
/**
 * @summary dhcpLog
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * dhcpLog OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {dhcpAddressState | dhcpExpirationTime | dhcpStartTimeOfState | dhcpLastTransactionTime | dhcpBootpFlag | dhcpDomainName | dhcpDnsStatus | dhcpRequestedHostName | dhcpAssignedHostName | dhcpReservedForClient | dhcpAssignedToClient | dhcpRelayAgentInfo | dhcpHWAddress | dhcpErrorLog}
 *     LDAP-NAME       {"dhcpLog"}
 *     ID              { 2 16 840 1 113719 1 203 6 11 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const dhcpLog: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ dhcpAddressState, dhcpExpirationTime, dhcpStartTimeOfState, dhcpLastTransactionTime, dhcpBootpFlag, dhcpDomainName, dhcpDnsStatus, dhcpRequestedHostName, dhcpAssignedHostName, dhcpReservedForClient, dhcpAssignedToClient, dhcpRelayAgentInfo, dhcpHWAddress, dhcpErrorLog, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["dhcpLog"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 16, 840, 1, 113719, 1, 203, 6, 11,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpLog */

/* eslint-enable */
