/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
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
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7914, 1, 2, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailUser */

/* eslint-enable */
