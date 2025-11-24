/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpHWAddress } from '../DHCP-Schema/dhcpHWAddress.oa';
import { dhcpLeaseDN } from '../DHCP-Schema/dhcpLeaseDN.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';


/* START_OF_SYMBOL_DEFINITION dhcpHost */
/**
 * @summary dhcpHost
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpHost OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {dhcpLeaseDN | dhcpHWAddress | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpHost"}
 *     LDAP-DESC       "This represents information about a particular client"
 *     ID              { 2 16 840 1 113719 1 203 6 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpHost: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpLeaseDN,
        dhcpHWAddress,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpHost'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This represents information about a particular client' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 6,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpHost */

/* eslint-enable */
