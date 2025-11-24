/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { shadowExpire } from '../NIS/shadowExpire.oa';
import { shadowFlag } from '../NIS/shadowFlag.oa';
import { shadowInactive } from '../NIS/shadowInactive.oa';
import { shadowLastChange } from '../NIS/shadowLastChange.oa';
import { shadowMax } from '../NIS/shadowMax.oa';
import { shadowMin } from '../NIS/shadowMin.oa';
import { shadowWarning } from '../NIS/shadowWarning.oa';


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
    '&id': _OID.fromParts(
        [1],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION shadowAccount */

/* eslint-enable */
