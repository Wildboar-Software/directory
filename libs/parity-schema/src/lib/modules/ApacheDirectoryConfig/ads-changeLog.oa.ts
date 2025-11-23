/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_changeLogExposed } from '../ApacheDirectoryConfig/ads-changeLogExposed.oa';
import { ads_changeLogId } from '../ApacheDirectoryConfig/ads-changeLogId.oa';
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
export { ads_changeLogExposed } from '../ApacheDirectoryConfig/ads-changeLogExposed.oa';
export { ads_changeLogId } from '../ApacheDirectoryConfig/ads-changeLogId.oa';

/* START_OF_SYMBOL_DEFINITION ads_changeLog */
/**
 * @summary ads_changeLog
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-changeLog OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {ads-changeLogExposed | ads-changeLogId}
 *     LDAP-NAME       {"ads-changeLog"}
 *     LDAP-DESC       "The ChangeLog"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 120 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_changeLog: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_changeLogExposed,
        ads_changeLogId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-changeLog'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The ChangeLog' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 120,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_changeLog */

/* eslint-enable */
