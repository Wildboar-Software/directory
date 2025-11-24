/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    CallInfoRecord,
    _decode_CallInfoRecord,
    _encode_CallInfoRecord,
} from '../UPT-DataModel/CallInfoRecord.ta';
import { id_at_callInfoRecords } from '../UPT-DataModel/id-at-callInfoRecords.va';

export {
    CallInfoRecord,
    _decode_CallInfoRecord,
    _encode_CallInfoRecord,
} from '../UPT-DataModel/CallInfoRecord.ta';

/* START_OF_SYMBOL_DEFINITION callInfoRecords */
/**
 * @summary callInfoRecords
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callInfoRecords ATTRIBUTE ::= {
 *   WITH SYNTAX  CallInfoRecord
 *   ID           id-at-callInfoRecords
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<CallInfoRecord>}
 * @implements {ATTRIBUTE<CallInfoRecord>}
 */
export const callInfoRecords: ATTRIBUTE<CallInfoRecord> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_CallInfoRecord,
    },
    encoderFor: {
        '&Type': _encode_CallInfoRecord,
    },
    '&id': id_at_callInfoRecords /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION callInfoRecords */

/* eslint-enable */
