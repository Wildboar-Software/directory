/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { krb5PrincipalName } from '../KerberosV5KeyDistributionCenter/krb5PrincipalName.oa';
import { krb5PrincipalRealm } from '../KerberosV5KeyDistributionCenter/krb5PrincipalRealm.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { krb5PrincipalName } from '../KerberosV5KeyDistributionCenter/krb5PrincipalName.oa';
export { krb5PrincipalRealm } from '../KerberosV5KeyDistributionCenter/krb5PrincipalRealm.oa';

/* START_OF_SYMBOL_DEFINITION krb5Principal */
/**
 * @summary krb5Principal
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5Principal OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {krb5PrincipalName}
 *     MAY CONTAIN     {commonName | krb5PrincipalRealm}
 *     LDAP-NAME       {"krb5Principal"}
 *     ID              { 1 3 6 1 4 1 5322 10 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const krb5Principal: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [krb5PrincipalName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        krb5PrincipalRealm,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5Principal'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 5322, 10, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5Principal */

/* eslint-enable */
