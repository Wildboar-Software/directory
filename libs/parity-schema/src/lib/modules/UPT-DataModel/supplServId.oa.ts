/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_supplServId } from '../UPT-DataModel/id-at-supplServId.va';
import {
    SS_Code,
    _decode_SS_Code,
    _encode_SS_Code,
} from '../UPT-DataModel/SS-Code.ta';

/* START_OF_SYMBOL_DEFINITION supplServId */
/**
 * @summary supplServId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * supplServId ATTRIBUTE ::= {
 *   WITH SYNTAX             SS-Code
 *   EQUALITY MATCHING RULE  integerMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-supplServId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SS_Code>}
 * @implements {ATTRIBUTE<SS_Code>}
 */
export const supplServId: ATTRIBUTE<SS_Code> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SS_Code,
    },
    encoderFor: {
        '&Type': _encode_SS_Code,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_supplServId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION supplServId */

/* eslint-enable */
