/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_searchBaseDN } from '../ApacheDirectoryConfig/ads-searchBaseDN.oa';
import { ads_server } from '../ApacheDirectoryConfig/ads-server.oa';


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
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 260,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_dsBasedServer */

/* eslint-enable */
