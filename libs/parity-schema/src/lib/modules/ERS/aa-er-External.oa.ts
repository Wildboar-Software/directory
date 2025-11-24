/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    EvidenceRecord,
    _decode_EvidenceRecord,
    _encode_EvidenceRecord,
} from '../ERS/EvidenceRecord.ta';
import { id_aa_er_external } from '../ERS/id-aa-er-external.va';

export {
    EvidenceRecord,
    _decode_EvidenceRecord,
    _encode_EvidenceRecord,
} from '../ERS/EvidenceRecord.ta';

/* START_OF_SYMBOL_DEFINITION aa_er_External */
/**
 * @summary aa_er_External
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-er-External ATTRIBUTE ::= {
 *     WITH SYNTAX         EvidenceRecord
 *     ID                  id-aa-er-external }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<EvidenceRecord>}
 * @implements {ATTRIBUTE<EvidenceRecord>}
 */
export const aa_er_External: ATTRIBUTE<EvidenceRecord> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_EvidenceRecord,
    },
    encoderFor: {
        '&Type': _encode_EvidenceRecord,
    },
    '&id': id_aa_er_external /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_er_External */

/* eslint-enable */
