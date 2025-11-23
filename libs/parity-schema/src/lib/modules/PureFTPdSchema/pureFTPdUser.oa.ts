/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ftpDownloadBandwidth } from '../PureFTPdSchema/ftpDownloadBandwidth.oa';
import { ftpDownloadRatio } from '../PureFTPdSchema/ftpDownloadRatio.oa';
import { ftpGid } from '../PureFTPdSchema/ftpGid.oa';
import { ftpQuotaFiles } from '../PureFTPdSchema/ftpQuotaFiles.oa';
import { ftpQuotaMBytes } from '../PureFTPdSchema/ftpQuotaMBytes.oa';
import { ftpStatus } from '../PureFTPdSchema/ftpStatus.oa';
import { ftpUid } from '../PureFTPdSchema/ftpUid.oa';
import { ftpUploadBandwidth } from '../PureFTPdSchema/ftpUploadBandwidth.oa';
import { ftpUploadRatio } from '../PureFTPdSchema/ftpUploadRatio.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { ftpDownloadBandwidth } from '../PureFTPdSchema/ftpDownloadBandwidth.oa';
export { ftpDownloadRatio } from '../PureFTPdSchema/ftpDownloadRatio.oa';
export { ftpGid } from '../PureFTPdSchema/ftpGid.oa';
export { ftpQuotaFiles } from '../PureFTPdSchema/ftpQuotaFiles.oa';
export { ftpQuotaMBytes } from '../PureFTPdSchema/ftpQuotaMBytes.oa';
export { ftpStatus } from '../PureFTPdSchema/ftpStatus.oa';
export { ftpUid } from '../PureFTPdSchema/ftpUid.oa';
export { ftpUploadBandwidth } from '../PureFTPdSchema/ftpUploadBandwidth.oa';
export { ftpUploadRatio } from '../PureFTPdSchema/ftpUploadRatio.oa';

/* START_OF_SYMBOL_DEFINITION pureFTPdUser */
/**
 * @summary pureFTPdUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pureFTPdUser OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MAY CONTAIN     {
 *         ftpStatus
 *         | ftpQuotaFiles
 *         | ftpQuotaMBytes
 *         | ftpUploadRatio
 *         | ftpDownloadRatio
 *         | ftpUploadBandwidth
 *         | ftpDownloadBandwidth
 *         | ftpUid
 *         | ftpGid
 *     }
 *     LDAP-NAME       {"pureFTPdUser"}
 *     LDAP-DESC       "PureFTPd user with optional quota, throttling and ratio"
 *     ID              { 1 3 6 1 4 1 6981 11 2 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pureFTPdUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ftpStatus,
        ftpQuotaFiles,
        ftpQuotaMBytes,
        ftpUploadRatio,
        ftpDownloadRatio,
        ftpUploadBandwidth,
        ftpDownloadBandwidth,
        ftpUid,
        ftpGid,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pureFTPdUser'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'PureFTPd user with optional quota, throttling and ratio' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 6981, 11, 2, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pureFTPdUser */

/* eslint-enable */
