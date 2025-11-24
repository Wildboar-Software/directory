/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
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
import { dhcpExpirationTime } from '../DHCP-Schema/dhcpExpirationTime.oa';
import { dhcpHWAddress } from '../DHCP-Schema/dhcpHWAddress.oa';
import { dhcpLastTransactionTime } from '../DHCP-Schema/dhcpLastTransactionTime.oa';
import { dhcpRelayAgentInfo } from '../DHCP-Schema/dhcpRelayAgentInfo.oa';
import { dhcpRequestedHostName } from '../DHCP-Schema/dhcpRequestedHostName.oa';
import { dhcpReservedForClient } from '../DHCP-Schema/dhcpReservedForClient.oa';
import { dhcpStartTimeOfState } from '../DHCP-Schema/dhcpStartTimeOfState.oa';


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
export const dhcpLeases: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        dhcpAddressState,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
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
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpLeases'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This class represents an IP Address, which may or may not have been leased.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 10,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpLeases */

/* eslint-enable */
