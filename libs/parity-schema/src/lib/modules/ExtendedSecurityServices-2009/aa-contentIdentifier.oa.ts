/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    ContentIdentifier,
    _decode_ContentIdentifier,
    _encode_ContentIdentifier,
} from '../ExtendedSecurityServices-2009/ContentIdentifier.ta';
import { id_aa_contentIdentifier } from '../ExtendedSecurityServices-2009/id-aa-contentIdentifier.va';

/* START_OF_SYMBOL_DEFINITION aa_contentIdentifier */
/**
 * @summary aa_contentIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-contentIdentifier ATTRIBUTE ::= {
 *     WITH SYNTAX     ContentIdentifier
 *     ID              id-aa-contentIdentifier }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ContentIdentifier>}
 * @implements {ATTRIBUTE<ContentIdentifier>}
 */
export const aa_contentIdentifier: ATTRIBUTE<ContentIdentifier> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ContentIdentifier,
    },
    encoderFor: {
        '&Type': _encode_ContentIdentifier,
    },
    '&id': id_aa_contentIdentifier /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_contentIdentifier */

/* eslint-enable */
