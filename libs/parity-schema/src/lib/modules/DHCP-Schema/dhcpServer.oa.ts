/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpDelayedServiceParameter } from '../DHCP-Schema/dhcpDelayedServiceParameter.oa';
import { dhcpFailOverEndpointState } from '../DHCP-Schema/dhcpFailOverEndpointState.oa';
import { dhcpHashBucketAssignment } from '../DHCP-Schema/dhcpHashBucketAssignment.oa';
import { dhcpImplementation } from '../DHCP-Schema/dhcpImplementation.oa';
import { dhcpMaxClientLeadTime } from '../DHCP-Schema/dhcpMaxClientLeadTime.oa';
import { dhcpServiceDN } from '../DHCP-Schema/dhcpServiceDN.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
import { dhcpVersion } from '../DHCP-Schema/dhcpVersion.oa';
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
export { dhcpDelayedServiceParameter } from '../DHCP-Schema/dhcpDelayedServiceParameter.oa';
export { dhcpFailOverEndpointState } from '../DHCP-Schema/dhcpFailOverEndpointState.oa';
export { dhcpHashBucketAssignment } from '../DHCP-Schema/dhcpHashBucketAssignment.oa';
export { dhcpImplementation } from '../DHCP-Schema/dhcpImplementation.oa';
export { dhcpMaxClientLeadTime } from '../DHCP-Schema/dhcpMaxClientLeadTime.oa';
export { dhcpServiceDN } from '../DHCP-Schema/dhcpServiceDN.oa';
export { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
export { dhcpVersion } from '../DHCP-Schema/dhcpVersion.oa';

/* START_OF_SYMBOL_DEFINITION dhcpServer */
/**
 * @summary dhcpServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | dhcpServiceDN}
 *     MAY CONTAIN     {dhcpVersion | dhcpImplementation | dhcpHashBucketAssignment | dhcpDelayedServiceParameter | dhcpMaxClientLeadTime | dhcpFailOverEndpointState | dhcpStatements}
 *     LDAP-NAME       {"dhcpServer"}
 *     LDAP-DESC       "DHCP Server Object"
 *     ID              { 2 16 840 1 113719 1 203 6 12 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        dhcpServiceDN,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpVersion,
        dhcpImplementation,
        dhcpHashBucketAssignment,
        dhcpDelayedServiceParameter,
        dhcpMaxClientLeadTime,
        dhcpFailOverEndpointState,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'DHCP Server Object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 12,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpServer */

/* eslint-enable */
