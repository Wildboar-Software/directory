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
import { uddiv3EntityKey } from "../UDDI-Schema/uddiv3EntityKey.oa";
export { uddiv3EntityKey } from "../UDDI-Schema/uddiv3EntityKey.oa";
import { uddiUUID } from "../UDDI-Schema/uddiUUID.oa";
export { uddiUUID } from "../UDDI-Schema/uddiUUID.oa";
import { uddiAuthorizedName } from "../UDDI-Schema/uddiAuthorizedName.oa";
export { uddiAuthorizedName } from "../UDDI-Schema/uddiAuthorizedName.oa";
import { uddiv3EntityCreationTime } from "../UDDI-Schema/uddiv3EntityCreationTime.oa";
export { uddiv3EntityCreationTime } from "../UDDI-Schema/uddiv3EntityCreationTime.oa";
import { uddiv3EntityDeletionTime } from "../UDDI-Schema/uddiv3EntityDeletionTime.oa";
export { uddiv3EntityDeletionTime } from "../UDDI-Schema/uddiv3EntityDeletionTime.oa";
import { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
export { uddiv3NodeId } from "../UDDI-Schema/uddiv3NodeId.oa";
import { id_uddi } from "../UDDI-Schema/id-uddi.va";
export { id_uddi } from "../UDDI-Schema/id-uddi.va";


/* START_OF_SYMBOL_DEFINITION uddiv3EntityObituary */
/**
 * @summary uddiv3EntityObituary
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * uddiv3EntityObituary OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiv3EntityKey | uddiUUID}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiv3EntityCreationTime
 *         | uddiv3EntityDeletionTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiv3EntityObituary"}
 *     ID              { id-uddi 6 10 } }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const uddiv3EntityObituary: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uddiv3EntityKey, uddiUUID, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ uddiAuthorizedName, uddiv3EntityCreationTime, uddiv3EntityDeletionTime, uddiv3NodeId, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["uddiv3EntityObituary"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([6, 10,], id_uddi) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3EntityObituary */

/* eslint-enable */
