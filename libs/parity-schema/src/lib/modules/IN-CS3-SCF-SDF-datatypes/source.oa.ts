/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_source } from '../IN-CS3-object-identifiers/id-at-source.va';
import {
    SourceType,
    _decode_SourceType,
    _encode_SourceType,
} from '../IN-CS3-SCF-SDF-datatypes/SourceType.ta';

/* START_OF_SYMBOL_DEFINITION source */
/**
 * @summary source
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * source ATTRIBUTE ::= {
 *   WITH SYNTAX   SourceType
 *   SINGLE VALUE  TRUE
 *   ID            id-at-source
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SourceType>}
 * @implements {ATTRIBUTE<SourceType>}
 */
export const source: ATTRIBUTE<SourceType> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SourceType,
    },
    encoderFor: {
        '&Type': _encode_SourceType,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_source /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION source */

/* eslint-enable */
