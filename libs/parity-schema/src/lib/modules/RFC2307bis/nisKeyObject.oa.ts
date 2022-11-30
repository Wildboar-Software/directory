/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { uidNumber } from '../NIS/uidNumber.oa';
import { nisPublicKey } from '../RFC2307bis/nisPublicKey.oa';
import { nisSecretKey } from '../RFC2307bis/nisSecretKey.oa';
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
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { uidNumber } from '../NIS/uidNumber.oa';
export { nisPublicKey } from '../RFC2307bis/nisPublicKey.oa';
export { nisSecretKey } from '../RFC2307bis/nisSecretKey.oa';

/* START_OF_SYMBOL_DEFINITION nisKeyObject */
/**
 * @summary nisKeyObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisKeyObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {commonName | nisPublicKey | nisSecretKey}
 *     MAY CONTAIN     {uidNumber | description}
 *     LDAP-NAME       {"nisKeyObject"}
 *     LDAP-DESC       "An object with a public and secret key"
 *     ID              { 1 3 6 1 1 1 2 14 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const nisKeyObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        nisPublicKey,
        nisSecretKey,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [uidNumber, description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisKeyObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'An object with a public and secret key' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 1, 1, 2, 14,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisKeyObject */

/* eslint-enable */
