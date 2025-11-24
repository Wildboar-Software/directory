/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_authenticatorId } from '../ApacheDirectoryConfig/ads-authenticatorId.oa';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_baseDn } from '../ApacheDirectoryConfig/ads-baseDn.oa';


/* START_OF_SYMBOL_DEFINITION ads_authenticator */
/**
 * @summary ads_authenticator
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-authenticator OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {ads-authenticatorId | ads-baseDn}
 *     LDAP-NAME       {"ads-authenticator"}
 *     LDAP-DESC       "A generic authenticator"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 901 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_authenticator: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_authenticatorId,
        ads_baseDn,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-authenticator'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A generic authenticator' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 901,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_authenticator */

/* eslint-enable */
