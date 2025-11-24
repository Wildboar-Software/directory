/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { signcrypted_envelope } from '../OtherAttributes/signcrypted-envelope.va';
import {
    SigncryptedKey,
    _decode_SigncryptedKey,
    _encode_SigncryptedKey,
} from '../OtherAutomaticallyTaggedTypes/SigncryptedKey.ta';

/* START_OF_SYMBOL_DEFINITION signcryptedEnvelope */
/**
 * @summary signcryptedEnvelope
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * signcryptedEnvelope ATTRIBUTE ::= {
 *     WITH SYNTAX         SigncryptedKey
 *     ID                  signcrypted-envelope }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SigncryptedKey>}
 * @implements {ATTRIBUTE<SigncryptedKey>}
 */
export const signcryptedEnvelope: ATTRIBUTE<SigncryptedKey> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SigncryptedKey,
    },
    encoderFor: {
        '&Type': _encode_SigncryptedKey,
    },
    '&id': signcrypted_envelope /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION signcryptedEnvelope */

/* eslint-enable */
