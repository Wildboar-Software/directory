/* eslint-disable */
import {
    BPUReport,
    _decode_BPUReport,
    _encode_BPUReport,
} from '../TAI/BPUReport.ta';
import { CONTENT_TYPE } from '../TAI/CONTENT-TYPE.oca';
import { id_bpuReport } from '../TAI/id-bpuReport.va';
export {
    BPUReport,
    _decode_BPUReport,
    _encode_BPUReport,
} from '../TAI/BPUReport.ta';

/* START_OF_SYMBOL_DEFINITION bpuReport */
/**
 * @summary bpuReport
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bpuReport CONTENT-TYPE ::= {BPUReport
 *                             IDENTIFIED BY  id-bpuReport
 * }
 * ```
 *
 * @constant
 * @type {CONTENT_TYPE<BPUReport>}
 * @implements {CONTENT_TYPE<BPUReport>}
 */
export const bpuReport: CONTENT_TYPE<BPUReport> = {
    class: 'TYPE-IDENTIFIER',
    decoderFor: {
        '&Type': _decode_BPUReport,
    },
    encoderFor: {
        '&Type': _encode_BPUReport,
    },
    '&id': id_bpuReport /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bpuReport */

/* eslint-enable */
