/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_at_challengeResponse } from '../IN-CS3-object-identifiers/id-at-challengeResponse.va';
import {
    NPartsMessage,
    _decode_NPartsMessage,
    _encode_NPartsMessage,
} from '../IN-CS3-SCF-SDF-datatypes/NPartsMessage.ta';

/* START_OF_SYMBOL_DEFINITION stock */
/**
 * @summary stock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * stock ATTRIBUTE ::= {
 *   WITH SYNTAX  NPartsMessage
 *   ID           id-at-challengeResponse
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NPartsMessage>}
 * @implements {ATTRIBUTE<NPartsMessage>}
 */
export const stock: ATTRIBUTE<NPartsMessage> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_NPartsMessage,
    },
    encoderFor: {
        '&Type': _encode_NPartsMessage,
    },
    '&id': id_at_challengeResponse /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION stock */

/* eslint-enable */
