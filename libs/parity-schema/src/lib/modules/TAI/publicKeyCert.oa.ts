/* eslint-disable */
import type { EXTENSION } from '@wildboar/x500/AuthenticationFramework';
import { id_tai_ce_publicKeyCert } from '../TAI/id-tai-ce-publicKeyCert.va';
import {
    PublicKeyCert,
    _decode_PublicKeyCert,
    _encode_PublicKeyCert,
} from '../TAI/PublicKeyCert.ta';
export {
    PublicKeyCert,
    _decode_PublicKeyCert,
    _encode_PublicKeyCert,
} from '../TAI/PublicKeyCert.ta';

/* START_OF_SYMBOL_DEFINITION publicKeyCert */
/**
 * @summary publicKeyCert
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * publicKeyCert EXTENSION ::= {
 *   SYNTAX         PublicKeyCert
 *   IDENTIFIED BY  id-tai-ce-publicKeyCert
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<PublicKeyCert>}
 * @implements {EXTENSION<PublicKeyCert>}
 */
export const publicKeyCert: EXTENSION<PublicKeyCert> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_PublicKeyCert,
    },
    encoderFor: {
        '&ExtnType': _encode_PublicKeyCert,
    },
    '&id': id_tai_ce_publicKeyCert /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION publicKeyCert */

/* eslint-enable */
