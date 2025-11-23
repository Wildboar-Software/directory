/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
import { dhcpGroupDN } from '../DHCP-Schema/dhcpGroupDN.oa';
import { dhcpHostDN } from '../DHCP-Schema/dhcpHostDN.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpPrimaryDN } from '../DHCP-Schema/dhcpPrimaryDN.oa';
import { dhcpSecondaryDN } from '../DHCP-Schema/dhcpSecondaryDN.oa';
import { dhcpSharedNetworkDN } from '../DHCP-Schema/dhcpSharedNetworkDN.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
import { dhcpSubnetDN } from '../DHCP-Schema/dhcpSubnetDN.oa';
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
export { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
export { dhcpGroupDN } from '../DHCP-Schema/dhcpGroupDN.oa';
export { dhcpHostDN } from '../DHCP-Schema/dhcpHostDN.oa';
export { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
export { dhcpPrimaryDN } from '../DHCP-Schema/dhcpPrimaryDN.oa';
export { dhcpSecondaryDN } from '../DHCP-Schema/dhcpSecondaryDN.oa';
export { dhcpSharedNetworkDN } from '../DHCP-Schema/dhcpSharedNetworkDN.oa';
export { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
export { dhcpSubnetDN } from '../DHCP-Schema/dhcpSubnetDN.oa';

/* START_OF_SYMBOL_DEFINITION dhcpService */
/**
 * @summary dhcpService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpService OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | dhcpPrimaryDN}
 *     MAY CONTAIN     {dhcpSecondaryDN | dhcpSharedNetworkDN | dhcpSubnetDN | dhcpGroupDN | dhcpHostDN | dhcpClassesDN | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpService"}
 *     ID              { 2 16 840 1 113719 1 203 6 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        dhcpPrimaryDN,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpSecondaryDN,
        dhcpSharedNetworkDN,
        dhcpSubnetDN,
        dhcpGroupDN,
        dhcpHostDN,
        dhcpClassesDN,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpService'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpService */

/* eslint-enable */
