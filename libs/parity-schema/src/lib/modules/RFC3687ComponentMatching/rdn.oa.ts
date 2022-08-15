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
import { id_lsx_rdn } from "../RFC3687ComponentMatching/id-lsx-rdn.va";
export { id_lsx_rdn } from "../RFC3687ComponentMatching/id-lsx-rdn.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import {
    RelativeDistinguishedName,
    _decode_RelativeDistinguishedName,
    _encode_RelativeDistinguishedName,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION rdn */
/**
 * @summary rdn
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * rdn SYNTAX-NAME ::= {
 *     LDAP-DESC               "RDN"
 *     DIRECTORY SYNTAX        RelativeDistinguishedName
 *     ID                      id-lsx-rdn
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export
const rdn: SYNTAX_NAME<RelativeDistinguishedName> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": _decode_RelativeDistinguishedName,
    },
    encoderFor: {
        "&Type": _encode_RelativeDistinguishedName,
    },
    "&Type": 0 as never,
    "&id": id_lsx_rdn,
    "&ldapDesc": "RDN",
};
/* END_OF_SYMBOL_DEFINITION rdn */

/* eslint-enable */
