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
import { ads_base } from "../ApacheDirectoryConfig/ads-base.oa";
export { ads_base } from "../ApacheDirectoryConfig/ads-base.oa";
import { ads_transportId } from "../ApacheDirectoryConfig/ads-transportId.oa";
export { ads_transportId } from "../ApacheDirectoryConfig/ads-transportId.oa";
import { ads_systemPort } from "../ApacheDirectoryConfig/ads-systemPort.oa";
export { ads_systemPort } from "../ApacheDirectoryConfig/ads-systemPort.oa";
import { ads_transportAddress } from "../ApacheDirectoryConfig/ads-transportAddress.oa";
export { ads_transportAddress } from "../ApacheDirectoryConfig/ads-transportAddress.oa";
import { ads_transportBacklog } from "../ApacheDirectoryConfig/ads-transportBacklog.oa";
export { ads_transportBacklog } from "../ApacheDirectoryConfig/ads-transportBacklog.oa";
import { ads_transportEnableSSL } from "../ApacheDirectoryConfig/ads-transportEnableSSL.oa";
export { ads_transportEnableSSL } from "../ApacheDirectoryConfig/ads-transportEnableSSL.oa";
import { ads_transportNbThreads } from "../ApacheDirectoryConfig/ads-transportNbThreads.oa";
export { ads_transportNbThreads } from "../ApacheDirectoryConfig/ads-transportNbThreads.oa";


/* START_OF_SYMBOL_DEFINITION ads_transport */
/**
 * @summary ads_transport
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ads-transport OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {
 *         ads-transportId
 *         | ads-systemPort
 *         | ads-transportAddress
 *     }
 *     MAY CONTAIN     {
 *         ads-transportBacklog
 *         | ads-transportEnableSSL
 *         | ads-transportNbThreads
 *     }
 *     LDAP-NAME       {"ads-transport"}
 *     LDAP-DESC       "A transport (TCP or UDP)"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 18 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const ads_transport: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ ads_base, ] /* OBJECT_FIELD_SETTING */,
    "&kind": abstract /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ ads_transportId, ads_systemPort, ads_transportAddress, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ads_transportBacklog, ads_transportEnableSSL, ads_transportNbThreads, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["ads-transport"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "A transport (TCP or UDP)" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 18,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_transport */

/* eslint-enable */
