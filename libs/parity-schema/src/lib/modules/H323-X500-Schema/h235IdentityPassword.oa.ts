/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { h235_id_at } from '../H323-X500-Schema/h235-id-at.va';
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
export { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { h235_id_at } from '../H323-X500-Schema/h235-id-at.va';

/* START_OF_SYMBOL_DEFINITION h235IdentityPassword */
/**
 * @summary h235IdentityPassword
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h235IdentityPassword ATTRIBUTE ::= {
 *   WITH SYNTAX             OCTET STRING
 *   EQUALITY MATCHING RULE  octetStringMatch
 *   ID                      {h235-id-at  2}
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const h235IdentityPassword: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2],
        h235_id_at
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
/* END_OF_SYMBOL_DEFINITION h235IdentityPassword */

/* eslint-enable */
