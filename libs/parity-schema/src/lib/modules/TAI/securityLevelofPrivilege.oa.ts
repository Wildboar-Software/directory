/* eslint-disable */
import { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
import { id_tai_ce_biometricSecurityLevelOfPrivilege } from '../TAI/id-tai-ce-biometricSecurityLevelOfPrivilege.va';
import {
    SecurityLevelofPrivilege,
    _decode_SecurityLevelofPrivilege,
    _encode_SecurityLevelofPrivilege,
} from '../TAI/SecurityLevelofPrivilege.ta';
export { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
export { id_tai_ce_biometricSecurityLevelOfPrivilege } from '../TAI/id-tai-ce-biometricSecurityLevelOfPrivilege.va';
export {
    SecurityLevelofPrivilege,
    _decode_SecurityLevelofPrivilege,
    _encode_SecurityLevelofPrivilege,
} from '../TAI/SecurityLevelofPrivilege.ta';

/* START_OF_SYMBOL_DEFINITION securityLevelofPrivilege */
/**
 * @summary securityLevelofPrivilege
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * securityLevelofPrivilege EXTENSION ::= {
 *   SYNTAX         SecurityLevelofPrivilege
 *   IDENTIFIED BY  id-tai-ce-biometricSecurityLevelOfPrivilege
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<SecurityLevelofPrivilege>}
 * @implements {EXTENSION<SecurityLevelofPrivilege>}
 */
export const securityLevelofPrivilege: EXTENSION<SecurityLevelofPrivilege> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_SecurityLevelofPrivilege,
    },
    encoderFor: {
        '&ExtnType': _encode_SecurityLevelofPrivilege,
    },
    '&id': id_tai_ce_biometricSecurityLevelOfPrivilege /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION securityLevelofPrivilege */

/* eslint-enable */
