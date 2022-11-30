/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
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
export { confirmtext } from '../QMailSchema/confirmtext.oa';
export { dnmember } from '../QMailSchema/dnmember.oa';
export { dnmoderator } from '../QMailSchema/dnmoderator.oa';
export { dnsender } from '../QMailSchema/dnsender.oa';
export { filtermember } from '../QMailSchema/filtermember.oa';
export { filtersender } from '../QMailSchema/filtersender.oa';
export { mailAlternateAddress } from '../QMailSchema/mailAlternateAddress.oa';
export { mailMessageStore } from '../QMailSchema/mailMessageStore.oa';
export { membersonly } from '../QMailSchema/membersonly.oa';
export { moderatortext } from '../QMailSchema/moderatortext.oa';
export { rfc822member } from '../QMailSchema/rfc822member.oa';
export { rfc822moderator } from '../QMailSchema/rfc822moderator.oa';
export { rfc822sender } from '../QMailSchema/rfc822sender.oa';
export { senderconfirm } from '../QMailSchema/senderconfirm.oa';

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
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 7914, 1, 3, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailGroup */

/* eslint-enable */
