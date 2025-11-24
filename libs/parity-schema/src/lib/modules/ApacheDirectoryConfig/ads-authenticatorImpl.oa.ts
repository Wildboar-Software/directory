/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_authenticator } from '../ApacheDirectoryConfig/ads-authenticator.oa';
import { ads_authenticatorClass } from '../ApacheDirectoryConfig/ads-authenticatorClass.oa';


/* START_OF_SYMBOL_DEFINITION ads_authenticatorImpl */
/**
 * @summary ads_authenticatorImpl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-authenticatorImpl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-authenticator}
 *     MUST CONTAIN    {ads-authenticatorClass}
 *     LDAP-NAME       {"ads-authenticatorImpl"}
 *     LDAP-DESC       "an authenticator implementation"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 902 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_authenticatorImpl: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_authenticator] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [ads_authenticatorClass] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-authenticatorImpl'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'an authenticator implementation' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 902,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_authenticatorImpl */

/* eslint-enable */
