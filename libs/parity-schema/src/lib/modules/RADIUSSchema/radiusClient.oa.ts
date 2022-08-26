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
import { radiusClientIdentifier } from "../RADIUSSchema/radiusClientIdentifier.oa";
export { radiusClientIdentifier } from "../RADIUSSchema/radiusClientIdentifier.oa";
import { radiusClientSecret } from "../RADIUSSchema/radiusClientSecret.oa";
export { radiusClientSecret } from "../RADIUSSchema/radiusClientSecret.oa";
import { radiusClientShortname } from "../RADIUSSchema/radiusClientShortname.oa";
export { radiusClientShortname } from "../RADIUSSchema/radiusClientShortname.oa";
import { radiusClientVirtualServer } from "../RADIUSSchema/radiusClientVirtualServer.oa";
export { radiusClientVirtualServer } from "../RADIUSSchema/radiusClientVirtualServer.oa";
import { radiusClientType } from "../RADIUSSchema/radiusClientType.oa";
export { radiusClientType } from "../RADIUSSchema/radiusClientType.oa";
import { radiusClientRequireMa } from "../RADIUSSchema/radiusClientRequireMa.oa";
export { radiusClientRequireMa } from "../RADIUSSchema/radiusClientRequireMa.oa";
import { radiusClientComment } from "../RADIUSSchema/radiusClientComment.oa";
export { radiusClientComment } from "../RADIUSSchema/radiusClientComment.oa";
import { id_at_freeRadius } from "../RADIUSSchema/id-at-freeRadius.va";
export { id_at_freeRadius } from "../RADIUSSchema/id-at-freeRadius.va";


/* START_OF_SYMBOL_DEFINITION radiusClient */
/**
 * @summary radiusClient
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * radiusClient OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { radiusClientIdentifier | radiusClientSecret }
 *     MAY CONTAIN         {
 *         radiusClientShortname
 *         | radiusClientVirtualServer
 *         | radiusClientType
 *         | radiusClientRequireMa
 *         | radiusClientComment
 *     }
 *     LDAP-NAME           { "radiusClient" }
 *     LDAP-DESC           "radiusClient object class"
 *     ID                  { id-at-freeRadius 4 1 1 1 1 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const radiusClient: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ radiusClientIdentifier, radiusClientSecret, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ radiusClientShortname, radiusClientVirtualServer, radiusClientType, radiusClientRequireMa, radiusClientComment, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["radiusClient"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "radiusClient object class" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([4, 1, 1, 1, 1,], id_at_freeRadius) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusClient */

/* eslint-enable */
