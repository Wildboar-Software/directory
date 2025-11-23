/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
import { distinguishedName } from '@wildboar/x500/SelectedAttributeTypes';
import { dn } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_dynGroupAttr } from '../DynGroup/id-dynGroupAttr.va';
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
export { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { dn } from '@wildboar/x500/SelectedAttributeTypes';
export { id_dynGroupAttr } from '../DynGroup/id-dynGroupAttr.va';

/* START_OF_SYMBOL_DEFINITION dgIdentity */
/**
 * @summary dgIdentity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dgIdentity ATTRIBUTE ::= {
 *     SUBTYPE OF                  distinguishedName
 *     EQUALITY MATCHING RULE         distinguishedNameMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 dn.&id
 *     LDAP-NAME                   {"dgIdentity"}
 *     LDAP-DESC "Identity to use when processing the memberURL"
 *     ID                          { id-dynGroupAttr 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const dgIdentity: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': distinguishedName /* OBJECT_FIELD_SETTING */,
    '&equality-match': distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': dn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dgIdentity'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Identity to use when processing the memberURL' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        id_dynGroupAttr
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION dgIdentity */

/* eslint-enable */
