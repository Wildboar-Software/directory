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
import { krb5Principal } from "../KerberosV5KeyDistributionCenter/krb5Principal.oa";
export { krb5Principal } from "../KerberosV5KeyDistributionCenter/krb5Principal.oa";
import { krb5KeyVersionNumber } from "../KerberosV5KeyDistributionCenter/krb5KeyVersionNumber.oa";
export { krb5KeyVersionNumber } from "../KerberosV5KeyDistributionCenter/krb5KeyVersionNumber.oa";
import { krb5ValidStart } from "../KerberosV5KeyDistributionCenter/krb5ValidStart.oa";
export { krb5ValidStart } from "../KerberosV5KeyDistributionCenter/krb5ValidStart.oa";
import { krb5ValidEnd } from "../KerberosV5KeyDistributionCenter/krb5ValidEnd.oa";
export { krb5ValidEnd } from "../KerberosV5KeyDistributionCenter/krb5ValidEnd.oa";
import { krb5PasswordEnd } from "../KerberosV5KeyDistributionCenter/krb5PasswordEnd.oa";
export { krb5PasswordEnd } from "../KerberosV5KeyDistributionCenter/krb5PasswordEnd.oa";
import { krb5MaxLife } from "../KerberosV5KeyDistributionCenter/krb5MaxLife.oa";
export { krb5MaxLife } from "../KerberosV5KeyDistributionCenter/krb5MaxLife.oa";
import { krb5MaxRenew } from "../KerberosV5KeyDistributionCenter/krb5MaxRenew.oa";
export { krb5MaxRenew } from "../KerberosV5KeyDistributionCenter/krb5MaxRenew.oa";
import { krb5KDCFlags } from "../KerberosV5KeyDistributionCenter/krb5KDCFlags.oa";
export { krb5KDCFlags } from "../KerberosV5KeyDistributionCenter/krb5KDCFlags.oa";
import { krb5EncryptionType } from "../KerberosV5KeyDistributionCenter/krb5EncryptionType.oa";
export { krb5EncryptionType } from "../KerberosV5KeyDistributionCenter/krb5EncryptionType.oa";
import { krb5Key } from "../KerberosV5KeyDistributionCenter/krb5Key.oa";
export { krb5Key } from "../KerberosV5KeyDistributionCenter/krb5Key.oa";
import { krb5AccountDisabled } from "../KerberosV5KeyDistributionCenter/krb5AccountDisabled.oa";
export { krb5AccountDisabled } from "../KerberosV5KeyDistributionCenter/krb5AccountDisabled.oa";
import { krb5AccountLockedOut } from "../KerberosV5KeyDistributionCenter/krb5AccountLockedOut.oa";
export { krb5AccountLockedOut } from "../KerberosV5KeyDistributionCenter/krb5AccountLockedOut.oa";
import { krb5AccountExpirationTime } from "../KerberosV5KeyDistributionCenter/krb5AccountExpirationTime.oa";
export { krb5AccountExpirationTime } from "../KerberosV5KeyDistributionCenter/krb5AccountExpirationTime.oa";


/* START_OF_SYMBOL_DEFINITION krb5KDCEntry */
/**
 * @summary krb5KDCEntry
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * krb5KDCEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {krb5Principal}
 *     KIND            auxiliary
 *     MUST CONTAIN    {krb5KeyVersionNumber}
 *     MAY CONTAIN     {
 *         krb5ValidStart
 *         | krb5ValidEnd
 *         | krb5PasswordEnd
 *         | krb5MaxLife
 *         | krb5MaxRenew
 *         | krb5KDCFlags
 *         | krb5EncryptionType
 *         | krb5Key
 *         | krb5AccountDisabled
 *         | krb5AccountLockedOut
 *         | krb5AccountExpirationTime
 *     }
 *     LDAP-NAME       {"krb5KDCEntry"}
 *     ID              { 1 3 6 1 4 1 5322 10 2 2 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const krb5KDCEntry: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ krb5Principal, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ krb5KeyVersionNumber, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ krb5ValidStart, krb5ValidEnd, krb5PasswordEnd, krb5MaxLife, krb5MaxRenew, krb5KDCFlags, krb5EncryptionType, krb5Key, krb5AccountDisabled, krb5AccountLockedOut, krb5AccountExpirationTime, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["krb5KDCEntry"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 5322, 10, 2, 2,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5KDCEntry */

/* eslint-enable */
