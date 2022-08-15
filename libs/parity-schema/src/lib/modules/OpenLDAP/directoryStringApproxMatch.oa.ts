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
import { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
export { UnboundedDirectoryString, _decode_UnboundedDirectoryString, _encode_UnboundedDirectoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
export { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";


/* START_OF_SYMBOL_DEFINITION directoryStringApproxMatch */
/**
 * @summary directoryStringApproxMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * directoryStringApproxMatch MATCHING-RULE ::= {
 *     SYNTAX                  UnboundedDirectoryString
 *     LDAP-SYNTAX             directoryString.&id
 *     LDAP-NAME               {"directoryStringApproxMatch"}
 *     ID                      { 1 3 6 1 4 1 4203 666 4 4 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export
const directoryStringApproxMatch: MATCHING_RULE = {
    class: "MATCHING-RULE",
    decoderFor: {
        "&AssertionType": _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        "&AssertionType": _encode_UnboundedDirectoryString,
    },
    "&AssertionType": 0 as never,
    "&ldapSyntax": directoryString["&id"],
    "&ldapName": ["directoryStringApproxMatch"],
    "&id": new _OID([ 1, 3, 6, 1, 4, 1, 4203, 666, 4, 4 ]),
};
/* END_OF_SYMBOL_DEFINITION directoryStringApproxMatch */

/* eslint-enable */
