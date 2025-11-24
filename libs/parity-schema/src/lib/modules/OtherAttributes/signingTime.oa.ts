/* eslint-disable */
import {
    SigningTime,
    _decode_SigningTime,
    _encode_SigningTime,
} from '@wildboar/cms';
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_signingTime } from '../OtherAttributes/id-signingTime.va';


/* START_OF_SYMBOL_DEFINITION signingTime */
/**
 * @summary signingTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * signingTime ATTRIBUTE ::= {
 *     WITH SYNTAX         SigningTime
 *     ID                  id-signingTime }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SigningTime>}
 * @implements {ATTRIBUTE<SigningTime>}
 */
export const signingTime: ATTRIBUTE<SigningTime> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SigningTime,
    },
    encoderFor: {
        '&Type': _encode_SigningTime,
    },
    '&id': id_signingTime /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION signingTime */

/* eslint-enable */
