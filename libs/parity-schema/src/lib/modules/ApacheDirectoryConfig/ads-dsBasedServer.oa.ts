/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_searchBaseDN } from '../ApacheDirectoryConfig/ads-searchBaseDN.oa';
import { ads_server } from '../ApacheDirectoryConfig/ads-server.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { ads_searchBaseDN } from '../ApacheDirectoryConfig/ads-searchBaseDN.oa';
export { ads_server } from '../ApacheDirectoryConfig/ads-server.oa';

/* START_OF_SYMBOL_DEFINITION ads_dsBasedServer */
/**
 * @summary ads_dsBasedServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-dsBasedServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-server}
 *     KIND            abstract
 *     MAY CONTAIN     {ads-searchBaseDN}
 *     LDAP-NAME       {"ads-dsBasedServer"}
 *     LDAP-DESC       "The DirectoryService based server ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 260 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_dsBasedServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_server] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [ads_searchBaseDN] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-dsBasedServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The DirectoryService based server ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 260,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_dsBasedServer */

/* eslint-enable */
