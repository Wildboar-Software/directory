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
import { ads_transport } from "../ApacheDirectoryConfig/ads-transport.oa";
export { ads_transport } from "../ApacheDirectoryConfig/ads-transport.oa";
import { ads_enabledProtocols } from "../ApacheDirectoryConfig/ads-enabledProtocols.oa";
export { ads_enabledProtocols } from "../ApacheDirectoryConfig/ads-enabledProtocols.oa";
import { ads_enabledCiphers } from "../ApacheDirectoryConfig/ads-enabledCiphers.oa";
export { ads_enabledCiphers } from "../ApacheDirectoryConfig/ads-enabledCiphers.oa";
import { ads_wantClientAuth } from "../ApacheDirectoryConfig/ads-wantClientAuth.oa";
export { ads_wantClientAuth } from "../ApacheDirectoryConfig/ads-wantClientAuth.oa";
import { ads_needClientAuth } from "../ApacheDirectoryConfig/ads-needClientAuth.oa";
export { ads_needClientAuth } from "../ApacheDirectoryConfig/ads-needClientAuth.oa";


/* START_OF_SYMBOL_DEFINITION ads_tcpTransport */
/**
 * @summary ads_tcpTransport
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ads-tcpTransport OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-transport}
 *     MAY CONTAIN     {
 *         ads-enabledProtocols
 *         | ads-enabledCiphers
 *         | ads-wantClientAuth
 *         | ads-needClientAuth
 *     }
 *     LDAP-NAME       {"ads-tcpTransport"}
 *     LDAP-DESC       "A TCP transport"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 19 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const ads_tcpTransport: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ ads_transport, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ads_enabledProtocols, ads_enabledCiphers, ads_wantClientAuth, ads_needClientAuth, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["ads-tcpTransport"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "A TCP transport" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 19,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_tcpTransport */

/* eslint-enable */
