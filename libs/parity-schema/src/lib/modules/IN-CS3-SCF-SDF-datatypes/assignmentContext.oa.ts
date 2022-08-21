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
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
export { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { id_avc_assignment } from "../IN-CS3-object-identifiers/id-avc-assignment.va";
export { id_avc_assignment } from "../IN-CS3-object-identifiers/id-avc-assignment.va";
import { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";
export { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";


/* START_OF_SYMBOL_DEFINITION assignmentContext */
/**
 * @summary assignmentContext
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * assignmentContext CONTEXT ::= {
 *   WITH SYNTAX  DistinguishedName
 *   ID           id-avc-assignment
 * }
 * ```
 * 
 * @constant
 * @type {CONTEXT<DistinguishedName>}
 * @implements {CONTEXT<DistinguishedName>}
 */
export
const assignmentContext: CONTEXT<DistinguishedName> = {
    class: "CONTEXT",
    decoderFor: {
        "&Type": _decode_DistinguishedName,
        "&Assertion": undefined,
    },
    encoderFor: {
        "&Type": _encode_DistinguishedName,
        "&Assertion": undefined,
    },
    "&id": id_avc_assignment /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&Assertion": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&absentMatch": true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION assignmentContext */

/* eslint-enable */
