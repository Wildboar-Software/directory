/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { krb5RealmName } from '../KerberosV5KeyDistributionCenter/krb5RealmName.oa';


/* START_OF_SYMBOL_DEFINITION krb5Realm */
/**
 * @summary krb5Realm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5Realm OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {krb5RealmName}
 *     LDAP-NAME       {"krb5Realm"}
 *     ID              { 1 3 6 1 4 1 5322 10 2 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const krb5Realm: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [krb5RealmName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5Realm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 5322, 10, 2, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5Realm */

/* eslint-enable */
