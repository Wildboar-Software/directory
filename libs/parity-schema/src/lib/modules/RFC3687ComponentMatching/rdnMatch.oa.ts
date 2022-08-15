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
import { rdn } from "../RFC3687ComponentMatching/rdn.oa";
export { rdn } from "../RFC3687ComponentMatching/rdn.oa";
import { id_mr_rdnMatch } from "../RFC3687ComponentMatching/id-mr-rdnMatch.va";
export { id_mr_rdnMatch } from "../RFC3687ComponentMatching/id-mr-rdnMatch.va";
import {
    RelativeDistinguishedName,
    _decode_RelativeDistinguishedName,
    _encode_RelativeDistinguishedName,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";


/* START_OF_SYMBOL_DEFINITION rdnMatch */
/**
 * @summary rdnMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * rdnMatch MATCHING-RULE ::= {
 *     SYNTAX                  RelativeDistinguishedName
 *     LDAP-SYNTAX             rdn.&id
 *     LDAP-NAME               {"rdnMatch"}
 *     ID                      id-mr-rdnMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<RelativeDistinguishedName>}
 * @implements {MATCHING_RULE<RelativeDistinguishedName>}
 */
export
const rdnMatch: MATCHING_RULE<RelativeDistinguishedName> = {
    class: "MATCHING-RULE",
    decoderFor: {
        "&AssertionType": _decode_RelativeDistinguishedName,
    },
    encoderFor: {
        "&AssertionType": _encode_RelativeDistinguishedName,
    },
    "&ldapSyntax": rdn["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["rdnMatch"] /* OBJECT_FIELD_SETTING */,
    "&id": id_mr_rdnMatch /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&AssertionType": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION rdnMatch */

/* eslint-enable */
