/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
import { distinguishedNameMatch } from '@wildboar/x500/src/lib/modules/InformationFramework/distinguishedNameMatch.oa';
import { distinguishedName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/distinguishedName.oa';
import { dn } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
export { distinguishedNameMatch } from '@wildboar/x500/src/lib/modules/InformationFramework/distinguishedNameMatch.oa';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { distinguishedName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/distinguishedName.oa';
export { dn } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa';

/* START_OF_SYMBOL_DEFINITION krb5PrincipalRealm */
/**
 * @summary krb5PrincipalRealm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5PrincipalRealm ATTRIBUTE ::= {
 *     SUBTYPE OF                  distinguishedName
 *     WITH SYNTAX                 DistinguishedName
 *     EQUALITY MATCHING RULE      distinguishedNameMatch
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 dn.&id
 *     LDAP-NAME                   {"krb5PrincipalRealm"}
 *     LDAP-DESC                   "Distinguished name of krb5Realm entry"
 *     ID                          { 1 3 6 1 4 1 5322 10 1 11 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export const krb5PrincipalRealm: ATTRIBUTE<DistinguishedName> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DistinguishedName,
    },
    encoderFor: {
        '&Type': _encode_DistinguishedName,
    },
    '&derivation': distinguishedName /* OBJECT_FIELD_SETTING */,
    '&equality-match': distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': dn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5PrincipalRealm'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Distinguished name of krb5Realm entry' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 5322, 10, 1, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5PrincipalRealm */

/* eslint-enable */
