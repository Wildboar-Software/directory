/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_tai_at_bioSecLevelReference } from '../TAI/id-tai-at-bioSecLevelReference.va';
import {
    SecurityLevelBioReference,
    _decode_SecurityLevelBioReference,
    _encode_SecurityLevelBioReference,
} from '../TAI/SecurityLevelBioReference.ta';

export {
    SecurityLevelBioReference,
    _decode_SecurityLevelBioReference,
    _encode_SecurityLevelBioReference,
} from '../TAI/SecurityLevelBioReference.ta';

/* START_OF_SYMBOL_DEFINITION bioSecLevelReference */
/**
 * @summary bioSecLevelReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bioSecLevelReference ATTRIBUTE ::= {
 *   WITH SYNTAX  SecurityLevelBioReference
 *   ID           id-tai-at-bioSecLevelReference
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SecurityLevelBioReference>}
 * @implements {ATTRIBUTE<SecurityLevelBioReference>}
 */
export const bioSecLevelReference: ATTRIBUTE<SecurityLevelBioReference> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SecurityLevelBioReference,
    },
    encoderFor: {
        '&Type': _encode_SecurityLevelBioReference,
    },
    '&id': id_tai_at_bioSecLevelReference /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION bioSecLevelReference */

/* eslint-enable */
