/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
import { dhcpLeasesDN } from '../DHCP-Schema/dhcpLeasesDN.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpPermitList } from '../DHCP-Schema/dhcpPermitList.oa';
import { dhcpRange } from '../DHCP-Schema/dhcpRange.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';
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
export { dhcpLeasesDN } from '../DHCP-Schema/dhcpLeasesDN.oa';
export { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
export { dhcpPermitList } from '../DHCP-Schema/dhcpPermitList.oa';
export { dhcpRange } from '../DHCP-Schema/dhcpRange.oa';
export { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';

/* START_OF_SYMBOL_DEFINITION dhcpPool */
/**
 * @summary dhcpPool
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpPool OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {commonName | dhcpRange}
 *     MAY CONTAIN     {dhcpClassesDN | dhcpPermitList | dhcpLeasesDN | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpPool"}
 *     LDAP-DESC       "This stores configuration information about a pool."
 *     ID              { 2 16 840 1 113719 1 203 6 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpPool: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName, dhcpRange] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpClassesDN,
        dhcpPermitList,
        dhcpLeasesDN,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpPool'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This stores configuration information about a pool.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpPool */

/* eslint-enable */
