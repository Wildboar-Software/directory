/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    type DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import { distinguishedNameMatch } from '@wildboar/x500/InformationFramework';
import { dn } from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_dynamicSubtrees } from '../RFC2589DynamicDirectory/id-at-dynamicSubtrees.va';



/* START_OF_SYMBOL_DEFINITION dynamicSubtrees */
/**
 * @summary dynamicSubtrees
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dynamicSubtrees ATTRIBUTE ::= {
 *     WITH SYNTAX                 DistinguishedName
 *     EQUALITY MATCHING RULE         distinguishedNameMatch
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       dSAOperation
 *     LDAP-SYNTAX                 dn.&id
 *     LDAP-NAME                     {"dynamicSubtrees"}
 *     LDAP-DESC                    "This operational attribute is maintained by the server and is present in the Root DSE, if the server supports the dynamic extensions described in this memo. The attribute contains a list of all the subtrees in this directory for which the server supports the dynamic extensions."
 *     ID                          id-at-dynamicSubtrees
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export const dynamicSubtrees: ATTRIBUTE<DistinguishedName> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DistinguishedName,
    },
    encoderFor: {
        '&Type': _encode_DistinguishedName,
    },
    '&equality-match': distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    '&no-user-modification': true /* OBJECT_FIELD_SETTING */,
    '&usage': dSAOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': dn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dynamicSubtrees'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This operational attribute is maintained by the server and is present in the Root DSE, if the server supports the dynamic extensions described in this memo. The attribute contains a list of all the subtrees in this directory for which the server supports the dynamic extensions.' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_dynamicSubtrees /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dynamicSubtrees */

/* eslint-enable */
