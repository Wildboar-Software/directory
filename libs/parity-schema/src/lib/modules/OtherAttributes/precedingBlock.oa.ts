/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_precedingBlock } from '../OtherAttributes/id-precedingBlock.va';
import {
    HashPointer,
    _decode_HashPointer,
    _encode_HashPointer,
} from '../OtherAutomaticallyTaggedTypes/HashPointer.ta';

export {
    HashPointer,
    _decode_HashPointer,
    _encode_HashPointer,
} from '../OtherAutomaticallyTaggedTypes/HashPointer.ta';

/* START_OF_SYMBOL_DEFINITION precedingBlock */
/**
 * @summary precedingBlock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * precedingBlock ATTRIBUTE ::= {
 *     WITH SYNTAX         HashPointer
 *     ID                  id-precedingBlock }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<HashPointer>}
 * @implements {ATTRIBUTE<HashPointer>}
 */
export const precedingBlock: ATTRIBUTE<HashPointer> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_HashPointer,
    },
    encoderFor: {
        '&Type': _encode_HashPointer,
    },
    '&id': id_precedingBlock /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION precedingBlock */

/* eslint-enable */
