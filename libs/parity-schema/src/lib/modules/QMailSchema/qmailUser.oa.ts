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
import { mailMessageStore } from "../QMailSchema/mailMessageStore.oa";
export { mailMessageStore } from "../QMailSchema/mailMessageStore.oa";
import { mailAlternateAddress } from "../QMailSchema/mailAlternateAddress.oa";
export { mailAlternateAddress } from "../QMailSchema/mailAlternateAddress.oa";
import { qmailUID } from "../QMailSchema/qmailUID.oa";
export { qmailUID } from "../QMailSchema/qmailUID.oa";
import { qmailGID } from "../QMailSchema/qmailGID.oa";
export { qmailGID } from "../QMailSchema/qmailGID.oa";
import { mailHost } from "../QMailSchema/mailHost.oa";
export { mailHost } from "../QMailSchema/mailHost.oa";
import { mailForwardingAddress } from "../QMailSchema/mailForwardingAddress.oa";
export { mailForwardingAddress } from "../QMailSchema/mailForwardingAddress.oa";
import { deliveryProgramPath } from "../QMailSchema/deliveryProgramPath.oa";
export { deliveryProgramPath } from "../QMailSchema/deliveryProgramPath.oa";
import { qmailDotMode } from "../QMailSchema/qmailDotMode.oa";
export { qmailDotMode } from "../QMailSchema/qmailDotMode.oa";
import { deliveryMode } from "../QMailSchema/deliveryMode.oa";
export { deliveryMode } from "../QMailSchema/deliveryMode.oa";
import { mailReplyText } from "../QMailSchema/mailReplyText.oa";
export { mailReplyText } from "../QMailSchema/mailReplyText.oa";
import { accountStatus } from "../QMailSchema/accountStatus.oa";
export { accountStatus } from "../QMailSchema/accountStatus.oa";
import { qmailAccountPurge } from "../QMailSchema/qmailAccountPurge.oa";
export { qmailAccountPurge } from "../QMailSchema/qmailAccountPurge.oa";
import { mailQuotaSize } from "../QMailSchema/mailQuotaSize.oa";
export { mailQuotaSize } from "../QMailSchema/mailQuotaSize.oa";
import { mailQuotaCount } from "../QMailSchema/mailQuotaCount.oa";
export { mailQuotaCount } from "../QMailSchema/mailQuotaCount.oa";
import { mailSizeMax } from "../QMailSchema/mailSizeMax.oa";
export { mailSizeMax } from "../QMailSchema/mailSizeMax.oa";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { homeDirectory } from "../NIS/homeDirectory.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { mail } from "../Cosine/mail.oa";
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";


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
export
const qmailUser: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ mail, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ uid, mailMessageStore, homeDirectory, userPassword, mailAlternateAddress, qmailUID, qmailGID, mailHost, mailForwardingAddress, deliveryProgramPath, qmailDotMode, deliveryMode, mailReplyText, accountStatus, qmailAccountPurge, mailQuotaSize, mailQuotaCount, mailSizeMax, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["qmailUser"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "QMail-LDAP User" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 7914, 1, 2, 2, 1,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION qmailUser */

/* eslint-enable */
