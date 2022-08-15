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
import { printerService } from "../RFC7612Printer/printerService.oa";
export { printerService } from "../RFC7612Printer/printerService.oa";
import { printer_name } from "../RFC7612Printer/printer-name.oa";
export { printer_name } from "../RFC7612Printer/printer-name.oa";
import { printer_uuid } from "../RFC7612Printer/printer-uuid.oa";
export { printer_uuid } from "../RFC7612Printer/printer-uuid.oa";
import { id_nf } from "../Wildboar/id-nf.va";
export { id_nf } from "../Wildboar/id-nf.va";
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";


/* START_OF_SYMBOL_DEFINITION printerServiceNameForm */
/**
 * @summary printerServiceNameForm
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * printerServiceNameForm NAME-FORM ::= {
 *     NAMES               printerService
 *     WITH ATTRIBUTES     {printer-name} -- Comes from the parent abstract class.
 *     AND OPTIONALLY      {printer-uuid}
 *     LDAP-NAME           {"printerServiceNameForm"}
 *     LDAP-DESC           "Name form for a printer service."
 *     ID                  { id-nf 4 }
 * }
 * ```
 * 
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const printerServiceNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": printerService /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ printer_name, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ printer_uuid, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["printerServiceNameForm"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Name form for a printer service." /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([4,], id_nf) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerServiceNameForm */

/* eslint-enable */
