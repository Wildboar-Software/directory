/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dhcpClassData } from '../DHCP-Schema/dhcpClassData.oa';
import { dhcpOptionsDN } from '../DHCP-Schema/dhcpOptionsDN.oa';
import { dhcpStatements } from '../DHCP-Schema/dhcpStatements.oa';


/* START_OF_SYMBOL_DEFINITION dhcpSubClass */
/**
 * @summary dhcpSubClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dhcpSubClass OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {dhcpClassData | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpSubClass"}
 *     LDAP-DESC       "Represents information about a collection of related classes."
 *     ID              { 2 16 840 1 113719 1 203 6 8 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dhcpSubClass: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dhcpClassData,
        dhcpOptionsDN,
        dhcpStatements,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dhcpSubClass'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Represents information about a collection of related classes.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113719, 1, 203, 6, 8,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpSubClass */

/* eslint-enable */
