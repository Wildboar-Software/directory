/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
import { dhcpGroupDN } from '../DHCP-Schema/dhcpGroupDN.oa';
import { dhcpHostDN } from '../DHCP-Schema/dhcpHostDN.oa';
import { dhcpLeasesDN } from '../DHCP-Schema/dhcpLeasesDN.oa';
import { dhcpNetMask } from '../DHCP-Schema/dhcpNetMask.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpPoolDN } from '../DHCP-Schema/dhcpPoolDN.oa';
import { dhcpRange } from '../DHCP-Schema/dhcpRange.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
export { dhcpGroupDN } from '../DHCP-Schema/dhcpGroupDN.oa';
export { dhcpHostDN } from '../DHCP-Schema/dhcpHostDN.oa';
export { dhcpLeasesDN } from '../DHCP-Schema/dhcpLeasesDN.oa';
export { dhcpNetMask } from '../DHCP-Schema/dhcpNetMask.oa';
export { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
export { dhcpPoolDN } from '../DHCP-Schema/dhcpPoolDN.oa';
export { dhcpRange } from '../DHCP-Schema/dhcpRange.oa';
export { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';

/* START_OF_SYMBOL_DEFINITION dhcpSubnet */
/**
 * @summary dhcpSubnet
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpSubnet OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {commonName | dhcpNetMask}
 *     MAY CONTAIN     {dhcpRange | dhcpPoolDN | dhcpGroupDN | dhcpHostDN | dhcpClassesDN | dhcpLeasesDN | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpSubnet"}
 *     LDAP-DESC       "This class defines a subnet. This is a container object."
 *     ID              { 2 16 840 1 113719 1 203 6 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpSubnet: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        dhcpNetMask,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpRange,
        dhcpPoolDN,
        dhcpGroupDN,
        dhcpHostDN,
        dhcpClassesDN,
        dhcpLeasesDN,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpSubnet'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This class defines a subnet. This is a container object.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        2, 16, 840, 1, 113719, 1, 203, 6, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpSubnet */

/* eslint-enable */
