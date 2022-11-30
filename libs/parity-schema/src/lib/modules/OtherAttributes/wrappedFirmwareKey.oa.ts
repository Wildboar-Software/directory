/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_aa_wrappedFirmwareKey } from '../OtherAttributes/id-aa-wrappedFirmwareKey.va';
import {
    WrappedFirmwareKey,
    _decode_WrappedFirmwareKey,
    _encode_WrappedFirmwareKey,
} from '../OtherImplicitlyTaggedTypes/WrappedFirmwareKey.ta';

/* START_OF_SYMBOL_DEFINITION wrappedFirmwareKey */
/**
 * @summary wrappedFirmwareKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * wrappedFirmwareKey ATTRIBUTE ::= {
 *     WITH SYNTAX         WrappedFirmwareKey
 *     ID                  id-aa-wrappedFirmwareKey }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<WrappedFirmwareKey>}
 * @implements {ATTRIBUTE<WrappedFirmwareKey>}
 */
export const wrappedFirmwareKey: ATTRIBUTE<WrappedFirmwareKey> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_WrappedFirmwareKey,
    },
    encoderFor: {
        '&Type': _encode_WrappedFirmwareKey,
    },
    '&id': id_aa_wrappedFirmwareKey /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION wrappedFirmwareKey */

/* eslint-enable */
