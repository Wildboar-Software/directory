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
import { IsdnAddress, _decode_IsdnAddress, _encode_IsdnAddress } from "../IN-CS3-SCF-SDF-datatypes/IsdnAddress.ta";
export { IsdnAddress, _decode_IsdnAddress, _encode_IsdnAddress } from "../IN-CS3-SCF-SDF-datatypes/IsdnAddress.ta";
import { id_avc_lineIdentity } from "../IN-CS3-object-identifiers/id-avc-lineIdentity.va";
export { id_avc_lineIdentity } from "../IN-CS3-object-identifiers/id-avc-lineIdentity.va";
import { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";
export { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";


/* START_OF_SYMBOL_DEFINITION lineIdentityContext */
/**
 * @summary lineIdentityContext
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * lineIdentityContext CONTEXT ::= {
 *   WITH SYNTAX  IsdnAddress
 *   ID           id-avc-lineIdentity
 * }
 * ```
 * 
 * @constant
 * @type {CONTEXT<IsdnAddress>}
 * @implements {CONTEXT<IsdnAddress>}
 */
export
const lineIdentityContext: CONTEXT<IsdnAddress> = {
    class: "CONTEXT",
    decoderFor: {
        "&Type": _decode_IsdnAddress,
        "&Assertion": undefined,
    },
    encoderFor: {
        "&Type": _encode_IsdnAddress,
        "&Assertion": undefined,
    },
    "&id": id_avc_lineIdentity /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&Assertion": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&absentMatch": true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION lineIdentityContext */

/* eslint-enable */
