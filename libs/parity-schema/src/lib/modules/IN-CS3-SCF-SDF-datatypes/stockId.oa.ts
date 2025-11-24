/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { objectIdentifierMatch } from '@wildboar/x500/InformationFramework';
import { id_at_stockId } from '../IN-CS3-object-identifiers/id-at-stockId.va';
import {
    DT_Code,
    _decode_DT_Code,
    _encode_DT_Code,
} from '../IN-CS3-SCF-SDF-datatypes/DT-Code.ta';

/* START_OF_SYMBOL_DEFINITION stockId */
/**
 * @summary stockId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * stockId ATTRIBUTE ::= {
 *   WITH SYNTAX             DT-Code
 *   EQUALITY MATCHING RULE  objectIdentifierMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-stockId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DT_Code>}
 * @implements {ATTRIBUTE<DT_Code>}
 */
export const stockId: ATTRIBUTE<DT_Code> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DT_Code,
    },
    encoderFor: {
        '&Type': _encode_DT_Code,
    },
    '&equality-match': objectIdentifierMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_stockId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION stockId */

/* eslint-enable */
