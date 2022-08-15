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
import { AuthPasswordSyntax, _decode_AuthPasswordSyntax, _encode_AuthPasswordSyntax } from "../AuthPasswordSchema/AuthPasswordSyntax.ta";
export { AuthPasswordSyntax, _decode_AuthPasswordSyntax, _encode_AuthPasswordSyntax } from "../AuthPasswordSchema/AuthPasswordSyntax.ta";
import { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";
export { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION authPasswordSyntax */
/**
 * @summary authPasswordSyntax
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * authPasswordSyntax SYNTAX-NAME ::= {
 *     LDAP-DESC           "authentication password syntax"
 *     DIRECTORY SYNTAX    AuthPasswordSyntax
 *     ID                  { id-at-openldap-schema 1 2 }
 * }
 * ```
 * 
 * @constant
 * @type {SYNTAX_NAME<AuthPasswordSyntax>}
 * @implements {SYNTAX_NAME<AuthPasswordSyntax>}
 */
export
const authPasswordSyntax: SYNTAX_NAME<AuthPasswordSyntax> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": _decode_AuthPasswordSyntax,
    },
    encoderFor: {
        "&Type": _encode_AuthPasswordSyntax,
    },
    "&ldapDesc": "authentication password syntax" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 2,], id_at_openldap_schema) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordSyntax */

/* eslint-enable */
