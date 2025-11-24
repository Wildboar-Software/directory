/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_tokenizedParts } from '../OtherAttributes/id-tokenizedParts.va';
import {
    Tokenized,
    _decode_Tokenized,
    _encode_Tokenized,
} from '../OtherAutomaticallyTaggedTypes/Tokenized.ta';

export {
    Tokenized,
    _decode_Tokenized,
    _encode_Tokenized,
} from '../OtherAutomaticallyTaggedTypes/Tokenized.ta';

/* START_OF_SYMBOL_DEFINITION tokenizedParts */
/**
 * @summary tokenizedParts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tokenizedParts ATTRIBUTE ::= {
 *     WITH SYNTAX     Tokenized
 *     ID              id-tokenizedParts
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Tokenized>}
 * @implements {ATTRIBUTE<Tokenized>}
 */
export const tokenizedParts: ATTRIBUTE<Tokenized> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Tokenized,
    },
    encoderFor: {
        '&Type': _encode_Tokenized,
    },
    '&id': id_tokenizedParts /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION tokenizedParts */

/* eslint-enable */
