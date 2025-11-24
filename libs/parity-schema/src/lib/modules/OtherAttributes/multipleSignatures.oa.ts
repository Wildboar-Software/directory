/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_multipleSignatures } from '../OtherAttributes/id-aa-multipleSignatures.va';
import {
    MultipleSignatures,
    _decode_MultipleSignatures,
    _encode_MultipleSignatures,
} from '../OtherImplicitlyTaggedTypes/MultipleSignatures.ta';

export {
    MultipleSignatures,
    _decode_MultipleSignatures,
    _encode_MultipleSignatures,
} from '../OtherImplicitlyTaggedTypes/MultipleSignatures.ta';

/* START_OF_SYMBOL_DEFINITION multipleSignatures */
/**
 * @summary multipleSignatures
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * multipleSignatures ATTRIBUTE ::= {
 *     WITH SYNTAX         MultipleSignatures
 *     ID                  id-aa-multipleSignatures }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MultipleSignatures>}
 * @implements {ATTRIBUTE<MultipleSignatures>}
 */
export const multipleSignatures: ATTRIBUTE<MultipleSignatures> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MultipleSignatures,
    },
    encoderFor: {
        '&Type': _encode_MultipleSignatures,
    },
    '&id': id_aa_multipleSignatures /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION multipleSignatures */

/* eslint-enable */
