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
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { printerType } from "../PrinterServiceOfferDefinitions/printerType.oa";
export { printerType } from "../PrinterServiceOfferDefinitions/printerType.oa";
import { locationRoom } from "../PrinterServiceOfferDefinitions/locationRoom.oa";
export { locationRoom } from "../PrinterServiceOfferDefinitions/locationRoom.oa";
import { locationBuilding } from "../PrinterServiceOfferDefinitions/locationBuilding.oa";
export { locationBuilding } from "../PrinterServiceOfferDefinitions/locationBuilding.oa";
import { costPerPage } from "../PrinterServiceOfferDefinitions/costPerPage.oa";
export { costPerPage } from "../PrinterServiceOfferDefinitions/costPerPage.oa";
import { languagesSupported } from "../PrinterServiceOfferDefinitions/languagesSupported.oa";
export { languagesSupported } from "../PrinterServiceOfferDefinitions/languagesSupported.oa";
import { pagesPerMinute } from "../PrinterServiceOfferDefinitions/pagesPerMinute.oa";
export { pagesPerMinute } from "../PrinterServiceOfferDefinitions/pagesPerMinute.oa";
import { pageSize } from "../PrinterServiceOfferDefinitions/pageSize.oa";
export { pageSize } from "../PrinterServiceOfferDefinitions/pageSize.oa";
import { dotsPerInch } from "../PrinterServiceOfferDefinitions/dotsPerInch.oa";
export { dotsPerInch } from "../PrinterServiceOfferDefinitions/dotsPerInch.oa";
import { colourCapable } from "../PrinterServiceOfferDefinitions/colourCapable.oa";
export { colourCapable } from "../PrinterServiceOfferDefinitions/colourCapable.oa";
import { driverName } from "../PrinterServiceOfferDefinitions/driverName.oa";
export { driverName } from "../PrinterServiceOfferDefinitions/driverName.oa";
import { queueLength } from "../PrinterServiceOfferDefinitions/queueLength.oa";
export { queueLength } from "../PrinterServiceOfferDefinitions/queueLength.oa";
import { id_trader_oc_serviceOffer_printer } from "../PrinterServiceOfferDefinitions/id-trader-oc-serviceOffer-printer.va";
export { id_trader_oc_serviceOffer_printer } from "../PrinterServiceOfferDefinitions/id-trader-oc-serviceOffer-printer.va";


/* START_OF_SYMBOL_DEFINITION printerServiceOffer */
/**
 * @summary printerServiceOffer
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * printerServiceOffer OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   KIND          auxiliary
 *   MUST CONTAIN  {printerType}
 *   MAY CONTAIN
 *     {locationRoom | locationBuilding | costPerPage | languagesSupported |
 *       pagesPerMinute | pageSize | dotsPerInch | colourCapable | driverName |
 *       queueLength}
 *   ID            id-trader-oc-serviceOffer-printer
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const printerServiceOffer: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ printerType, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ locationRoom, locationBuilding, costPerPage, languagesSupported, pagesPerMinute, pageSize, dotsPerInch, colourCapable, driverName, queueLength, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_trader_oc_serviceOffer_printer /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerServiceOffer */

/* eslint-enable */
