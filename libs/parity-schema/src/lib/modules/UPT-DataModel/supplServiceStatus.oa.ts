/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_supplServiceStatus } from '../UPT-DataModel/id-at-supplServiceStatus.va';
import {
    SupplServiceStatus,
    _decode_SupplServiceStatus,
    _encode_SupplServiceStatus,
} from '../UPT-DataModel/SupplServiceStatus.ta';

/* START_OF_SYMBOL_DEFINITION supplServiceStatus */
/**
 * @summary supplServiceStatus
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * supplServiceStatus ATTRIBUTE ::= {
 *   WITH SYNTAX   SupplServiceStatus
 *   SINGLE VALUE  TRUE
 *   ID            id-at-supplServiceStatus
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SupplServiceStatus>}
 * @implements {ATTRIBUTE<SupplServiceStatus>}
 */
export const supplServiceStatus: ATTRIBUTE<SupplServiceStatus> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SupplServiceStatus,
    },
    encoderFor: {
        '&Type': _encode_SupplServiceStatus,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_supplServiceStatus /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION supplServiceStatus */

/* eslint-enable */
