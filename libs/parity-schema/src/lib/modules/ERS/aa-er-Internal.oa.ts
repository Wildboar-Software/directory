/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import {
    EvidenceRecord,
    _decode_EvidenceRecord,
    _encode_EvidenceRecord,
} from '../ERS/EvidenceRecord.ta';
import { id_aa_er_internal } from '../ERS/id-aa-er-internal.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export {
    EvidenceRecord,
    _decode_EvidenceRecord,
    _encode_EvidenceRecord,
} from '../ERS/EvidenceRecord.ta';
export { id_aa_er_internal } from '../ERS/id-aa-er-internal.va';

/* START_OF_SYMBOL_DEFINITION aa_er_Internal */
/**
 * @summary aa_er_Internal
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-er-Internal ATTRIBUTE ::= {
 *     WITH SYNTAX         EvidenceRecord
 *     ID                  id-aa-er-internal }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<EvidenceRecord>}
 * @implements {ATTRIBUTE<EvidenceRecord>}
 */
export const aa_er_Internal: ATTRIBUTE<EvidenceRecord> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_EvidenceRecord,
    },
    encoderFor: {
        '&Type': _encode_EvidenceRecord,
    },
    '&id': id_aa_er_internal /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_er_Internal */

/* eslint-enable */
