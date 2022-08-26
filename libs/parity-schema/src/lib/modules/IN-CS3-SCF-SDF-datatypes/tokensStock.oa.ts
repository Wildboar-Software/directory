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
import { securityFacilityId } from "./securityFacilityId.oa";
export { securityFacilityId } from "./securityFacilityId.oa";
import { secretKey } from "./secretKey.oa";
export { secretKey } from "./secretKey.oa";
import { identifierList } from "./identifierList.oa";
export { identifierList } from "./identifierList.oa";
import { bindLevelIfOK } from "./bindLevelIfOK.oa";
export { bindLevelIfOK } from "./bindLevelIfOK.oa";
import { currentList } from "./currentList.oa";
export { currentList } from "./currentList.oa";
import { failureCounter } from "./failureCounter.oa";
export { failureCounter } from "./failureCounter.oa";
import { lockSession } from "./lockSession.oa";
export { lockSession } from "./lockSession.oa";
import { maxAttempts } from "./maxAttempts.oa";
export { maxAttempts } from "./maxAttempts.oa";
import {
    id_oc_tokensStock,
} from "../IN-CS3-object-identifiers/id-oc-tokensStock.va";
import { sizeOfRestocking } from "./sizeOfRestocking.oa";
import { stockId } from "./stockId.oa";
import { stock } from "./stock.oa";
import { source } from "./source.oa";


/* START_OF_SYMBOL_DEFINITION tokensStock */
/**
 * @summary tokensStock
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * tokensStock OBJECT-CLASS ::= {
 *   KIND          abstract
 *   MUST CONTAIN  {stockId | stock}
 *   MAY CONTAIN   {source | sizeOfRestocking}
 *   ID            id-oc-tokensStock
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const tokensStock: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&MandatoryAttributes": [ stockId, stock ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ source, sizeOfRestocking ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_tokensStock /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": abstract /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION tokensStock */

/* eslint-enable */
