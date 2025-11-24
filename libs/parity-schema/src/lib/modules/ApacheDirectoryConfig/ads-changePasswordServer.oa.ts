/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';


/* START_OF_SYMBOL_DEFINITION ads_changePasswordServer */
/**
 * @summary ads_changePasswordServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-changePasswordServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-dsBasedServer}
 *     LDAP-NAME       {"ads-changePasswordServer"}
 *     LDAP-DESC       "The ChangePassword ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 800 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_changePasswordServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_dsBasedServer] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-changePasswordServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The ChangePassword ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 800,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_changePasswordServer */

/* eslint-enable */
