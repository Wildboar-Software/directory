/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_timeStamped } from '../OtherAttributes/id-timeStamped.va';
import {
    TimeStamped,
    _decode_TimeStamped,
    _encode_TimeStamped,
} from '../OtherAutomaticallyTaggedTypes/TimeStamped.ta';

export {
    TimeStamped,
    _decode_TimeStamped,
    _encode_TimeStamped,
} from '../OtherAutomaticallyTaggedTypes/TimeStamped.ta';

/* START_OF_SYMBOL_DEFINITION timeStamped */
/**
 * @summary timeStamped
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * timeStamped ATTRIBUTE ::= {
 *     WITH SYNTAX         TimeStamped
 *     ID                  id-timeStamped }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TimeStamped>}
 * @implements {ATTRIBUTE<TimeStamped>}
 */
export const timeStamped: ATTRIBUTE<TimeStamped> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TimeStamped,
    },
    encoderFor: {
        '&Type': _encode_TimeStamped,
    },
    '&id': id_timeStamped /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION timeStamped */

/* eslint-enable */
