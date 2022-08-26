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
import { uddiTModelKey } from "../UDDI-Schema/uddiTModelKey.oa";
export { uddiTModelKey } from "../UDDI-Schema/uddiTModelKey.oa";
import { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
export { uddiDescription } from "../UDDI-Schema/uddiDescription.oa";
import { uddiInstanceDescription } from "../UDDI-Schema/uddiInstanceDescription.oa";
export { uddiInstanceDescription } from "../UDDI-Schema/uddiInstanceDescription.oa";
import { uddiInstanceParms } from "../UDDI-Schema/uddiInstanceParms.oa";
export { uddiInstanceParms } from "../UDDI-Schema/uddiInstanceParms.oa";
import { uddiOverviewDescription } from "../UDDI-Schema/uddiOverviewDescription.oa";
export { uddiOverviewDescription } from "../UDDI-Schema/uddiOverviewDescription.oa";
import { uddiOverviewURL } from "../UDDI-Schema/uddiOverviewURL.oa";
export { uddiOverviewURL } from "../UDDI-Schema/uddiOverviewURL.oa";
import { id_uddi } from "../UDDI-Schema/id-uddi.va";
export { id_uddi } from "../UDDI-Schema/id-uddi.va";
import { uddiv3TModelKey } from "./uddiv3TModelKey.oa";


/* START_OF_SYMBOL_DEFINITION uddiTModelInstanceInfo */
/**
 * @summary uddiTModelInstanceInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiTModelInstanceInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiTModelKey}
 *     MAY CONTAIN     {
 *         uddiDescription
 *         | uddiInstanceDescription
 *         | uddiInstanceParms
 *         | uddiOverviewDescription
 *         | uddiOverviewURL
 *         | uddiv3TmodelKey
 *     }
 *     LDAP-NAME       {"uddiTModelInstanceInfo"}
 *     ID              { id-uddi 6 6 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const uddiTModelInstanceInfo: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uddiTModelKey, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ uddiDescription, uddiInstanceDescription, uddiInstanceParms, uddiOverviewDescription, uddiOverviewURL, uddiv3TModelKey, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["uddiTModelInstanceInfo"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([6, 6,], id_uddi) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModelInstanceInfo */

/* eslint-enable */
