/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
import { dn } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/InformationFramework';
export {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
export { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { dn } from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION ads_baseDn */
/**
 * @summary ads_baseDn
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-baseDn ATTRIBUTE ::= {
 *     WITH SYNTAX                 DistinguishedName
 *     EQUALITY MATCHING RULE      distinguishedNameMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 dn.&id
 *     LDAP-NAME                   {"ads-baseDn"}
 *     LDAP-DESC                   "The base DN from which the authenticator is valid"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 935 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export const ads_baseDn: ATTRIBUTE<DistinguishedName> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DistinguishedName,
    },
    encoderFor: {
        '&Type': _encode_DistinguishedName,
    },
    '&equality-match': distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': dn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-baseDn'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The base DN from which the authenticator is valid' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 935,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_baseDn */

/* eslint-enable */
