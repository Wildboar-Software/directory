/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_lockSession } from '../IN-CS3-object-identifiers/id-at-lockSession.va';
import {
    LockSession,
    _decode_LockSession,
    _encode_LockSession,
} from '../IN-CS3-SCF-SDF-datatypes/LockSession.ta';
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
export { id_at_lockSession } from '../IN-CS3-object-identifiers/id-at-lockSession.va';
export {
    LockSession,
    _decode_LockSession,
    _encode_LockSession,
} from '../IN-CS3-SCF-SDF-datatypes/LockSession.ta';

/* START_OF_SYMBOL_DEFINITION lockSession */
/**
 * @summary lockSession
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * lockSession ATTRIBUTE ::= {
 *   WITH SYNTAX   LockSession
 *   SINGLE VALUE  TRUE
 *   ID            id-at-lockSession
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<LockSession>}
 * @implements {ATTRIBUTE<LockSession>}
 */
export const lockSession: ATTRIBUTE<LockSession> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_LockSession,
    },
    encoderFor: {
        '&Type': _encode_LockSession,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_lockSession /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION lockSession */

/* eslint-enable */
