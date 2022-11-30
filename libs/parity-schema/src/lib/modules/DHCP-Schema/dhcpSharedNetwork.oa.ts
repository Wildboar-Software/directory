/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpPoolDN } from '../DHCP-Schema/dhcpPoolDN.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
import { dhcpSubnetDN } from '../DHCP-Schema/dhcpSubnetDN.oa';
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
export { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
export { dhcpPoolDN } from '../DHCP-Schema/dhcpPoolDN.oa';
export { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
export { dhcpSubnetDN } from '../DHCP-Schema/dhcpSubnetDN.oa';

/* START_OF_SYMBOL_DEFINITION dhcpSharedNetwork */
/**
 * @summary dhcpSharedNetwork
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpSharedNetwork OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {dhcpSubnetDN | dhcpPoolDN | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpSharedNetwork"}
 *     LDAP-DESC       "This stores configuration information for a shared network."
 *     ID              { 2 16 840 1 113719 1 203 6 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpSharedNetwork: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpSubnetDN,
        dhcpPoolDN,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpSharedNetwork'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This stores configuration information for a shared network.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        2, 16, 840, 1, 113719, 1, 203, 6, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpSharedNetwork */

/* eslint-enable */
