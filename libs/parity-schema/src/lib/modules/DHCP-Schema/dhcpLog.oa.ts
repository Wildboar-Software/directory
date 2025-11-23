/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpAddressState } from '../DHCP-Schema/dhcpAddressState.oa';
import { dhcpAssignedHostName } from '../DHCP-Schema/dhcpAssignedHostName.oa';
import { dhcpAssignedToClient } from '../DHCP-Schema/dhcpAssignedToClient.oa';
import { dhcpBootpFlag } from '../DHCP-Schema/dhcpBootpFlag.oa';
import { dhcpDnsStatus } from '../DHCP-Schema/dhcpDnsStatus.oa';
import { dhcpDomainName } from '../DHCP-Schema/dhcpDomainName.oa';
import { dhcpErrorLog } from '../DHCP-Schema/dhcpErrorLog.oa';
import { dhcpExpirationTime } from '../DHCP-Schema/dhcpExpirationTime.oa';
import { dhcpHWAddress } from '../DHCP-Schema/dhcpHWAddress.oa';
import { dhcpLastTransactionTime } from '../DHCP-Schema/dhcpLastTransactionTime.oa';
import { dhcpRelayAgentInfo } from '../DHCP-Schema/dhcpRelayAgentInfo.oa';
import { dhcpRequestedHostName } from '../DHCP-Schema/dhcpRequestedHostName.oa';
import { dhcpReservedForClient } from '../DHCP-Schema/dhcpReservedForClient.oa';
import { dhcpStartTimeOfState } from '../DHCP-Schema/dhcpStartTimeOfState.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { dhcpAddressState } from '../DHCP-Schema/dhcpAddressState.oa';
export { dhcpAssignedHostName } from '../DHCP-Schema/dhcpAssignedHostName.oa';
export { dhcpAssignedToClient } from '../DHCP-Schema/dhcpAssignedToClient.oa';
export { dhcpBootpFlag } from '../DHCP-Schema/dhcpBootpFlag.oa';
export { dhcpDnsStatus } from '../DHCP-Schema/dhcpDnsStatus.oa';
export { dhcpDomainName } from '../DHCP-Schema/dhcpDomainName.oa';
export { dhcpErrorLog } from '../DHCP-Schema/dhcpErrorLog.oa';
export { dhcpExpirationTime } from '../DHCP-Schema/dhcpExpirationTime.oa';
export { dhcpHWAddress } from '../DHCP-Schema/dhcpHWAddress.oa';
export { dhcpLastTransactionTime } from '../DHCP-Schema/dhcpLastTransactionTime.oa';
export { dhcpRelayAgentInfo } from '../DHCP-Schema/dhcpRelayAgentInfo.oa';
export { dhcpRequestedHostName } from '../DHCP-Schema/dhcpRequestedHostName.oa';
export { dhcpReservedForClient } from '../DHCP-Schema/dhcpReservedForClient.oa';
export { dhcpStartTimeOfState } from '../DHCP-Schema/dhcpStartTimeOfState.oa';

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
export const dhcpLog: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpAddressState,
        dhcpExpirationTime,
        dhcpStartTimeOfState,
        dhcpLastTransactionTime,
        dhcpBootpFlag,
        dhcpDomainName,
        dhcpDnsStatus,
        dhcpRequestedHostName,
        dhcpAssignedHostName,
        dhcpReservedForClient,
        dhcpAssignedToClient,
        dhcpRelayAgentInfo,
        dhcpHWAddress,
        dhcpErrorLog,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpLog'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpLog */

/* eslint-enable */
