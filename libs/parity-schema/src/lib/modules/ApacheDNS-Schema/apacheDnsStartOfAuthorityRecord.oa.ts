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
import { apacheDnsAbstractRecord } from "../ApacheDNS-Schema/apacheDnsAbstractRecord.oa";
export { apacheDnsAbstractRecord } from "../ApacheDNS-Schema/apacheDnsAbstractRecord.oa";
import { apacheDnsSoaMName } from "../ApacheDNS-Schema/apacheDnsSoaMName.oa";
export { apacheDnsSoaMName } from "../ApacheDNS-Schema/apacheDnsSoaMName.oa";
import { apacheDnsSoaRName } from "../ApacheDNS-Schema/apacheDnsSoaRName.oa";
export { apacheDnsSoaRName } from "../ApacheDNS-Schema/apacheDnsSoaRName.oa";
import { apacheDnsSoaMinimum } from "../ApacheDNS-Schema/apacheDnsSoaMinimum.oa";
export { apacheDnsSoaMinimum } from "../ApacheDNS-Schema/apacheDnsSoaMinimum.oa";
import { apacheDnsClass } from "../ApacheDNS-Schema/apacheDnsClass.oa";
export { apacheDnsClass } from "../ApacheDNS-Schema/apacheDnsClass.oa";
import { apacheDnsSoaSerial } from "../ApacheDNS-Schema/apacheDnsSoaSerial.oa";
export { apacheDnsSoaSerial } from "../ApacheDNS-Schema/apacheDnsSoaSerial.oa";
import { apacheDnsSoaRefresh } from "../ApacheDNS-Schema/apacheDnsSoaRefresh.oa";
export { apacheDnsSoaRefresh } from "../ApacheDNS-Schema/apacheDnsSoaRefresh.oa";
import { apacheDnsSoaRetry } from "../ApacheDNS-Schema/apacheDnsSoaRetry.oa";
export { apacheDnsSoaRetry } from "../ApacheDNS-Schema/apacheDnsSoaRetry.oa";
import { apacheDnsSoaExpire } from "../ApacheDNS-Schema/apacheDnsSoaExpire.oa";
export { apacheDnsSoaExpire } from "../ApacheDNS-Schema/apacheDnsSoaExpire.oa";


/* START_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */
/**
 * @summary apacheDnsStartOfAuthorityRecord
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * apacheDnsStartOfAuthorityRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     KIND            structural
 *     MUST CONTAIN    {apacheDnsSoaMName | apacheDnsSoaRName | apacheDnsSoaMinimum}
 *     MAY CONTAIN     {apacheDnsClass | apacheDnsSoaSerial | apacheDnsSoaRefresh | apacheDnsSoaRetry | apacheDnsSoaExpire}
 *     LDAP-NAME       {"apacheDnsStartOfAuthorityRecord"}
 *     LDAP-DESC       "A start of authority SOA record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 5 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const apacheDnsStartOfAuthorityRecord: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ apacheDnsAbstractRecord, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ apacheDnsSoaMName, apacheDnsSoaRName, apacheDnsSoaMinimum, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ apacheDnsClass, apacheDnsSoaSerial, apacheDnsSoaRefresh, apacheDnsSoaRetry, apacheDnsSoaExpire, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["apacheDnsStartOfAuthorityRecord"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "A start of authority SOA record" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 5,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */

/* eslint-enable */