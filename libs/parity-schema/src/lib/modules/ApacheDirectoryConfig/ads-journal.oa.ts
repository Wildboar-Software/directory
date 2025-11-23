/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_journalFileName } from '../ApacheDirectoryConfig/ads-journalFileName.oa';
import { ads_journalId } from '../ApacheDirectoryConfig/ads-journalId.oa';
import { ads_journalRotation } from '../ApacheDirectoryConfig/ads-journalRotation.oa';
import { ads_journalWorkingDir } from '../ApacheDirectoryConfig/ads-journalWorkingDir.oa';
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
export { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
export { ads_journalFileName } from '../ApacheDirectoryConfig/ads-journalFileName.oa';
export { ads_journalId } from '../ApacheDirectoryConfig/ads-journalId.oa';
export { ads_journalRotation } from '../ApacheDirectoryConfig/ads-journalRotation.oa';
export { ads_journalWorkingDir } from '../ApacheDirectoryConfig/ads-journalWorkingDir.oa';

/* START_OF_SYMBOL_DEFINITION ads_journal */
/**
 * @summary ads_journal
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-journal OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {
 *         ads-journalWorkingDir
 *         | ads-journalRotation
 *         | ads-journalId
 *         | ads-journalFileName
 *     }
 *     LDAP-NAME       {"ads-journal"}
 *     LDAP-DESC       "The Journal"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 140 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_journal: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_journalWorkingDir,
        ads_journalRotation,
        ads_journalId,
        ads_journalFileName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-journal'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The Journal' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 140,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_journal */

/* eslint-enable */
