/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    type DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
import { distinguishedName } from '@wildboar/x500/SelectedAttributeTypes';
import { dn } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';



/* START_OF_SYMBOL_DEFINITION ads_searchBaseDN */
/**
 * @summary ads_searchBaseDN
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-searchBaseDN ATTRIBUTE ::= {
 *     SUBTYPE OF                  distinguishedName
 *     WITH SYNTAX                 DistinguishedName
 *     EQUALITY MATCHING RULE      distinguishedNameMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 dn.&id
 *     LDAP-NAME                   {"ads-searchBaseDN"}
 *     LDAP-DESC                   "base DN of the DIT to be searched or replicated"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 820 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export const ads_searchBaseDN: ATTRIBUTE<DistinguishedName> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DistinguishedName,
    },
    encoderFor: {
        '&Type': _encode_DistinguishedName,
    },
    '&derivation': distinguishedName /* OBJECT_FIELD_SETTING */,
    '&equality-match': distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': dn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-searchBaseDN'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'base DN of the DIT to be searched or replicated' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 820,
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
/* END_OF_SYMBOL_DEFINITION ads_searchBaseDN */

/* eslint-enable */
