/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_sidechains } from '../OtherAttributes/id-sidechains.va';
import {
    type Sidechains,
    _decode_Sidechains,
    _encode_Sidechains,
} from '../OtherAutomaticallyTaggedTypes/Sidechains.ta';

/* START_OF_SYMBOL_DEFINITION sidechains */
/**
 * @summary sidechains
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sidechains ATTRIBUTE ::= {
 *     WITH SYNTAX         Sidechains
 *     ID                  id-sidechains }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Sidechains>}
 * @implements {ATTRIBUTE<Sidechains>}
 */
export const sidechains: ATTRIBUTE<Sidechains> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Sidechains,
    },
    encoderFor: {
        '&Type': _encode_Sidechains,
    },
    '&id': id_sidechains /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION sidechains */

/* eslint-enable */
