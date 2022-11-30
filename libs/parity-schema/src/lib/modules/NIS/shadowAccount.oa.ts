/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { shadowExpire } from '../NIS/shadowExpire.oa';
import { shadowFlag } from '../NIS/shadowFlag.oa';
import { shadowInactive } from '../NIS/shadowInactive.oa';
import { shadowLastChange } from '../NIS/shadowLastChange.oa';
import { shadowMax } from '../NIS/shadowMax.oa';
import { shadowMin } from '../NIS/shadowMin.oa';
import { shadowWarning } from '../NIS/shadowWarning.oa';
export { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
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
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { shadowExpire } from '../NIS/shadowExpire.oa';
export { shadowFlag } from '../NIS/shadowFlag.oa';
export { shadowInactive } from '../NIS/shadowInactive.oa';
export { shadowLastChange } from '../NIS/shadowLastChange.oa';
export { shadowMax } from '../NIS/shadowMax.oa';
export { shadowMin } from '../NIS/shadowMin.oa';
export { shadowWarning } from '../NIS/shadowWarning.oa';

/* START_OF_SYMBOL_DEFINITION shadowAccount */
/**
 * @summary shadowAccount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * shadowAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {uid}
 *     MAY CONTAIN        {
 *         userPassword
 *         | shadowLastChange
 *         | shadowMin
 *         | shadowMax
 *         | shadowWarning
 *         | shadowInactive
 *         | shadowExpire
 *         | shadowFlag
 *         | description
 *     }
 *     LDAP-NAME        {"shadowAccount"}
 *     LDAP-DESC        "Additional attributes for shadow passwords"
 *     ID                { id-nis-oc 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const shadowAccount: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        userPassword,
        shadowLastChange,
        shadowMin,
        shadowMax,
        shadowWarning,
        shadowInactive,
        shadowExpire,
        shadowFlag,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['shadowAccount'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Additional attributes for shadow passwords' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [1],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION shadowAccount */

/* eslint-enable */
