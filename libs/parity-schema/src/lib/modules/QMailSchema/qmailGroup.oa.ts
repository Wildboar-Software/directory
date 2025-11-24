/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { mail } from '../Cosine/mail.oa';
import { confirmtext } from '../QMailSchema/confirmtext.oa';
import { dnmember } from '../QMailSchema/dnmember.oa';
import { dnmoderator } from '../QMailSchema/dnmoderator.oa';
import { dnsender } from '../QMailSchema/dnsender.oa';
import { filtermember } from '../QMailSchema/filtermember.oa';
import { filtersender } from '../QMailSchema/filtersender.oa';
import { mailAlternateAddress } from '../QMailSchema/mailAlternateAddress.oa';
import { mailMessageStore } from '../QMailSchema/mailMessageStore.oa';
import { membersonly } from '../QMailSchema/membersonly.oa';
import { moderatortext } from '../QMailSchema/moderatortext.oa';
import { rfc822member } from '../QMailSchema/rfc822member.oa';
import { rfc822moderator } from '../QMailSchema/rfc822moderator.oa';
import { rfc822sender } from '../QMailSchema/rfc822sender.oa';
import { senderconfirm } from '../QMailSchema/senderconfirm.oa';


/* START_OF_SYMBOL_DEFINITION qmailGroup */
/**
 * @summary qmailGroup
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * qmailGroup OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {
 *         mail
 *         | mailAlternateAddress
 *         | mailMessageStore
 *     }
 *     MAY CONTAIN     {
 *         dnmember
 *         | rfc822member
 *         | filtermember
 *         | senderconfirm
 *         | membersonly
 *         | confirmtext
 *         | dnmoderator
 *         | rfc822moderator
 *         | moderatortext
 *         | dnsender
 *         | rfc822sender
 *         | filtersender
 *     }
 *     LDAP-NAME       {"qmailGroup"}
 *     LDAP-DESC       "QMail-LDAP Group"
 *     ID              { 1 3 6 1 4 1 7914 1 3 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const qmailGroup: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        mail,
        mailAlternateAddress,
        mailMessageStore,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        dnmember,
        rfc822member,
        filtermember,
        senderconfirm,
        membersonly,
        confirmtext,
        dnmoderator,
        rfc822moderator,
        moderatortext,
        dnsender,
        rfc822sender,
        filtersender,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['qmailGroup'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'QMail-LDAP Group' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7914, 1, 3, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailGroup */

/* eslint-enable */
