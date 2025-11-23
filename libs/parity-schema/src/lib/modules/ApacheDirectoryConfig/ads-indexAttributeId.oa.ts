/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { objectIdentifierMatch } from '@wildboar/x500/InformationFramework';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { oid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
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
export { objectIdentifierMatch } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { name } from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION ads_indexAttributeId */
/**
 * @summary ads_indexAttributeId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-indexAttributeId ATTRIBUTE ::= {
 *     SUBTYPE OF                  name
 *     WITH SYNTAX                 OBJECT IDENTIFIER
 *     EQUALITY MATCHING RULE      objectIdentifierMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 oid.&id
 *     LDAP-NAME                   {"ads-indexAttributeId"}
 *     LDAP-DESC                   "The attributeType name or OID"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 160 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OBJECT_IDENTIFIER>}
 * @implements {ATTRIBUTE<OBJECT_IDENTIFIER>}
 */
export const ads_indexAttributeId: ATTRIBUTE<OBJECT_IDENTIFIER> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeObjectIdentifier,
    },
    encoderFor: {
        '&Type': $._encodeObjectIdentifier,
    },
    '&derivation': name /* OBJECT_FIELD_SETTING */,
    '&equality-match': objectIdentifierMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': oid['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-indexAttributeId'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The attributeType name or OID' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 160,
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
/* END_OF_SYMBOL_DEFINITION ads_indexAttributeId */

/* eslint-enable */
