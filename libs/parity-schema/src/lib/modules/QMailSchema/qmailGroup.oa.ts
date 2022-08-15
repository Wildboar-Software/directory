/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { mailAlternateAddress } from "../QMailSchema/mailAlternateAddress.oa";
export { mailAlternateAddress } from "../QMailSchema/mailAlternateAddress.oa";
import { mailMessageStore } from "../QMailSchema/mailMessageStore.oa";
export { mailMessageStore } from "../QMailSchema/mailMessageStore.oa";
import { dnmember } from "../QMailSchema/dnmember.oa";
export { dnmember } from "../QMailSchema/dnmember.oa";
import { rfc822member } from "../QMailSchema/rfc822member.oa";
export { rfc822member } from "../QMailSchema/rfc822member.oa";
import { filtermember } from "../QMailSchema/filtermember.oa";
export { filtermember } from "../QMailSchema/filtermember.oa";
import { senderconfirm } from "../QMailSchema/senderconfirm.oa";
export { senderconfirm } from "../QMailSchema/senderconfirm.oa";
import { membersonly } from "../QMailSchema/membersonly.oa";
export { membersonly } from "../QMailSchema/membersonly.oa";
import { confirmtext } from "../QMailSchema/confirmtext.oa";
export { confirmtext } from "../QMailSchema/confirmtext.oa";
import { dnmoderator } from "../QMailSchema/dnmoderator.oa";
export { dnmoderator } from "../QMailSchema/dnmoderator.oa";
import { rfc822moderator } from "../QMailSchema/rfc822moderator.oa";
export { rfc822moderator } from "../QMailSchema/rfc822moderator.oa";
import { moderatortext } from "../QMailSchema/moderatortext.oa";
export { moderatortext } from "../QMailSchema/moderatortext.oa";
import { dnsender } from "../QMailSchema/dnsender.oa";
export { dnsender } from "../QMailSchema/dnsender.oa";
import { rfc822sender } from "../QMailSchema/rfc822sender.oa";
export { rfc822sender } from "../QMailSchema/rfc822sender.oa";
import { filtersender } from "../QMailSchema/filtersender.oa";
export { filtersender } from "../QMailSchema/filtersender.oa";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { mail } from "../Cosine/mail.oa";


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
export
const qmailGroup: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ mail, mailAlternateAddress, mailMessageStore, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ dnmember, rfc822member, filtermember, senderconfirm, membersonly, confirmtext, dnmoderator, rfc822moderator, moderatortext, dnsender, rfc822sender, filtersender, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["qmailGroup"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "QMail-LDAP Group" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 7914, 1, 3, 2, 1,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailGroup */

/* eslint-enable */
