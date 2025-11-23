/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
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
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
export {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION javaReferenceAddress */
/**
 * @summary javaReferenceAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * javaReferenceAddress ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE      caseExactMatch
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                   {"javaReferenceAddress"}
 *     LDAP-DESC                   "Addresses associated with a JNDI Reference"
 *     ID                          { 1 3 6 1 4 1 42 2 27 4 1 11 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const javaReferenceAddress: ATTRIBUTE<UnboundedDirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        '&Type': _encode_UnboundedDirectoryString,
    },
    '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['javaReferenceAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Addresses associated with a JNDI Reference' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 1, 11,
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
/* END_OF_SYMBOL_DEFINITION javaReferenceAddress */

/* eslint-enable */
