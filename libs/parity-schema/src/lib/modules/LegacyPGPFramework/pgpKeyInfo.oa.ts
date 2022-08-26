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
import { pgpCertID } from "../LegacyPGPFramework/pgpCertID.oa";
export { pgpCertID } from "../LegacyPGPFramework/pgpCertID.oa";
import { pgpKey } from "../LegacyPGPFramework/pgpKey.oa";
export { pgpKey } from "../LegacyPGPFramework/pgpKey.oa";
import { pgpDisabled } from "../LegacyPGPFramework/pgpDisabled.oa";
export { pgpDisabled } from "../LegacyPGPFramework/pgpDisabled.oa";
import { pgpKeyID } from "../LegacyPGPFramework/pgpKeyID.oa";
export { pgpKeyID } from "../LegacyPGPFramework/pgpKeyID.oa";
import { pgpKeyType } from "../LegacyPGPFramework/pgpKeyType.oa";
export { pgpKeyType } from "../LegacyPGPFramework/pgpKeyType.oa";
import { pgpUserID } from "../LegacyPGPFramework/pgpUserID.oa";
export { pgpUserID } from "../LegacyPGPFramework/pgpUserID.oa";
import { pgpKeyCreateTime } from "../LegacyPGPFramework/pgpKeyCreateTime.oa";
export { pgpKeyCreateTime } from "../LegacyPGPFramework/pgpKeyCreateTime.oa";
import { pgpSignerID } from "../LegacyPGPFramework/pgpSignerID.oa";
export { pgpSignerID } from "../LegacyPGPFramework/pgpSignerID.oa";
import { pgpRevoked } from "../LegacyPGPFramework/pgpRevoked.oa";
export { pgpRevoked } from "../LegacyPGPFramework/pgpRevoked.oa";
import { pgpSubKeyID } from "../LegacyPGPFramework/pgpSubKeyID.oa";
export { pgpSubKeyID } from "../LegacyPGPFramework/pgpSubKeyID.oa";
import { pgpKeySize } from "../LegacyPGPFramework/pgpKeySize.oa";
export { pgpKeySize } from "../LegacyPGPFramework/pgpKeySize.oa";
import { pgpKeyExpireTime } from "../LegacyPGPFramework/pgpKeyExpireTime.oa";
export { pgpKeyExpireTime } from "../LegacyPGPFramework/pgpKeyExpireTime.oa";
import { gpgFingerprint } from "../LegacyPGPFramework/gpgFingerprint.oa";
export { gpgFingerprint } from "../LegacyPGPFramework/gpgFingerprint.oa";
import { gpgSubFingerprint } from "../LegacyPGPFramework/gpgSubFingerprint.oa";
export { gpgSubFingerprint } from "../LegacyPGPFramework/gpgSubFingerprint.oa";
import { gpgSubCertID } from "../LegacyPGPFramework/gpgSubCertID.oa";
export { gpgSubCertID } from "../LegacyPGPFramework/gpgSubCertID.oa";
import { gpgMailbox } from "../LegacyPGPFramework/gpgMailbox.oa";
export { gpgMailbox } from "../LegacyPGPFramework/gpgMailbox.oa";
import { mcafee } from "../LegacyPGPFramework/mcafee.va";
export { mcafee } from "../LegacyPGPFramework/mcafee.va";


/* START_OF_SYMBOL_DEFINITION pgpKeyInfo */
/**
 * @summary pgpKeyInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pgpKeyInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { pgpCertID | pgpKey }
 *     MAY CONTAIN         {
 *         pgpDisabled
 *         | pgpKeyID
 *         | pgpKeyType
 *         | pgpUserID
 *         | pgpKeyCreateTime
 *         | pgpSignerID
 *         | pgpRevoked
 *         | pgpSubKeyID
 *         | pgpKeySize
 *         | pgpKeyExpireTime
 *         | gpgFingerprint
 *         | gpgSubFingerprint
 *         | gpgSubCertID
 *         | gpgMailbox
 *     }
 *     LDAP-NAME           {"pgpKeyInfo"}
 *     LDAP-DESC           {"An OpenPGP public keyblock"}
 *     ID { mcafee 8 2 24 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const pgpKeyInfo: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ pgpCertID, pgpKey, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ pgpDisabled, pgpKeyID, pgpKeyType, pgpUserID, pgpKeyCreateTime, pgpSignerID, pgpRevoked, pgpSubKeyID, pgpKeySize, pgpKeyExpireTime, gpgFingerprint, gpgSubFingerprint, gpgSubCertID, gpgMailbox, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["pgpKeyInfo"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "An OpenPGP public keyblock" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([8, 2, 24,], mcafee) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pgpKeyInfo */

/* eslint-enable */
