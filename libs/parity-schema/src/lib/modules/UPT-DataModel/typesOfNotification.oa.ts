/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_typesOfNotification } from '../UPT-DataModel/id-at-typesOfNotification.va';
import {
    TypesOfNotification,
    _decode_TypesOfNotification,
    _encode_TypesOfNotification,
} from '../UPT-DataModel/TypesOfNotification.ta';

/* START_OF_SYMBOL_DEFINITION typesOfNotification */
/**
 * @summary typesOfNotification
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * typesOfNotification ATTRIBUTE ::= {
 *   WITH SYNTAX   TypesOfNotification
 *   SINGLE VALUE  TRUE
 *   ID            id-at-typesOfNotification
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TypesOfNotification>}
 * @implements {ATTRIBUTE<TypesOfNotification>}
 */
export const typesOfNotification: ATTRIBUTE<TypesOfNotification> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TypesOfNotification,
    },
    encoderFor: {
        '&Type': _encode_TypesOfNotification,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_typesOfNotification /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION typesOfNotification */

/* eslint-enable */
