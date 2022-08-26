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
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { vPIMRfc822Mailbox } from "../VPIMSchema/vPIMRfc822Mailbox.oa";
export { vPIMRfc822Mailbox } from "../VPIMSchema/vPIMRfc822Mailbox.oa";
import { vPIMTelephoneNumber } from "../VPIMSchema/vPIMTelephoneNumber.oa";
export { vPIMTelephoneNumber } from "../VPIMSchema/vPIMTelephoneNumber.oa";
import { vPIMSpokenName } from "../VPIMSchema/vPIMSpokenName.oa";
export { vPIMSpokenName } from "../VPIMSchema/vPIMSpokenName.oa";
import { vPIMSupportedUABehaviors } from "../VPIMSchema/vPIMSupportedUABehaviors.oa";
export { vPIMSupportedUABehaviors } from "../VPIMSchema/vPIMSupportedUABehaviors.oa";
import { vPIMSupportedAudioMediaTypes } from "../VPIMSchema/vPIMSupportedAudioMediaTypes.oa";
export { vPIMSupportedAudioMediaTypes } from "../VPIMSchema/vPIMSupportedAudioMediaTypes.oa";
import { vPIMSupportedMessageContext } from "../VPIMSchema/vPIMSupportedMessageContext.oa";
export { vPIMSupportedMessageContext } from "../VPIMSchema/vPIMSupportedMessageContext.oa";
import { vPIMTextName } from "../VPIMSchema/vPIMTextName.oa";
export { vPIMTextName } from "../VPIMSchema/vPIMTextName.oa";
import { vPIMExtendedAbsenceStatus } from "../VPIMSchema/vPIMExtendedAbsenceStatus.oa";
export { vPIMExtendedAbsenceStatus } from "../VPIMSchema/vPIMExtendedAbsenceStatus.oa";
import { vPIMMaxMessageSize } from "../VPIMSchema/vPIMMaxMessageSize.oa";
export { vPIMMaxMessageSize } from "../VPIMSchema/vPIMMaxMessageSize.oa";
import { vPIMSubMailboxes } from "../VPIMSchema/vPIMSubMailboxes.oa";
export { vPIMSubMailboxes } from "../VPIMSchema/vPIMSubMailboxes.oa";
import { iana_assigned_oid } from "../VPIMSchema/iana-assigned-oid.va";
export { iana_assigned_oid } from "../VPIMSchema/iana-assigned-oid.va";


/* START_OF_SYMBOL_DEFINITION vPIMUser */
/**
 * @summary vPIMUser
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * vPIMUser OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {vPIMRfc822Mailbox | vPIMTelephoneNumber}
 *     MAY CONTAIN     {
 *         vPIMSpokenName
 *         | vPIMSupportedUABehaviors
 *         | vPIMSupportedAudioMediaTypes
 *         | vPIMSupportedMessageContext
 *         | vPIMTextName
 *         | vPIMExtendedAbsenceStatus
 *         | vPIMMaxMessageSize
 *         | vPIMSubMailboxes
 *     }
 *     LDAP-NAME       {"vPIMUser"}
 *     ID              { iana-assigned-oid 1 1 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const vPIMUser: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ vPIMRfc822Mailbox, vPIMTelephoneNumber, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ vPIMSpokenName, vPIMSupportedUABehaviors, vPIMSupportedAudioMediaTypes, vPIMSupportedMessageContext, vPIMTextName, vPIMExtendedAbsenceStatus, vPIMMaxMessageSize, vPIMSubMailboxes, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["vPIMUser"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 1,], iana_assigned_oid) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION vPIMUser */

/* eslint-enable */
