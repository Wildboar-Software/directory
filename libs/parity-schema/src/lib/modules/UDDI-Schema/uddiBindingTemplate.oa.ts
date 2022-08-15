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
import { uddiBindingKey } from "../UDDI-Schema/uddiBindingKey.oa";
export { uddiBindingKey } from "../UDDI-Schema/uddiBindingKey.oa";
import { uddiServiceKey } from "../UDDI-Schema/uddiServiceKey.oa";
export { uddiServiceKey } from "../UDDI-Schema/uddiServiceKey.oa";
import { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
export { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
import { uddiAccessPoint } from "../UDDI-Schema/uddiAccessPoint.oa";
export { uddiAccessPoint } from "../UDDI-Schema/uddiAccessPoint.oa";
import { uddiHostingRedirector } from "../UDDI-Schema/uddiHostingRedirector.oa";
export { uddiHostingRedirector } from "../UDDI-Schema/uddiHostingRedirector.oa";
import { uddiCategoryBag } from "../UDDI-Schema/uddiCategoryBag.oa";
export { uddiCategoryBag } from "../UDDI-Schema/uddiCategoryBag.oa";
import { uddiv3BindingKey } from "../UDDI-Schema/uddiv3BindingKey.oa";
export { uddiv3BindingKey } from "../UDDI-Schema/uddiv3BindingKey.oa";
import { uddiv3ServiceKey } from "../UDDI-Schema/uddiv3ServiceKey.oa";
export { uddiv3ServiceKey } from "../UDDI-Schema/uddiv3ServiceKey.oa";
import { uddiv3DigitalSignature } from "../UDDI-Schema/uddiv3DigitalSignature.oa";
export { uddiv3DigitalSignature } from "../UDDI-Schema/uddiv3DigitalSignature.oa";
import { uddiv3EntityCreationTime } from "../UDDI-Schema/uddiv3EntityCreationTime.oa";
export { uddiv3EntityCreationTime } from "../UDDI-Schema/uddiv3EntityCreationTime.oa";
import { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
export { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
import { id_uddi } from "../UDDI-Schema/id-uddi.va";
export { id_uddi } from "../UDDI-Schema/id-uddi.va";


/* START_OF_SYMBOL_DEFINITION uddiBindingTemplate */
/**
 * @summary uddiBindingTemplate
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * uddiBindingTemplate OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiBindingKey}
 *     MAY CONTAIN     {
 *         uddiServiceKey
 *         | uddiDescription
 *         | uddiAccessPoint
 *         | uddiHostingRedirector
 *         | uddiCategoryBag
 *         | uddiv3BindingKey
 *         | uddiv3ServiceKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityCreationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBindingTemplate"}
 *     ID              { id-uddi 6 5 } }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const uddiBindingTemplate: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uddiBindingKey, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ uddiServiceKey, uddiDescription, uddiAccessPoint, uddiHostingRedirector, uddiCategoryBag, uddiv3BindingKey, uddiv3ServiceKey, uddiv3DigitalSignature, uddiv3EntityCreationTime, uddiv3NodeId, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["uddiBindingTemplate"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([6, 5,], id_uddi) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBindingTemplate */

/* eslint-enable */