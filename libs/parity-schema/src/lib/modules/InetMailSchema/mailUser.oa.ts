/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { mail } from '../Cosine/mail.oa';
import { id_oc_mailUser } from '../InetMailSchema/id-oc-mailUser.va';
import { mailaccess } from '../InetMailSchema/mailaccess.oa';
import { mailbox } from '../InetMailSchema/mailbox.oa';
import { maildest } from '../InetMailSchema/maildest.oa';
import { maildrop } from '../InetMailSchema/maildrop.oa';
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
export { mail } from '../Cosine/mail.oa';
export { id_oc_mailUser } from '../InetMailSchema/id-oc-mailUser.va';
export { mailaccess } from '../InetMailSchema/mailaccess.oa';
export { mailbox } from '../InetMailSchema/mailbox.oa';
export { maildest } from '../InetMailSchema/maildest.oa';
export { maildrop } from '../InetMailSchema/maildrop.oa';

/* START_OF_SYMBOL_DEFINITION mailUser */
/**
 * @summary mailUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mailUser OBJECT-CLASS ::= {
 *     KIND            auxiliary
 *     MUST CONTAIN    {uid | mail | maildrop}
 *     MAY CONTAIN     {commonName | mailbox | maildest | mailaccess}
 *     LDAP-NAME       {"mailUser"}
 *     LDAP-DESC       "E-Mail User"
 *     ID              id-oc-mailUser
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const mailUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid, mail, maildrop] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        mailbox,
        maildest,
        mailaccess,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mailUser'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'E-Mail User' /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_mailUser /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mailUser */

/* eslint-enable */
