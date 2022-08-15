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
import { id_lsx_open } from "../RFC3687ComponentMatching/id-lsx-open.va";
export { id_lsx_open } from "../RFC3687ComponentMatching/id-lsx-open.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION open */
/**
 * @summary open
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * open SYNTAX-NAME ::= {
 *     LDAP-DESC               "OpenAssertionType"
 *     DIRECTORY SYNTAX        TYPE-IDENTIFIER.&Type
 *     ID                      id-lsx-open
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export
const open: SYNTAX_NAME<_Element> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": (e) => e,
    },
    encoderFor: {
        "&Type": (e) => e,
    },
    "&Type": 0 as never,
    "&id": id_lsx_open,
    "&ldapDesc": "OpenAssertionType",
};
/* END_OF_SYMBOL_DEFINITION open */

/* eslint-enable */
