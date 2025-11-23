/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_serverId } from '../ApacheDirectoryConfig/ads-serverId.oa';
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
export { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
export { ads_serverId } from '../ApacheDirectoryConfig/ads-serverId.oa';

/* START_OF_SYMBOL_DEFINITION ads_server */
/**
 * @summary ads_server
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-server OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {ads-serverId}
 *     LDAP-NAME       {"ads-server"}
 *     LDAP-DESC       "The server ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 250 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_server: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [ads_serverId] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-server'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The server ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 250,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_server */

/* eslint-enable */
