/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_mlExpandHistory } from '../ExtendedSecurityServices-2009/id-aa-mlExpandHistory.va';
import {
    MLExpansionHistory,
    _decode_MLExpansionHistory,
    _encode_MLExpansionHistory,
} from '../ExtendedSecurityServices-2009/MLExpansionHistory.ta';

/* START_OF_SYMBOL_DEFINITION aa_mlExpandHistory */
/**
 * @summary aa_mlExpandHistory
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-mlExpandHistory ATTRIBUTE ::= {
 *     WITH SYNTAX     MLExpansionHistory
 *     ID              id-aa-mlExpandHistory }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MLExpansionHistory>}
 * @implements {ATTRIBUTE<MLExpansionHistory>}
 */
export const aa_mlExpandHistory: ATTRIBUTE<MLExpansionHistory> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MLExpansionHistory,
    },
    encoderFor: {
        '&Type': _encode_MLExpansionHistory,
    },
    '&id': id_aa_mlExpandHistory /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_mlExpandHistory */

/* eslint-enable */
