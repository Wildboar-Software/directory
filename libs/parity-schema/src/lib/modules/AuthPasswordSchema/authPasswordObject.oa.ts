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
import { authPassword } from "../AuthPasswordSchema/authPassword.oa";
export { authPassword } from "../AuthPasswordSchema/authPassword.oa";
import { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";
export { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";


/* START_OF_SYMBOL_DEFINITION authPasswordObject */
/**
 * @summary authPasswordObject
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * authPasswordObject OBJECT-CLASS ::= {
 *     KIND                auxiliary
 *     MAY CONTAIN         { authPassword }
 *     LDAP-NAME           { "authPasswordObject" }
 *     LDAP-DESC           "authentication password mix in class"
 *     ID                  { id-at-openldap-schema 4 7 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const authPasswordObject: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ authPassword, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["authPasswordObject"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "authentication password mix in class" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([4, 7,], id_at_openldap_schema) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordObject */

/* eslint-enable */
