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
import { sIPIdentitySIPURI } from "../H323-X500-Schema/sIPIdentitySIPURI.oa";
export { sIPIdentitySIPURI } from "../H323-X500-Schema/sIPIdentitySIPURI.oa";
import { sIPIdentityRegistrarAddress } from "../H323-X500-Schema/sIPIdentityRegistrarAddress.oa";
export { sIPIdentityRegistrarAddress } from "../H323-X500-Schema/sIPIdentityRegistrarAddress.oa";
import { sIPIdentityProxyAddress } from "../H323-X500-Schema/sIPIdentityProxyAddress.oa";
export { sIPIdentityProxyAddress } from "../H323-X500-Schema/sIPIdentityProxyAddress.oa";
import { sIPIdentityAddress } from "../H323-X500-Schema/sIPIdentityAddress.oa";
export { sIPIdentityAddress } from "../H323-X500-Schema/sIPIdentityAddress.oa";
import { sIPIdentityPassword } from "../H323-X500-Schema/sIPIdentityPassword.oa";
export { sIPIdentityPassword } from "../H323-X500-Schema/sIPIdentityPassword.oa";
import { sIPIdentityUserName } from "../H323-X500-Schema/sIPIdentityUserName.oa";
export { sIPIdentityUserName } from "../H323-X500-Schema/sIPIdentityUserName.oa";
import { sIPIdentityServiceLevel } from "../H323-X500-Schema/sIPIdentityServiceLevel.oa";
export { sIPIdentityServiceLevel } from "../H323-X500-Schema/sIPIdentityServiceLevel.oa";
import { userSMIMECertificate } from "../H323-X500-Schema/userSMIMECertificate.oa";
import { sip_id_oc } from "../H323-X500-Schema/sip-id-oc.va";
export { sip_id_oc } from "../H323-X500-Schema/sip-id-oc.va";


/* START_OF_SYMBOL_DEFINITION sIPIdentity */
/**
 * @summary sIPIdentity
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * sIPIdentity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN
 *     {sIPIdentitySIPURI | sIPIdentityRegistrarAddress | sIPIdentityProxyAddress
 *       | sIPIdentityAddress | sIPIdentityPassword | sIPIdentityUserName |
 *       sIPIdentityServiceLevel | userSMIMECertificate}
 *   ID           {sip-id-oc  1}
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const sIPIdentity: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ sIPIdentitySIPURI, sIPIdentityRegistrarAddress, sIPIdentityProxyAddress, sIPIdentityAddress, sIPIdentityPassword, sIPIdentityUserName, sIPIdentityServiceLevel, userSMIMECertificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1,], sip_id_oc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sIPIdentity */

/* eslint-enable */
