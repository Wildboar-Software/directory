/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpClassesDN } from '../DHCP-Schema/dhcpClassesDN.oa';
import { dhcpGroupDN } from '../DHCP-Schema/dhcpGroupDN.oa';
import { dhcpHostDN } from '../DHCP-Schema/dhcpHostDN.oa';
import { dhcpLeasesDN } from '../DHCP-Schema/dhcpLeasesDN.oa';
import { dhcpNetMask } from '../DHCP-Schema/dhcpNetMask.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpPoolDN } from '../DHCP-Schema/dhcpPoolDN.oa';
import { dhcpRange } from '../DHCP-Schema/dhcpRange.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';


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
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpSubnet */

/* eslint-enable */
