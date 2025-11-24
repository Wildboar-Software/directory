/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_extendedOpHandlerClass } from '../ApacheDirectoryConfig/ads-extendedOpHandlerClass.oa';
import { ads_extendedOpId } from '../ApacheDirectoryConfig/ads-extendedOpId.oa';


/* START_OF_SYMBOL_DEFINITION ads_extendedOpHandler */
/**
 * @summary ads_extendedOpHandler
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-extendedOpHandler OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {ads-extendedOpHandlerClass | ads-extendedOpId}
 *     LDAP-NAME       {"ads-extendedOpHandler"}
 *     LDAP-DESC       "Extended operation handler"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 802 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_extendedOpHandler: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_extendedOpHandlerClass,
        ads_extendedOpId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-extendedOpHandler'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Extended operation handler' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 802,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_extendedOpHandler */

/* eslint-enable */
