/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    CEKMaxDecrypts,
    _decode_CEKMaxDecrypts,
    _encode_CEKMaxDecrypts,
} from '../OtherAttributes/CEKMaxDecrypts.ta';
import { id_aa_CEKReference } from '../OtherAttributes/id-aa-CEKReference.va';

/* START_OF_SYMBOL_DEFINITION cEKMaxDecrypts */
/**
 * @summary cEKMaxDecrypts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * cEKMaxDecrypts ATTRIBUTE ::= {
 *     WITH SYNTAX               CEKMaxDecrypts
 *     EQUALITY MATCHING RULE    integerMatch
 *     SINGLE VALUE              TRUE
 *     ID                        id-aa-CEKReference }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<CEKMaxDecrypts>}
 * @implements {ATTRIBUTE<CEKMaxDecrypts>}
 */
export const cEKMaxDecrypts: ATTRIBUTE<CEKMaxDecrypts> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_CEKMaxDecrypts,
    },
    encoderFor: {
        '&Type': _encode_CEKMaxDecrypts,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_aa_CEKReference /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION cEKMaxDecrypts */

/* eslint-enable */
