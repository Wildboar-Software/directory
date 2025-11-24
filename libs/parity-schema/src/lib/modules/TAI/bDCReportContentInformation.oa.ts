/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    BDCReportContentInformation,
    _decode_BDCReportContentInformation,
    _encode_BDCReportContentInformation,
} from '../TAI/BDCReportContentInformation.ta';
import { id_tai_at_bDCReportContentInformation } from '../TAI/id-tai-at-bDCReportContentInformation.va';

export {
    BDCReportContentInformation,
    _decode_BDCReportContentInformation,
    _encode_BDCReportContentInformation,
} from '../TAI/BDCReportContentInformation.ta';

/* START_OF_SYMBOL_DEFINITION bDCReportContentInformation */
/**
 * @summary bDCReportContentInformation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bDCReportContentInformation ATTRIBUTE ::= {
 *   WITH SYNTAX  BDCReportContentInformation
 *   ID           id-tai-at-bDCReportContentInformation
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BDCReportContentInformation>}
 * @implements {ATTRIBUTE<BDCReportContentInformation>}
 */
export const bDCReportContentInformation: ATTRIBUTE<BDCReportContentInformation> =
    {
        class: 'ATTRIBUTE',
        decoderFor: {
            '&Type': _decode_BDCReportContentInformation,
        },
        encoderFor: {
            '&Type': _encode_BDCReportContentInformation,
        },
        '&id': id_tai_at_bDCReportContentInformation /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
        '&Type':
            0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
        '&single-valued':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&collective':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&no-user-modification':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&usage':
            userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&obsolete':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    };
/* END_OF_SYMBOL_DEFINITION bDCReportContentInformation */

/* eslint-enable */
