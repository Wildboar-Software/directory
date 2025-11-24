/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpOption } from '../DHCP-Schema/dhcpOption.oa';


/* START_OF_SYMBOL_DEFINITION dhcpOptions */
/**
 * @summary dhcpOptions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpOptions OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {dhcpOption}
 *     LDAP-NAME       {"dhcpOptions"}
 *     LDAP-DESC       "Represents information about a collection of options defined."
 *     ID              { 2 16 840 1 113719 1 203 6 9 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpOptions: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [dhcpOption] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpOptions'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Represents information about a collection of options defined.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 9,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpOptions */

/* eslint-enable */
