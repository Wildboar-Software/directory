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
import { uddiBusinessKey } from "../UDDI-Schema/uddiBusinessKey.oa";
export { uddiBusinessKey } from "../UDDI-Schema/uddiBusinessKey.oa";
import { uddiName } from "../UDDI-Schema/uddiName.oa";
export { uddiName } from "../UDDI-Schema/uddiName.oa";
import { uddiAuthorizedName } from "../UDDI-Schema/uddiAuthorizedName.oa";
export { uddiAuthorizedName } from "../UDDI-Schema/uddiAuthorizedName.oa";
import { uddiOperator } from "../UDDI-Schema/uddiOperator.oa";
export { uddiOperator } from "../UDDI-Schema/uddiOperator.oa";
import { uddiDiscoveryURLs } from "../UDDI-Schema/uddiDiscoveryURLs.oa";
export { uddiDiscoveryURLs } from "../UDDI-Schema/uddiDiscoveryURLs.oa";
import { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
export { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
import { uddiIdentifierBag } from "../UDDI-Schema/uddiIdentifierBag.oa";
export { uddiIdentifierBag } from "../UDDI-Schema/uddiIdentifierBag.oa";
import { uddiCategoryBag } from "../UDDI-Schema/uddiCategoryBag.oa";
export { uddiCategoryBag } from "../UDDI-Schema/uddiCategoryBag.oa";
import { uddiv3BusinessKey } from "../UDDI-Schema/uddiv3BusinessKey.oa";
export { uddiv3BusinessKey } from "../UDDI-Schema/uddiv3BusinessKey.oa";
import { uddiv3DigitalSignature } from "../UDDI-Schema/uddiv3DigitalSignature.oa";
export { uddiv3DigitalSignature } from "../UDDI-Schema/uddiv3DigitalSignature.oa";
import { uddiv3EntityModificationTime } from "../UDDI-Schema/uddiv3EntityModificationTime.oa";
export { uddiv3EntityModificationTime } from "../UDDI-Schema/uddiv3EntityModificationTime.oa";
import { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
export { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
import { id_uddi } from "../UDDI-Schema/id-uddi.va";
export { id_uddi } from "../UDDI-Schema/id-uddi.va";


/* START_OF_SYMBOL_DEFINITION uddiBusinessEntity */
/**
 * @summary uddiBusinessEntity
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * uddiBusinessEntity OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiBusinessKey | uddiName}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiOperator
 *         | uddiDiscoveryURLs
 *         | uddiDescription
 *         | uddiIdentifierBag
 *         | uddiCategoryBag
 *         | uddiv3BusinessKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityModificationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBusinessEntity"}
 *     ID              { id-uddi 6 1 } }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const uddiBusinessEntity: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uddiBusinessKey, uddiName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ uddiAuthorizedName, uddiOperator, uddiDiscoveryURLs, uddiDescription, uddiIdentifierBag, uddiCategoryBag, uddiv3BusinessKey, uddiv3DigitalSignature, uddiv3EntityModificationTime, uddiv3NodeId, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["uddiBusinessEntity"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([6, 1,], id_uddi) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessEntity */

/* eslint-enable */
