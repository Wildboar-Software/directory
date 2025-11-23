/* eslint-disable */
import {
    AuthenticationLevel,
    _decode_AuthenticationLevel,
    _encode_AuthenticationLevel,
} from '@wildboar/x500/BasicAccessControl';
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_bindLevelIfOK } from '../IN-CS3-object-identifiers/id-at-bindLevelIfOK.va';
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
export { id_at_bindLevelIfOK } from '../IN-CS3-object-identifiers/id-at-bindLevelIfOK.va';

/* START_OF_SYMBOL_DEFINITION bindLevelIfOK */
/**
 * @summary bindLevelIfOK
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bindLevelIfOK ATTRIBUTE ::= {
 *   WITH SYNTAX   AuthenticationLevel
 *   SINGLE VALUE  TRUE
 *   ID            id-at-bindLevelIfOK
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AuthenticationLevel>}
 * @implements {ATTRIBUTE<AuthenticationLevel>}
 */
export const bindLevelIfOK: ATTRIBUTE<AuthenticationLevel> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AuthenticationLevel,
    },
    encoderFor: {
        '&Type': _encode_AuthenticationLevel,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_bindLevelIfOK /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION bindLevelIfOK */

/* eslint-enable */
