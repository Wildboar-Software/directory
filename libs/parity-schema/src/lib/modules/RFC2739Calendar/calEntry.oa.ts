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
import { calCalURI } from "../RFC2739Calendar/calCalURI.oa";
export { calCalURI } from "../RFC2739Calendar/calCalURI.oa";
import { calFBURL } from "../RFC2739Calendar/calFBURL.oa";
export { calFBURL } from "../RFC2739Calendar/calFBURL.oa";
import { calCAPURI } from "../RFC2739Calendar/calCAPURI.oa";
export { calCAPURI } from "../RFC2739Calendar/calCAPURI.oa";
import { calCalAdrURI } from "../RFC2739Calendar/calCalAdrURI.oa";
export { calCalAdrURI } from "../RFC2739Calendar/calCalAdrURI.oa";
import { calOtherCalURIs } from "../RFC2739Calendar/calOtherCalURIs.oa";
export { calOtherCalURIs } from "../RFC2739Calendar/calOtherCalURIs.oa";
import { calOtherFBURLs } from "../RFC2739Calendar/calOtherFBURLs.oa";
export { calOtherFBURLs } from "../RFC2739Calendar/calOtherFBURLs.oa";
import { calOtherCalAdrURIs } from "../RFC2739Calendar/calOtherCalAdrURIs.oa";
export { calOtherCalAdrURIs } from "../RFC2739Calendar/calOtherCalAdrURIs.oa";
import { msoc } from "../RFC2739Calendar/msoc.va";
export { msoc } from "../RFC2739Calendar/msoc.va";
import { calOtherCAPURIs } from "./calOtherCAPURIs.oa";


/* START_OF_SYMBOL_DEFINITION calEntry */
/**
 * @summary calEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * calEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN {
 *         calCalURI
 *         | calFBURL
 *         | calCAPURI
 *         | calCalAdrURI
 *         | calOtherCalURIs
 *         | calOtherFBURLs
 *         | calOtherCAPURIs
 *         | calOtherCalAdrURIs
 *     }
 *     LDAP-NAME       {"calEntry"}
 *     LDAP-DESC       "Calendering and free/busy information"
 *     ID              { msoc 87 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const calEntry: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ calCalURI, calFBURL, calCAPURI, calCalAdrURI, calOtherCalURIs, calOtherFBURLs, calOtherCAPURIs, calOtherCalAdrURIs, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["calEntry"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Calendering and free/busy information" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([87,], msoc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION calEntry */

/* eslint-enable */