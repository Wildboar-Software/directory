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
import { pamMissingSuffix } from "../PAMSchema/pamMissingSuffix.oa";
export { pamMissingSuffix } from "../PAMSchema/pamMissingSuffix.oa";
import { pamExcludeSuffix } from "../PAMSchema/pamExcludeSuffix.oa";
export { pamExcludeSuffix } from "../PAMSchema/pamExcludeSuffix.oa";
import { pamIncludeSuffix } from "../PAMSchema/pamIncludeSuffix.oa";
export { pamIncludeSuffix } from "../PAMSchema/pamIncludeSuffix.oa";
import { pamIDAttr } from "../PAMSchema/pamIDAttr.oa";
export { pamIDAttr } from "../PAMSchema/pamIDAttr.oa";
import { pamIDMapMethod } from "../PAMSchema/pamIDMapMethod.oa";
export { pamIDMapMethod } from "../PAMSchema/pamIDMapMethod.oa";
import { pamFallback } from "../PAMSchema/pamFallback.oa";
export { pamFallback } from "../PAMSchema/pamFallback.oa";
import { pamSecure } from "../PAMSchema/pamSecure.oa";
export { pamSecure } from "../PAMSchema/pamSecure.oa";
import { pamService } from "../PAMSchema/pamService.oa";
export { pamService } from "../PAMSchema/pamService.oa";
import { pamFilter } from "../PAMSchema/pamFilter.oa";
export { pamFilter } from "../PAMSchema/pamFilter.oa";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";


/* START_OF_SYMBOL_DEFINITION pamConfig */
/**
 * @summary pamConfig
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pamConfig OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN     {
 *         commonName
 *         | pamMissingSuffix
 *         | pamExcludeSuffix
 *         | pamIncludeSuffix
 *         | pamIDAttr
 *         | pamIDMapMethod
 *         | pamFallback
 *         | pamSecure
 *         | pamService
 *         | pamFilter
 *     }
 *     LDAP-NAME       {"pamConfig"}
 *     LDAP-DESC       "PAM plugin configuration"
 *     ID              { 2 16 840 1 113730 3 2 318 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const pamConfig: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ commonName, pamMissingSuffix, pamExcludeSuffix, pamIncludeSuffix, pamIDAttr, pamIDMapMethod, pamFallback, pamSecure, pamService, pamFilter, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["pamConfig"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "PAM plugin configuration" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 16, 840, 1, 113730, 3, 2, 318,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pamConfig */

/* eslint-enable */
