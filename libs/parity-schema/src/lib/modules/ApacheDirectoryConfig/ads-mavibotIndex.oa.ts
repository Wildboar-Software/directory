/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_index } from '../ApacheDirectoryConfig/ads-index.oa';


/* START_OF_SYMBOL_DEFINITION ads_mavibotIndex */
/**
 * @summary ads_mavibotIndex
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-mavibotIndex OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-index}
 *     LDAP-NAME       {"ads-mavibotIndex"}
 *     LDAP-DESC       "A Mavibot index"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 905 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_mavibotIndex: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_index] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-mavibotIndex'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A Mavibot index' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 905,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_mavibotIndex */

/* eslint-enable */
