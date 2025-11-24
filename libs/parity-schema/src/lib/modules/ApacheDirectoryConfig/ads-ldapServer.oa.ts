/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_certificatePassword } from '../ApacheDirectoryConfig/ads-certificatePassword.oa';
import { ads_confidentialityRequired } from '../ApacheDirectoryConfig/ads-confidentialityRequired.oa';
import { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';
import { ads_keystoreFile } from '../ApacheDirectoryConfig/ads-keystoreFile.oa';
import { ads_maxPDUSize } from '../ApacheDirectoryConfig/ads-maxPDUSize.oa';
import { ads_maxSizeLimit } from '../ApacheDirectoryConfig/ads-maxSizeLimit.oa';
import { ads_maxTimeLimit } from '../ApacheDirectoryConfig/ads-maxTimeLimit.oa';
import { ads_replEnabled } from '../ApacheDirectoryConfig/ads-replEnabled.oa';
import { ads_replPingerSleep } from '../ApacheDirectoryConfig/ads-replPingerSleep.oa';
import { ads_replReqHandler } from '../ApacheDirectoryConfig/ads-replReqHandler.oa';
import { ads_saslHost } from '../ApacheDirectoryConfig/ads-saslHost.oa';
import { ads_saslPrincipal } from '../ApacheDirectoryConfig/ads-saslPrincipal.oa';
import { ads_saslRealms } from '../ApacheDirectoryConfig/ads-saslRealms.oa';


/* START_OF_SYMBOL_DEFINITION ads_ldapServer */
/**
 * @summary ads_ldapServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-ldapServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-dsBasedServer}
 *     MUST CONTAIN    {
 *         ads-confidentialityRequired
 *         | ads-maxSizeLimit
 *         | ads-maxTimeLimit
 *         | ads-maxPDUSize
 *         | ads-saslHost
 *         | ads-saslPrincipal
 *         | ads-saslRealms
 *         | ads-replEnabled
 *         | ads-replPingerSleep
 *     }
 *     MAY CONTAIN     {
 *         ads-keystoreFile
 *         | ads-certificatePassword
 *         | ads-replReqHandler
 *     }
 *     LDAP-NAME       {"ads-ldapServer"}
 *     LDAP-DESC       "The LdapServer ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 300 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_ldapServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_dsBasedServer] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_confidentialityRequired,
        ads_maxSizeLimit,
        ads_maxTimeLimit,
        ads_maxPDUSize,
        ads_saslHost,
        ads_saslPrincipal,
        ads_saslRealms,
        ads_replEnabled,
        ads_replPingerSleep,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_keystoreFile,
        ads_certificatePassword,
        ads_replReqHandler,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-ldapServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The LdapServer ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 300,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_ldapServer */

/* eslint-enable */
