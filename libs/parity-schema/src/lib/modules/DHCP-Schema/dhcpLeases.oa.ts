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


/* START_OF_SYMBOL_DEFINITION dhcpLeases */
/**
 * @summary dhcpLeases
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * dhcpLeases OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | dhcpAddressState}
 *     MAY CONTAIN     {dhcpExpirationTime | dhcpStartTimeOfState | dhcpLastTransactionTime | dhcpBootpFlag | dhcpDomainName | dhcpDnsStatus | dhcpRequestedHostName | dhcpAssignedHostName | dhcpReservedForClient | dhcpAssignedToClient | dhcpRelayAgentInfo | dhcpHWAddress}
 *     LDAP-NAME       {"dhcpLeases"}
 *     LDAP-DESC       "This class represents an IP Address, which may or may not have been leased."
 *     ID              { 2 16 840 1 113719 1 203 6 10 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const dhcpLeases: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, dhcpAddressState, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ dhcpExpirationTime, dhcpStartTimeOfState, dhcpLastTransactionTime, dhcpBootpFlag, dhcpDomainName, dhcpDnsStatus, dhcpRequestedHostName, dhcpAssignedHostName, dhcpReservedForClient, dhcpAssignedToClient, dhcpRelayAgentInfo, dhcpHWAddress, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["dhcpLeases"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "This class represents an IP Address, which may or may not have been leased." /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 16, 840, 1, 113719, 1, 203, 6, 10,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpLeases */

/* eslint-enable */
