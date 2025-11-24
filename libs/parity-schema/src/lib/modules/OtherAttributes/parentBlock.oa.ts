/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_parentBlock } from '../OtherAttributes/id-parentBlock.va';
import {
    type ParentBlock,
    _decode_ParentBlock,
    _encode_ParentBlock,
} from '../OtherAutomaticallyTaggedTypes/ParentBlock.ta';

/* START_OF_SYMBOL_DEFINITION parentBlock */
/**
 * @summary parentBlock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * parentBlock ATTRIBUTE ::= {
 *     WITH SYNTAX         ParentBlock
 *     ID                  id-parentBlock }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ParentBlock>}
 * @implements {ATTRIBUTE<ParentBlock>}
 */
export const parentBlock: ATTRIBUTE<ParentBlock> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ParentBlock,
    },
    encoderFor: {
        '&Type': _encode_ParentBlock,
    },
    '&id': id_parentBlock /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION parentBlock */

/* eslint-enable */
