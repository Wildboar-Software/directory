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
import { id_contract } from "../IN-CS3-object-identifiers/id-contract.va";
export { id_contract } from "../IN-CS3-object-identifiers/id-contract.va";


/* START_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfStatusReporting */
/**
 * @summary id_inCs3ScfToSsfStatusReporting
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * id-inCs3ScfToSsfStatusReporting OBJECT IDENTIFIER ::= {id-contract inCs3ScfToSsfStatusReporting(11)}
 * ```
 * 
 * @constant
 */
export
const id_inCs3ScfToSsfStatusReporting: OBJECT_IDENTIFIER = new _OID([
    /* inCs3ScfToSsfStatusReporting */ 11,
], id_contract);
/* END_OF_SYMBOL_DEFINITION id_inCs3ScfToSsfStatusReporting */

/* eslint-enable */