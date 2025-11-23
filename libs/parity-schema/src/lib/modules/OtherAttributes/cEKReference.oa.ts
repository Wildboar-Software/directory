/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    CEKReference,
    _decode_CEKReference,
    _encode_CEKReference,
} from '../OtherAttributes/CEKReference.ta';
import { id_aa_CEKReference } from '../OtherAttributes/id-aa-CEKReference.va';

/* START_OF_SYMBOL_DEFINITION cEKReference */
/**
 * @summary cEKReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * cEKReference ATTRIBUTE ::= {
 *     WITH SYNTAX               CEKReference
 *     EQUALITY MATCHING RULE    octetStringMatch
 *     SINGLE VALUE              TRUE
 *     ID                        id-aa-CEKReference }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<CEKReference>}
 * @implements {ATTRIBUTE<CEKReference>}
 */
export const cEKReference: ATTRIBUTE<CEKReference> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_CEKReference,
    },
    encoderFor: {
        '&Type': _encode_CEKReference,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION cEKReference */

/* eslint-enable */
