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
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { STRUCTURE_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca";
export { STRUCTURE_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/STRUCTURE-RULE.oca";
import { RuleIdentifier, _decode_RuleIdentifier, _encode_RuleIdentifier } from "@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta";
export { RuleIdentifier, _decode_RuleIdentifier, _encode_RuleIdentifier } from "@wildboar/x500/src/lib/modules/InformationFramework/RuleIdentifier.ta";
import { callingUptUserNameForm } from "../UPT-DataModel/callingUptUserNameForm.oa";
export { callingUptUserNameForm } from "../UPT-DataModel/callingUptUserNameForm.oa";


/* START_OF_SYMBOL_DEFINITION sr8 */
/**
 * @summary sr8
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * sr8 STRUCTURE-RULE ::= {
 *   NAME FORM       callingUptUserNameForm
 *   SUPERIOR RULES  {sr4}
 *   ID              8
 * }
 * ```
 * 
 * @constant
 * @type {STRUCTURE_RULE}
 * @implements {STRUCTURE_RULE}
 */
export
const sr8: STRUCTURE_RULE = {
    class: "STRUCTURE-RULE",
    decoderFor: {
    },
    encoderFor: {
    },
    "&nameForm": callingUptUserNameForm /* OBJECT_FIELD_SETTING */,
    "&id": 8 /* OBJECT_FIELD_SETTING */,
    "&SuperiorStructureRules": 0 as never /* OBJECT_FIELD_SETTING OBJECT_VALUE_SET_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sr8 */

/* eslint-enable */
