/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { uuid } from '../UUID/uuid.oa';
import { uuidMatch } from '../UUID/uuidMatch.oa';
import { uuidOrderingMatch } from '../UUID/uuidOrderingMatch.oa';
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
export {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
export { uuid } from '../UUID/uuid.oa';
export { uuidMatch } from '../UUID/uuidMatch.oa';
export { uuidOrderingMatch } from '../UUID/uuidOrderingMatch.oa';

/* START_OF_SYMBOL_DEFINITION superiorUUID */
/**
 * @summary superiorUUID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * superiorUUID ATTRIBUTE ::= {
 *     WITH SYNTAX                 UUID
 *     EQUALITY MATCHING RULE         uuidMatch
 *     ORDERING MATCHING RULE      uuidOrderingMatch
 *     SINGLE VALUE                TRUE
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       directoryOperation
 *     LDAP-SYNTAX                 uuid.&id
 *     LDAP-NAME                     {"superiorUUID"}
 *     LDAP-DESC                   "UUID of the superior entry"
 *     ID { 1 3 6 1 4 1 4203 666 1 11 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UUID>}
 * @implements {ATTRIBUTE<UUID>}
 */
export const superiorUUID: ATTRIBUTE<UUID> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UUID,
    },
    encoderFor: {
        '&Type': _encode_UUID,
    },
    '&equality-match': uuidMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': uuidOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&no-user-modification': true /* OBJECT_FIELD_SETTING */,
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': uuid['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['superiorUUID'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'UUID of the superior entry' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 4203, 666, 1, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION superiorUUID */

/* eslint-enable */
