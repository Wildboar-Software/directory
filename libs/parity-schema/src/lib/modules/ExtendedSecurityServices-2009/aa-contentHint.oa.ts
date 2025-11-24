/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    ContentHints,
    _decode_ContentHints,
    _encode_ContentHints,
} from '../ExtendedSecurityServices-2009/ContentHints.ta';
import { id_aa_contentHint } from '../ExtendedSecurityServices-2009/id-aa-contentHint.va';

export {
    ContentHints,
    _decode_ContentHints,
    _encode_ContentHints,
} from '../ExtendedSecurityServices-2009/ContentHints.ta';

/* START_OF_SYMBOL_DEFINITION aa_contentHint */
/**
 * @summary aa_contentHint
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-contentHint ATTRIBUTE ::= {
 *     WITH SYNTAX     ContentHints
 *     ID              id-aa-contentHint }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ContentHints>}
 * @implements {ATTRIBUTE<ContentHints>}
 */
export const aa_contentHint: ATTRIBUTE<ContentHints> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ContentHints,
    },
    encoderFor: {
        '&Type': _encode_ContentHints,
    },
    '&id': id_aa_contentHint /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_contentHint */

/* eslint-enable */
