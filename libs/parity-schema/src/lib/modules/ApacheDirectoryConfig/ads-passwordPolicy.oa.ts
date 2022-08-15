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
import { ads_base } from "../ApacheDirectoryConfig/ads-base.oa";
export { ads_base } from "../ApacheDirectoryConfig/ads-base.oa";
import { ads_pwdId } from "../ApacheDirectoryConfig/ads-pwdId.oa";
export { ads_pwdId } from "../ApacheDirectoryConfig/ads-pwdId.oa";
import { ads_pwdAttribute } from "../ApacheDirectoryConfig/ads-pwdAttribute.oa";
export { ads_pwdAttribute } from "../ApacheDirectoryConfig/ads-pwdAttribute.oa";
import { ads_pwdMinAge } from "../ApacheDirectoryConfig/ads-pwdMinAge.oa";
export { ads_pwdMinAge } from "../ApacheDirectoryConfig/ads-pwdMinAge.oa";
import { ads_pwdMaxAge } from "../ApacheDirectoryConfig/ads-pwdMaxAge.oa";
export { ads_pwdMaxAge } from "../ApacheDirectoryConfig/ads-pwdMaxAge.oa";
import { ads_pwdInHistory } from "../ApacheDirectoryConfig/ads-pwdInHistory.oa";
export { ads_pwdInHistory } from "../ApacheDirectoryConfig/ads-pwdInHistory.oa";
import { ads_pwdCheckQuality } from "../ApacheDirectoryConfig/ads-pwdCheckQuality.oa";
export { ads_pwdCheckQuality } from "../ApacheDirectoryConfig/ads-pwdCheckQuality.oa";
import { ads_pwdMinLength } from "../ApacheDirectoryConfig/ads-pwdMinLength.oa";
export { ads_pwdMinLength } from "../ApacheDirectoryConfig/ads-pwdMinLength.oa";
import { ads_pwdMaxLength } from "../ApacheDirectoryConfig/ads-pwdMaxLength.oa";
export { ads_pwdMaxLength } from "../ApacheDirectoryConfig/ads-pwdMaxLength.oa";
import { ads_pwdExpireWarning } from "../ApacheDirectoryConfig/ads-pwdExpireWarning.oa";
export { ads_pwdExpireWarning } from "../ApacheDirectoryConfig/ads-pwdExpireWarning.oa";
import { ads_pwdGraceAuthNLimit } from "../ApacheDirectoryConfig/ads-pwdGraceAuthNLimit.oa";
export { ads_pwdGraceAuthNLimit } from "../ApacheDirectoryConfig/ads-pwdGraceAuthNLimit.oa";
import { ads_pwdGraceExpire } from "../ApacheDirectoryConfig/ads-pwdGraceExpire.oa";
export { ads_pwdGraceExpire } from "../ApacheDirectoryConfig/ads-pwdGraceExpire.oa";
import { ads_pwdLockout } from "../ApacheDirectoryConfig/ads-pwdLockout.oa";
export { ads_pwdLockout } from "../ApacheDirectoryConfig/ads-pwdLockout.oa";
import { ads_pwdLockoutDuration } from "../ApacheDirectoryConfig/ads-pwdLockoutDuration.oa";
export { ads_pwdLockoutDuration } from "../ApacheDirectoryConfig/ads-pwdLockoutDuration.oa";
import { ads_pwdMaxFailure } from "../ApacheDirectoryConfig/ads-pwdMaxFailure.oa";
export { ads_pwdMaxFailure } from "../ApacheDirectoryConfig/ads-pwdMaxFailure.oa";
import { ads_pwdFailureCountInterval } from "../ApacheDirectoryConfig/ads-pwdFailureCountInterval.oa";
export { ads_pwdFailureCountInterval } from "../ApacheDirectoryConfig/ads-pwdFailureCountInterval.oa";
import { ads_pwdMustChange } from "../ApacheDirectoryConfig/ads-pwdMustChange.oa";
export { ads_pwdMustChange } from "../ApacheDirectoryConfig/ads-pwdMustChange.oa";
import { ads_pwdAllowUserChange } from "../ApacheDirectoryConfig/ads-pwdAllowUserChange.oa";
export { ads_pwdAllowUserChange } from "../ApacheDirectoryConfig/ads-pwdAllowUserChange.oa";
import { ads_pwdSafeModify } from "../ApacheDirectoryConfig/ads-pwdSafeModify.oa";
export { ads_pwdSafeModify } from "../ApacheDirectoryConfig/ads-pwdSafeModify.oa";
import { ads_pwdMinDelay } from "../ApacheDirectoryConfig/ads-pwdMinDelay.oa";
export { ads_pwdMinDelay } from "../ApacheDirectoryConfig/ads-pwdMinDelay.oa";
import { ads_pwdMaxDelay } from "../ApacheDirectoryConfig/ads-pwdMaxDelay.oa";
export { ads_pwdMaxDelay } from "../ApacheDirectoryConfig/ads-pwdMaxDelay.oa";
import { ads_pwdMaxIdle } from "../ApacheDirectoryConfig/ads-pwdMaxIdle.oa";
export { ads_pwdMaxIdle } from "../ApacheDirectoryConfig/ads-pwdMaxIdle.oa";
import { ads_pwdValidator } from "../ApacheDirectoryConfig/ads-pwdValidator.oa";
export { ads_pwdValidator } from "../ApacheDirectoryConfig/ads-pwdValidator.oa";


/* START_OF_SYMBOL_DEFINITION ads_passwordPolicy */
/**
 * @summary ads_passwordPolicy
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ads-passwordPolicy OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {ads-pwdId | ads-pwdAttribute}
 *     MAY CONTAIN     {
 *         ads-pwdMinAge
 *         | ads-pwdMaxAge
 *         | ads-pwdInHistory
 *         | ads-pwdCheckQuality
 *         | ads-pwdMinLength
 *         | ads-pwdMaxLength
 *         | ads-pwdExpireWarning
 *         | ads-pwdGraceAuthNLimit
 *         | ads-pwdGraceExpire
 *         | ads-pwdLockout
 *         | ads-pwdLockoutDuration
 *         | ads-pwdMaxFailure
 *         | ads-pwdFailureCountInterval
 *         | ads-pwdMustChange
 *         | ads-pwdAllowUserChange
 *         | ads-pwdSafeModify
 *         | ads-pwdMinDelay
 *         | ads-pwdMaxDelay
 *         | ads-pwdMaxIdle
 *         | ads-pwdValidator
 *     }
 *     LDAP-NAME       {"ads-passwordPolicy"}
 *     LDAP-DESC       "class to hold the PasswordPolicy configuration"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 900 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const ads_passwordPolicy: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ ads_base, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ ads_pwdId, ads_pwdAttribute, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ads_pwdMinAge, ads_pwdMaxAge, ads_pwdInHistory, ads_pwdCheckQuality, ads_pwdMinLength, ads_pwdMaxLength, ads_pwdExpireWarning, ads_pwdGraceAuthNLimit, ads_pwdGraceExpire, ads_pwdLockout, ads_pwdLockoutDuration, ads_pwdMaxFailure, ads_pwdFailureCountInterval, ads_pwdMustChange, ads_pwdAllowUserChange, ads_pwdSafeModify, ads_pwdMinDelay, ads_pwdMaxDelay, ads_pwdMaxIdle, ads_pwdValidator, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["ads-passwordPolicy"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "class to hold the PasswordPolicy configuration" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 900,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_passwordPolicy */

/* eslint-enable */
