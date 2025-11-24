/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_authenticator } from '../ApacheDirectoryConfig/ads-authenticator.oa';
import { ads_delegateHost } from '../ApacheDirectoryConfig/ads-delegateHost.oa';
import { ads_delegatePort } from '../ApacheDirectoryConfig/ads-delegatePort.oa';
import { ads_delegateSsl } from '../ApacheDirectoryConfig/ads-delegateSsl.oa';
import { ads_delegateSslTrustManager } from '../ApacheDirectoryConfig/ads-delegateSslTrustManager.oa';
import { ads_delegateTls } from '../ApacheDirectoryConfig/ads-delegateTls.oa';
import { ads_delegateTlsTrustManager } from '../ApacheDirectoryConfig/ads-delegateTlsTrustManager.oa';


/* START_OF_SYMBOL_DEFINITION ads_delegatingAuthenticator */
/**
 * @summary ads_delegatingAuthenticator
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-delegatingAuthenticator OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-authenticator}
 *     MUST CONTAIN    {ads-delegateHost | ads-delegatePort}
 *     MAY CONTAIN     {
 *         ads-delegateSsl
 *         | ads-delegateTls
 *         | ads-delegateSslTrustManager
 *         | ads-delegateTlsTrustManager
 *     }
 *     LDAP-NAME       {"ads-delegatingAuthenticator"}
 *     LDAP-DESC       "delegated authentication configuration"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 904 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_delegatingAuthenticator: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_authenticator] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_delegateHost,
        ads_delegatePort,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_delegateSsl,
        ads_delegateTls,
        ads_delegateSslTrustManager,
        ads_delegateTlsTrustManager,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-delegatingAuthenticator'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'delegated authentication configuration' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 904,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_delegatingAuthenticator */

/* eslint-enable */
