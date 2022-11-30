/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_httpConfFile } from '../ApacheDirectoryConfig/ads-httpConfFile.oa';
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
export { ads_httpConfFile } from '../ApacheDirectoryConfig/ads-httpConfFile.oa';
export { ads_server } from '../ApacheDirectoryConfig/ads-server.oa';

/* START_OF_SYMBOL_DEFINITION ads_httpServer */
/**
 * @summary ads_httpServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-httpServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-server}
 *     MAY CONTAIN     {ads-httpConfFile}
 *     LDAP-NAME       {"ads-httpServer"}
 *     LDAP-DESC       "integrated jetty http server"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 804 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_httpServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_server] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [ads_httpConfFile] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-httpServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'integrated jetty http server' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 804,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_httpServer */

/* eslint-enable */
