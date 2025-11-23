/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';
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
export { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';

/* START_OF_SYMBOL_DEFINITION ads_dnsServer */
/**
 * @summary ads_dnsServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-dnsServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-dsBasedServer}
 *     LDAP-NAME       {"ads-dnsServer"}
 *     LDAP-DESC       "The DnsServer ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 500 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_dnsServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_dsBasedServer] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-dnsServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The DnsServer ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 500,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_dnsServer */

/* eslint-enable */
