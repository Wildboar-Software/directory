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
import { fedfsFslUuid } from "../FedFSSchema/fedfsFslUuid.oa";
export { fedfsFslUuid } from "../FedFSSchema/fedfsFslUuid.oa";
import { fedfsFsnUuid } from "../FedFSSchema/fedfsFsnUuid.oa";
export { fedfsFsnUuid } from "../FedFSSchema/fedfsFsnUuid.oa";
import { fedfsAnnotation } from "../FedFSSchema/fedfsAnnotation.oa";
export { fedfsAnnotation } from "../FedFSSchema/fedfsAnnotation.oa";
import { fedfsDescr } from "../FedFSSchema/fedfsDescr.oa";
export { fedfsDescr } from "../FedFSSchema/fedfsDescr.oa";
import { daniel_ellard } from "../FedFSSchema/daniel-ellard.va";
export { daniel_ellard } from "../FedFSSchema/daniel-ellard.va";


/* START_OF_SYMBOL_DEFINITION fedfsFsl */
/**
 * @summary fedfsFsl
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * fedfsFsl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {fedfsFslUuid | fedfsFsnUuid}
 *     MAY CONTAIN     {fedfsAnnotation | fedfsDescr}
 *     LDAP-NAME       {"fedfsFsl"}
 *     LDAP-DESC       "A physical location of a fileset"
 *     ID              { daniel-ellard 1 1003 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const fedfsFsl: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": abstract /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ fedfsFslUuid, fedfsFsnUuid, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ fedfsAnnotation, fedfsDescr, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["fedfsFsl"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "A physical location of a fileset" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 1003,], daniel_ellard) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsl */

/* eslint-enable */
