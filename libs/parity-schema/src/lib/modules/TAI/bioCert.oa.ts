/* eslint-disable */
import { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
import { BioCert, _decode_BioCert, _encode_BioCert } from '../TAI/BioCert.ta';
import { id_tai_ce_bioCert } from '../TAI/id-tai-ce-bioCert.va';
export { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
export { BioCert, _decode_BioCert, _encode_BioCert } from '../TAI/BioCert.ta';
export { id_tai_ce_bioCert } from '../TAI/id-tai-ce-bioCert.va';

/* START_OF_SYMBOL_DEFINITION bioCert */
/**
 * @summary bioCert
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bioCert EXTENSION ::= {SYNTAX         BioCert
 *                        IDENTIFIED BY  id-tai-ce-bioCert
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<BioCert>}
 * @implements {EXTENSION<BioCert>}
 */
export const bioCert: EXTENSION<BioCert> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_BioCert,
    },
    encoderFor: {
        '&ExtnType': _encode_BioCert,
    },
    '&id': id_tai_ce_bioCert /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bioCert */

/* eslint-enable */
