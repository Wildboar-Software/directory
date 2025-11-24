/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_interceptor } from '../ApacheDirectoryConfig/ads-interceptor.oa';

/* START_OF_SYMBOL_DEFINITION ads_authenticationInterceptor */
/**
 * @summary ads_authenticationInterceptor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-authenticationInterceptor OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-interceptor}
 *     LDAP-NAME       {"ads-authenticationInterceptor"}
 *     LDAP-DESC       "The AuthenticationInterceptor ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 131 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_authenticationInterceptor: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_interceptor] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-authenticationInterceptor'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The AuthenticationInterceptor ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 131,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_authenticationInterceptor */

/* eslint-enable */
