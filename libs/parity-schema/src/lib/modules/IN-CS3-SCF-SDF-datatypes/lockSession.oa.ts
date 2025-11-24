/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_lockSession } from '../IN-CS3-object-identifiers/id-at-lockSession.va';
import {
    LockSession,
    _decode_LockSession,
    _encode_LockSession,
} from '../IN-CS3-SCF-SDF-datatypes/LockSession.ta';

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
