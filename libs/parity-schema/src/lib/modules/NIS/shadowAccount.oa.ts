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
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
export { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { shadowLastChange } from "../NIS/shadowLastChange.oa";
export { shadowLastChange } from "../NIS/shadowLastChange.oa";
import { shadowMin } from "../NIS/shadowMin.oa";
export { shadowMin } from "../NIS/shadowMin.oa";
import { shadowMax } from "../NIS/shadowMax.oa";
export { shadowMax } from "../NIS/shadowMax.oa";
import { shadowWarning } from "../NIS/shadowWarning.oa";
export { shadowWarning } from "../NIS/shadowWarning.oa";
import { shadowInactive } from "../NIS/shadowInactive.oa";
export { shadowInactive } from "../NIS/shadowInactive.oa";
import { shadowExpire } from "../NIS/shadowExpire.oa";
export { shadowExpire } from "../NIS/shadowExpire.oa";
import { shadowFlag } from "../NIS/shadowFlag.oa";
export { shadowFlag } from "../NIS/shadowFlag.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { id_nis_oc } from "../NIS/id-nis-oc.va";
export { id_nis_oc } from "../NIS/id-nis-oc.va";


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
export
const shadowAccount: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uid, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ userPassword, shadowLastChange, shadowMin, shadowMax, shadowWarning, shadowInactive, shadowExpire, shadowFlag, description, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["shadowAccount"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Additional attributes for shadow passwords" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1,], id_nis_oc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION shadowAccount */

/* eslint-enable */
