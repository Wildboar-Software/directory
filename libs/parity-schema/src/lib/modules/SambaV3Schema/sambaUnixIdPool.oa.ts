/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { gidNumber } from '../NIS/gidNumber.oa';
import { uidNumber } from '../NIS/uidNumber.oa';
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
export { top } from '@wildboar/x500/InformationFramework';
export { gidNumber } from '../NIS/gidNumber.oa';
export { uidNumber } from '../NIS/uidNumber.oa';

/* START_OF_SYMBOL_DEFINITION sambaUnixIdPool */
/**
 * @summary sambaUnixIdPool
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaUnixIdPool OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {gidNumber | uidNumber}
 *     LDAP-NAME       {"sambaUnixIdPool"}
 *     LDAP-DESC       "Pool for allocating UNIX uids/gids"
 *     ID              { 1 3 6 1 4 1 7165 2 2 7 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaUnixIdPool: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [gidNumber, uidNumber] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaUnixIdPool'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Pool for allocating UNIX uids/gids' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 7,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaUnixIdPool */

/* eslint-enable */
