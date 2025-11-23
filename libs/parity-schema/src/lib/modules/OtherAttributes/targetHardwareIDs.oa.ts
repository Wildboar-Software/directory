/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_targetHardwareIDs } from '../OtherAttributes/id-aa-targetHardwareIDs.va';
import {
    TargetHardwareIdentifiers,
    _decode_TargetHardwareIdentifiers,
    _encode_TargetHardwareIdentifiers,
} from '../OtherImplicitlyTaggedTypes/TargetHardwareIdentifiers.ta';

/* START_OF_SYMBOL_DEFINITION targetHardwareIDs */
/**
 * @summary targetHardwareIDs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * targetHardwareIDs ATTRIBUTE ::= {
 *     WITH SYNTAX         TargetHardwareIdentifiers
 *     ID                  id-aa-targetHardwareIDs }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TargetHardwareIdentifiers>}
 * @implements {ATTRIBUTE<TargetHardwareIdentifiers>}
 */
export const targetHardwareIDs: ATTRIBUTE<TargetHardwareIdentifiers> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TargetHardwareIdentifiers,
    },
    encoderFor: {
        '&Type': _encode_TargetHardwareIdentifiers,
    },
    '&id': id_aa_targetHardwareIDs /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION targetHardwareIDs */

/* eslint-enable */
