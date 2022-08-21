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
import { sOfferId } from "../TraderDefinitions/sOfferId.oa";
export { sOfferId } from "../TraderDefinitions/sOfferId.oa";
import { serviceInterfaceId } from "../TraderDefinitions/serviceInterfaceId.oa";
export { serviceInterfaceId } from "../TraderDefinitions/serviceInterfaceId.oa";
import { serviceTypeId } from "../TraderDefinitions/serviceTypeId.oa";
export { serviceTypeId } from "../TraderDefinitions/serviceTypeId.oa";
import { hasDynamicProperties } from "../TraderDefinitions/hasDynamicProperties.oa";
export { hasDynamicProperties } from "../TraderDefinitions/hasDynamicProperties.oa";
import { hasModifiableProperties } from "../TraderDefinitions/hasModifiableProperties.oa";
export { hasModifiableProperties } from "../TraderDefinitions/hasModifiableProperties.oa";
import { dynamicProps } from "../TraderDefinitions/dynamicProps.oa";
export { dynamicProps } from "../TraderDefinitions/dynamicProps.oa";
import { id_trader_oc_serviceOffer } from "../TraderDefinitions/id-trader-oc-serviceOffer.va";
export { id_trader_oc_serviceOffer } from "../TraderDefinitions/id-trader-oc-serviceOffer.va";


/* START_OF_SYMBOL_DEFINITION serviceOfferEntry */
/**
 * @summary serviceOfferEntry
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * serviceOfferEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {sOfferId | serviceInterfaceId | serviceTypeId | hasDynamicProperties |
 *       hasModifiableProperties}
 *   MAY CONTAIN   {dynamicProps}
 *   ID            id-trader-oc-serviceOffer
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const serviceOfferEntry: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ sOfferId, serviceInterfaceId, serviceTypeId, hasDynamicProperties, hasModifiableProperties, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ dynamicProps, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_trader_oc_serviceOffer /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION serviceOfferEntry */

/* eslint-enable */
