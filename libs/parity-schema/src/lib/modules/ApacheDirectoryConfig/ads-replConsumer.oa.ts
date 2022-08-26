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
import { ads_replConsumerId } from "../ApacheDirectoryConfig/ads-replConsumerId.oa";
export { ads_replConsumerId } from "../ApacheDirectoryConfig/ads-replConsumerId.oa";
import { ads_searchBaseDN } from "../ApacheDirectoryConfig/ads-searchBaseDN.oa";
export { ads_searchBaseDN } from "../ApacheDirectoryConfig/ads-searchBaseDN.oa";
import { ads_replProvHostName } from "../ApacheDirectoryConfig/ads-replProvHostName.oa";
export { ads_replProvHostName } from "../ApacheDirectoryConfig/ads-replProvHostName.oa";
import { ads_replProvPort } from "../ApacheDirectoryConfig/ads-replProvPort.oa";
export { ads_replProvPort } from "../ApacheDirectoryConfig/ads-replProvPort.oa";
import { ads_replUseTls } from "../ApacheDirectoryConfig/ads-replUseTls.oa";
export { ads_replUseTls } from "../ApacheDirectoryConfig/ads-replUseTls.oa";
import { ads_replStrictCertValidation } from "../ApacheDirectoryConfig/ads-replStrictCertValidation.oa";
export { ads_replStrictCertValidation } from "../ApacheDirectoryConfig/ads-replStrictCertValidation.oa";
import { ads_replConsumerImpl } from "../ApacheDirectoryConfig/ads-replConsumerImpl.oa";
export { ads_replConsumerImpl } from "../ApacheDirectoryConfig/ads-replConsumerImpl.oa";
import { ads_replCookie } from "../ApacheDirectoryConfig/ads-replCookie.oa";
export { ads_replCookie } from "../ApacheDirectoryConfig/ads-replCookie.oa";


/* START_OF_SYMBOL_DEFINITION ads_replConsumer */
/**
 * @summary ads_replConsumer
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ads-replConsumer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {
 *         ads-replConsumerId
 *         | ads-searchBaseDN
 *         | ads-replProvHostName
 *         | ads-replProvPort
 *         -- | ads-replAliasDerefMode
 *         | ads-replAttributes
 *         | ads-replRefreshInterval
 *         | ads-replRefreshNPersist
 *         -- | ads-replSearchScope
 *         | ads-replSearchFilter
 *         | ads-replSearchSizeLimit
 *         | ads-replSearchTimeOut
 *         | ads-replUserDn
 *         | ads-replUserPassword
 *     }
 *     MAY CONTAIN     {
 *         ads-replUseTls
 *         | ads-replStrictCertValidation
 *         | ads-replConsumerImpl
 *         | ads-replCookie
 *     }
 *     LDAP-NAME       {"ads-replConsumer"}
 *     LDAP-DESC       "replication consumer configuration"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 806 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const ads_replConsumer: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ ads_base, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ ads_replConsumerId, ads_searchBaseDN, ads_replProvHostName, ads_replProvPort, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ads_replUseTls, ads_replStrictCertValidation, ads_replConsumerImpl, ads_replCookie, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["ads-replConsumer"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "replication consumer configuration" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 806,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_replConsumer */

/* eslint-enable */
