/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    EquivalentLabels,
    _decode_EquivalentLabels,
    _encode_EquivalentLabels,
} from '../ExtendedSecurityServices-2009/EquivalentLabels.ta';
import { id_aa_equivalentLabels } from '../ExtendedSecurityServices-2009/id-aa-equivalentLabels.va';

/* START_OF_SYMBOL_DEFINITION aa_equivalentLabels */
/**
 * @summary aa_equivalentLabels
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-equivalentLabels ATTRIBUTE ::= {
 *     WITH SYNTAX     EquivalentLabels
 *     ID              id-aa-equivalentLabels }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<EquivalentLabels>}
 * @implements {ATTRIBUTE<EquivalentLabels>}
 */
export const aa_equivalentLabels: ATTRIBUTE<EquivalentLabels> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_EquivalentLabels,
    },
    encoderFor: {
        '&Type': _encode_EquivalentLabels,
    },
    '&id': id_aa_equivalentLabels /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_equivalentLabels */

/* eslint-enable */
