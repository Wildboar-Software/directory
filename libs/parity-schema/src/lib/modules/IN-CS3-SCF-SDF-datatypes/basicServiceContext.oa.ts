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
import { BasicService, BasicService_telephony /* IMPORTED_LONG_NAMED_INTEGER */, telephony /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_faxGroup2_3 /* IMPORTED_LONG_NAMED_INTEGER */, faxGroup2_3 /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_faxGroup4 /* IMPORTED_LONG_NAMED_INTEGER */, faxGroup4 /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBasicAndMixed /* IMPORTED_LONG_NAMED_INTEGER */, teletexBasicAndMixed /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBazicAndProcessable /* IMPORTED_LONG_NAMED_INTEGER */, teletexBazicAndProcessable /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBasic /* IMPORTED_LONG_NAMED_INTEGER */, teletexBasic /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_syntaxBasedVideotex /* IMPORTED_LONG_NAMED_INTEGER */, syntaxBasedVideotex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_internationalVideotex /* IMPORTED_LONG_NAMED_INTEGER */, internationalVideotex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_telex /* IMPORTED_LONG_NAMED_INTEGER */, telex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_messageHandlingSystems /* IMPORTED_LONG_NAMED_INTEGER */, messageHandlingSystems /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_osiApplication /* IMPORTED_LONG_NAMED_INTEGER */, osiApplication /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_audioVisual /* IMPORTED_LONG_NAMED_INTEGER */, audioVisual /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_BasicService, _encode_BasicService } from "../IN-CS3-SCF-SDF-datatypes/BasicService.ta";
export { BasicService, BasicService_telephony /* IMPORTED_LONG_NAMED_INTEGER */, telephony /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_faxGroup2_3 /* IMPORTED_LONG_NAMED_INTEGER */, faxGroup2_3 /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_faxGroup4 /* IMPORTED_LONG_NAMED_INTEGER */, faxGroup4 /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBasicAndMixed /* IMPORTED_LONG_NAMED_INTEGER */, teletexBasicAndMixed /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBazicAndProcessable /* IMPORTED_LONG_NAMED_INTEGER */, teletexBazicAndProcessable /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_teletexBasic /* IMPORTED_LONG_NAMED_INTEGER */, teletexBasic /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_syntaxBasedVideotex /* IMPORTED_LONG_NAMED_INTEGER */, syntaxBasedVideotex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_internationalVideotex /* IMPORTED_LONG_NAMED_INTEGER */, internationalVideotex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_telex /* IMPORTED_LONG_NAMED_INTEGER */, telex /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_messageHandlingSystems /* IMPORTED_LONG_NAMED_INTEGER */, messageHandlingSystems /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_osiApplication /* IMPORTED_LONG_NAMED_INTEGER */, osiApplication /* IMPORTED_SHORT_NAMED_INTEGER */, BasicService_audioVisual /* IMPORTED_LONG_NAMED_INTEGER */, audioVisual /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_BasicService, _encode_BasicService } from "../IN-CS3-SCF-SDF-datatypes/BasicService.ta";
import { id_avc_basicService } from "../IN-CS3-object-identifiers/id-avc-basicService.va";
export { id_avc_basicService } from "../IN-CS3-object-identifiers/id-avc-basicService.va";
import { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";
export { CONTEXT } from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";


/* START_OF_SYMBOL_DEFINITION basicServiceContext */
/**
 * @summary basicServiceContext
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * basicServiceContext CONTEXT ::= {
 *   WITH SYNTAX  BasicService
 *   ID           id-avc-basicService
 * }
 * ```
 * 
 * @constant
 * @type {CONTEXT<BasicService>}
 * @implements {CONTEXT<BasicService>}
 */
export
const basicServiceContext: CONTEXT<BasicService> = {
    class: "CONTEXT",
    decoderFor: {
        "&Type": _decode_BasicService,
        "&Assertion": undefined,
    },
    encoderFor: {
        "&Type": _encode_BasicService,
        "&Assertion": undefined,
    },
    "&id": id_avc_basicService /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&Assertion": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&absentMatch": true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION basicServiceContext */

/* eslint-enable */
