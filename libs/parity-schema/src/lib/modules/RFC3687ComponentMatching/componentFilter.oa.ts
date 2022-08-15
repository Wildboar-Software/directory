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
import { ComponentFilter, _decode_ComponentFilter, _encode_ComponentFilter } from "../RFC3687ComponentMatching/ComponentFilter.ta";
export { ComponentFilter, _decode_ComponentFilter, _encode_ComponentFilter } from "../RFC3687ComponentMatching/ComponentFilter.ta";
import { id_lsx_componentFilter } from "../RFC3687ComponentMatching/id-lsx-componentFilter.va";
export { id_lsx_componentFilter } from "../RFC3687ComponentMatching/id-lsx-componentFilter.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION componentFilter */
/**
 * @summary componentFilter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * componentFilter SYNTAX-NAME ::= {
 *     LDAP-DESC               "ComponentFilter"
 *     DIRECTORY SYNTAX        ComponentFilter
 *     ID                      id-lsx-componentFilter
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export
const componentFilter: SYNTAX_NAME<ComponentFilter> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": _decode_ComponentFilter,
    },
    encoderFor: {
        "&Type": _encode_ComponentFilter,
    },
    "&Type": 0 as never,
    "&id": id_lsx_componentFilter,
    "&ldapDesc": "ComponentFilter",
};
/* END_OF_SYMBOL_DEFINITION componentFilter */

/* eslint-enable */
