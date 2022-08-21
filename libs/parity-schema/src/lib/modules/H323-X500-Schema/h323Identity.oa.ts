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
import { h323IdentityGKDomain } from "../H323-X500-Schema/h323IdentityGKDomain.oa";
export { h323IdentityGKDomain } from "../H323-X500-Schema/h323IdentityGKDomain.oa";
import { h323Identityh323_ID } from "../H323-X500-Schema/h323Identityh323-ID.oa";
export { h323Identityh323_ID } from "../H323-X500-Schema/h323Identityh323-ID.oa";
import { h323IdentitydialedDigits } from "../H323-X500-Schema/h323IdentitydialedDigits.oa";
export { h323IdentitydialedDigits } from "../H323-X500-Schema/h323IdentitydialedDigits.oa";
import { h323Identityemail_ID } from "../H323-X500-Schema/h323Identityemail-ID.oa";
export { h323Identityemail_ID } from "../H323-X500-Schema/h323Identityemail-ID.oa";
import { h323IdentityURL_ID } from "../H323-X500-Schema/h323IdentityURL-ID.oa";
export { h323IdentityURL_ID } from "../H323-X500-Schema/h323IdentityURL-ID.oa";
import { h323IdentitytransportID } from "../H323-X500-Schema/h323IdentitytransportID.oa";
export { h323IdentitytransportID } from "../H323-X500-Schema/h323IdentitytransportID.oa";
import { h323IdentitypartyNumber } from "../H323-X500-Schema/h323IdentitypartyNumber.oa";
export { h323IdentitypartyNumber } from "../H323-X500-Schema/h323IdentitypartyNumber.oa";
import { h323IdentitymobileUIM } from "../H323-X500-Schema/h323IdentitymobileUIM.oa";
export { h323IdentitymobileUIM } from "../H323-X500-Schema/h323IdentitymobileUIM.oa";
import { h323IdentityEndpointType } from "../H323-X500-Schema/h323IdentityEndpointType.oa";
export { h323IdentityEndpointType } from "../H323-X500-Schema/h323IdentityEndpointType.oa";
import { h323IdentityServiceLevel } from "../H323-X500-Schema/h323IdentityServiceLevel.oa";
export { h323IdentityServiceLevel } from "../H323-X500-Schema/h323IdentityServiceLevel.oa";
import { h323_id_oc } from "../H323-X500-Schema/h323-id-oc.va";
export { h323_id_oc } from "../H323-X500-Schema/h323-id-oc.va";


/* START_OF_SYMBOL_DEFINITION h323Identity */
/**
 * @summary h323Identity
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * h323Identity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN
 *     {h323IdentityGKDomain | h323Identityh323-ID | h323IdentitydialedDigits |
 *       h323Identityemail-ID | h323IdentityURL-ID | h323IdentitytransportID |
 *       h323IdentitypartyNumber | h323IdentitymobileUIM |
 *       h323IdentityEndpointType | h323IdentityServiceLevel}
 *   ID           {h323-id-oc  1}
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const h323Identity: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ h323IdentityGKDomain, h323Identityh323_ID, h323IdentitydialedDigits, h323Identityemail_ID, h323IdentityURL_ID, h323IdentitytransportID, h323IdentitypartyNumber, h323IdentitymobileUIM, h323IdentityEndpointType, h323IdentityServiceLevel, ] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1,], h323_id_oc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION h323Identity */

/* eslint-enable */
