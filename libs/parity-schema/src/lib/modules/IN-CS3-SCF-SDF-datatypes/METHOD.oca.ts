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
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";


/* START_OF_SYMBOL_DEFINITION METHOD */
/**
 * @summary METHOD
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * METHOD ::= CLASS {
 *   &InputAttributes   ATTRIBUTE OPTIONAL,
 *   &SpecificInput     OPTIONAL,
 *   &OutputAttributes  ATTRIBUTE OPTIONAL,
 *   &SpecificOutput    OPTIONAL,
 *   &description       IA5String OPTIONAL,
 *   &id                OBJECT IDENTIFIER UNIQUE
 * }
 * WITH SYNTAX {
 *   [INPUT ATTRIBUTES &InputAttributes]
 *   [SPECIFIC-INPUT &SpecificInput]
 *   [OUTPUT ATTRIBUTES &OutputAttributes]
 *   [SPECIFIC-OUTPUT &SpecificOutput]
 *   [BEHAVIOUR &description]
 *   ID &id
 * }
 * ```
 * 
 * @interface
 */
export
interface METHOD<
    SpecificInput = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */,
    SpecificOutput = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */
> {
    /**
     * @summary A fixed string that can be used for external programs to determine the object class of this object.
     */
    readonly class: "METHOD";
    /**
     * @summary A map of type fields to their corresponding decoders.
     */
    readonly decoderFor: Partial<{ // For decoding types supplied in type fields
        [_K in keyof METHOD<SpecificInput,SpecificOutput>]: $.ASN1Decoder<METHOD<SpecificInput,SpecificOutput>[_K]>;
    }>;
    /**
     * @summary A map of type fields to their corresponding encoders.
     */
    readonly encoderFor: Partial<{ // For encoding types supplied in type fields
        [_K in keyof METHOD<SpecificInput,SpecificOutput>]: $.ASN1Encoder<METHOD<SpecificInput,SpecificOutput>[_K]>;
    }>;
    /**
     * @summary &InputAttributes
     */
    readonly "&InputAttributes"?: ATTRIBUTE[];
    /**
     * @summary &SpecificInput
     */
    readonly "&SpecificInput": SpecificInput;
    /**
     * @summary &OutputAttributes
     */
    readonly "&OutputAttributes"?: ATTRIBUTE[];
    /**
     * @summary &SpecificOutput
     */
    readonly "&SpecificOutput": SpecificOutput;
    /**
     * @summary &description
     */
    readonly "&description"?: IA5String;
    /**
     * @summary &id
     */
    readonly "&id"?: OBJECT_IDENTIFIER;
};
/* END_OF_SYMBOL_DEFINITION METHOD */

/* eslint-enable */
