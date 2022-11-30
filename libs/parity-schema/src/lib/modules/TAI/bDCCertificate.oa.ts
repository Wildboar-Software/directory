/* eslint-disable */
import { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
import {
    BDCCertificateReferer,
    _decode_BDCCertificateReferer,
    _encode_BDCCertificateReferer,
} from '../TAI/BDCCertificateReferer.ta';
import { id_tai_ce_bDCCertificate } from '../TAI/id-tai-ce-bDCCertificate.va';
export { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
export {
    BDCCertificateReferer,
    _decode_BDCCertificateReferer,
    _encode_BDCCertificateReferer,
} from '../TAI/BDCCertificateReferer.ta';
export { id_tai_ce_bDCCertificate } from '../TAI/id-tai-ce-bDCCertificate.va';

/* START_OF_SYMBOL_DEFINITION bDCCertificate */
/**
 * @summary bDCCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bDCCertificate EXTENSION ::= {
 *   SYNTAX         BDCCertificateReferer
 *   IDENTIFIED BY  id-tai-ce-bDCCertificate
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<BDCCertificateReferer>}
 * @implements {EXTENSION<BDCCertificateReferer>}
 */
export const bDCCertificate: EXTENSION<BDCCertificateReferer> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_BDCCertificateReferer,
    },
    encoderFor: {
        '&ExtnType': _encode_BDCCertificateReferer,
    },
    '&id': id_tai_ce_bDCCertificate /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bDCCertificate */

/* eslint-enable */
