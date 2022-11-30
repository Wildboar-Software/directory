/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { mail } from '../Cosine/mail.oa';
import { homeDirectory } from '../NIS/homeDirectory.oa';
import { accountStatus } from '../QMailSchema/accountStatus.oa';
import { deliveryMode } from '../QMailSchema/deliveryMode.oa';
import { deliveryProgramPath } from '../QMailSchema/deliveryProgramPath.oa';
import { mailAlternateAddress } from '../QMailSchema/mailAlternateAddress.oa';
import { mailForwardingAddress } from '../QMailSchema/mailForwardingAddress.oa';
import { mailHost } from '../QMailSchema/mailHost.oa';
import { mailMessageStore } from '../QMailSchema/mailMessageStore.oa';
import { mailQuotaCount } from '../QMailSchema/mailQuotaCount.oa';
import { mailQuotaSize } from '../QMailSchema/mailQuotaSize.oa';
import { mailReplyText } from '../QMailSchema/mailReplyText.oa';
import { mailSizeMax } from '../QMailSchema/mailSizeMax.oa';
import { qmailAccountPurge } from '../QMailSchema/qmailAccountPurge.oa';
import { qmailDotMode } from '../QMailSchema/qmailDotMode.oa';
import { qmailGID } from '../QMailSchema/qmailGID.oa';
import { qmailUID } from '../QMailSchema/qmailUID.oa';
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
export { accountStatus } from '../QMailSchema/accountStatus.oa';
export { deliveryMode } from '../QMailSchema/deliveryMode.oa';
export { deliveryProgramPath } from '../QMailSchema/deliveryProgramPath.oa';
export { mailAlternateAddress } from '../QMailSchema/mailAlternateAddress.oa';
export { mailForwardingAddress } from '../QMailSchema/mailForwardingAddress.oa';
export { mailHost } from '../QMailSchema/mailHost.oa';
export { mailMessageStore } from '../QMailSchema/mailMessageStore.oa';
export { mailQuotaCount } from '../QMailSchema/mailQuotaCount.oa';
export { mailQuotaSize } from '../QMailSchema/mailQuotaSize.oa';
export { mailReplyText } from '../QMailSchema/mailReplyText.oa';
export { mailSizeMax } from '../QMailSchema/mailSizeMax.oa';
export { qmailAccountPurge } from '../QMailSchema/qmailAccountPurge.oa';
export { qmailDotMode } from '../QMailSchema/qmailDotMode.oa';
export { qmailGID } from '../QMailSchema/qmailGID.oa';
export { qmailUID } from '../QMailSchema/qmailUID.oa';

/* START_OF_SYMBOL_DEFINITION qmailUser */
/**
 * @summary qmailUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * qmailUser OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {mail}
 *     MAY CONTAIN     {
 *         uid
 *         | mailMessageStore
 *         | homeDirectory
 *         | userPassword
 *         | mailAlternateAddress
 *         | qmailUID
 *         | qmailGID
 *         | mailHost
 *         | mailForwardingAddress
 *         | deliveryProgramPath
 *         | qmailDotMode
 *         | deliveryMode
 *         | mailReplyText
 *         | accountStatus
 *         | qmailAccountPurge
 *         | mailQuotaSize
 *         | mailQuotaCount
 *         | mailSizeMax
 *     }
 *     LDAP-NAME       {"qmailUser"}
 *     LDAP-DESC       "QMail-LDAP User"
 *     ID              { 1 3 6 1 4 1 7914 1 2 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const qmailUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [mail] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uid,
        mailMessageStore,
        homeDirectory,
        userPassword,
        mailAlternateAddress,
        qmailUID,
        qmailGID,
        mailHost,
        mailForwardingAddress,
        deliveryProgramPath,
        qmailDotMode,
        deliveryMode,
        mailReplyText,
        accountStatus,
        qmailAccountPurge,
        mailQuotaSize,
        mailQuotaCount,
        mailSizeMax,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['qmailUser'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'QMail-LDAP User' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 7914, 1, 2, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailUser */

/* eslint-enable */
