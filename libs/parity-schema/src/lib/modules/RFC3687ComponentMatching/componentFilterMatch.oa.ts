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
import { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { ComponentFilter, _decode_ComponentFilter, _encode_ComponentFilter } from "../RFC3687ComponentMatching/ComponentFilter.ta";
export { ComponentFilter, _decode_ComponentFilter, _encode_ComponentFilter } from "../RFC3687ComponentMatching/ComponentFilter.ta";
import { componentFilter } from "../RFC3687ComponentMatching/componentFilter.oa";
export { componentFilter } from "../RFC3687ComponentMatching/componentFilter.oa";
import { id_mr_componentFilterMatch } from "../RFC3687ComponentMatching/id-mr-componentFilterMatch.va";
export { id_mr_componentFilterMatch } from "../RFC3687ComponentMatching/id-mr-componentFilterMatch.va";


/* START_OF_SYMBOL_DEFINITION componentFilterMatch */
/**
 * @summary componentFilterMatch
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * componentFilterMatch MATCHING-RULE ::= {
 *     SYNTAX                  ComponentFilter
 *     LDAP-SYNTAX             componentFilter.&id
 *     LDAP-NAME               {"componentFilterMatch"}
 *     ID                      id-mr-componentFilterMatch
 * }
 * ```
 * 
 * @constant
 * @type {MATCHING_RULE<ComponentFilter>}
 * @implements {MATCHING_RULE<ComponentFilter>}
 */
export
const componentFilterMatch: MATCHING_RULE<ComponentFilter> = {
    class: "MATCHING-RULE",
    decoderFor: {
        "&AssertionType": _decode_ComponentFilter,
    },
    encoderFor: {
        "&AssertionType": _encode_ComponentFilter,
    },
    "&ldapSyntax": componentFilter["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["componentFilterMatch"] /* OBJECT_FIELD_SETTING */,
    "&id": id_mr_componentFilterMatch /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&AssertionType": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION componentFilterMatch */

/* eslint-enable */
