/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integer } from '@wildboar/x500/SelectedAttributeTypes';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_at } from '../KerberosSchema/id-at.va';
import {
    SearchScope,
    _decode_SearchScope,
    _encode_SearchScope,
} from '../KerberosSchema/SearchScope.ta';

/* START_OF_SYMBOL_DEFINITION krbSearchScope */
/**
 * @summary krbSearchScope
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krbSearchScope ATTRIBUTE ::= {
 *     WITH SYNTAX                 SearchScope
 *     EQUALITY MATCHING RULE         integerMatch
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                     {"krbSearchScope"}
 *     LDAP-DESC                   "This attribute holds the scope for searching the principals"
 *     ID                          { id-at 25 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SearchScope>}
 * @implements {ATTRIBUTE<SearchScope>}
 */
export const krbSearchScope: ATTRIBUTE<SearchScope> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SearchScope,
    },
    encoderFor: {
        '&Type': _encode_SearchScope,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krbSearchScope'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This attribute holds the scope for searching the principals' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [25, 1],
        id_at
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krbSearchScope */

/* eslint-enable */
