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
import { NISNetgroupTripleSyntax, _decode_NISNetgroupTripleSyntax, _encode_NISNetgroupTripleSyntax } from "../NIS/NISNetgroupTripleSyntax.ta";
export { NISNetgroupTripleSyntax, _decode_NISNetgroupTripleSyntax, _encode_NISNetgroupTripleSyntax } from "../NIS/NISNetgroupTripleSyntax.ta";
import { id_nis_lsx } from "../NIS/id-nis-lsx.va";
export { id_nis_lsx } from "../NIS/id-nis-lsx.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION nisNetgroupTripleSyntax */
/**
 * @summary nisNetgroupTripleSyntax
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * nisNetgroupTripleSyntax SYNTAX-NAME ::= {
 *     LDAP-DESC         "NIS netgroup triple"
 *     DIRECTORY SYNTAX  NISNetgroupTripleSyntax
 *     ID                { id-nis-lsx 0 } }
 * ```
 * 
 * @constant
 * @type {SYNTAX_NAME<NISNetgroupTripleSyntax>}
 * @implements {SYNTAX_NAME<NISNetgroupTripleSyntax>}
 */
export
const nisNetgroupTripleSyntax: SYNTAX_NAME<NISNetgroupTripleSyntax> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": _decode_NISNetgroupTripleSyntax,
    },
    encoderFor: {
        "&Type": _encode_NISNetgroupTripleSyntax,
    },
    "&ldapDesc": "NIS netgroup triple" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([0,], id_nis_lsx) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisNetgroupTripleSyntax */

/* eslint-enable */
