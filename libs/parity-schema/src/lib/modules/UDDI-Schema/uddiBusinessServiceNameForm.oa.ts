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
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { uddiBusinessService } from "../UDDI-Schema/uddiBusinessService.oa";
export { uddiBusinessService } from "../UDDI-Schema/uddiBusinessService.oa";
import { uddiServiceKey } from "../UDDI-Schema/uddiServiceKey.oa";
export { uddiServiceKey } from "../UDDI-Schema/uddiServiceKey.oa";
import { id_uddi } from "../UDDI-Schema/id-uddi.va";
export { id_uddi } from "../UDDI-Schema/id-uddi.va";
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";


/* START_OF_SYMBOL_DEFINITION uddiBusinessServiceNameForm */
/**
 * @summary uddiBusinessServiceNameForm
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * uddiBusinessServiceNameForm NAME-FORM ::= {
 *     NAMES               uddiBusinessService
 *     WITH ATTRIBUTES     { uddiServiceKey }
 *     LDAP-NAME           {"uddiBusinessServiceNameForm"}
 *     ID                  { id-uddi 15 4 } }
 * ```
 * 
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const uddiBusinessServiceNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": uddiBusinessService /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uddiServiceKey, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["uddiBusinessServiceNameForm"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([15, 4,], id_uddi) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessServiceNameForm */

/* eslint-enable */
