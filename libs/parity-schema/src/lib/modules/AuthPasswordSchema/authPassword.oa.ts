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
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
import { AttributeUsage, _enum_for_AttributeUsage, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { AttributeUsage, _enum_for_AttributeUsage, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { AuthPasswordSyntax, _decode_AuthPasswordSyntax, _encode_AuthPasswordSyntax } from "../AuthPasswordSchema/AuthPasswordSyntax.ta";
export { AuthPasswordSyntax, _decode_AuthPasswordSyntax, _encode_AuthPasswordSyntax } from "../AuthPasswordSchema/AuthPasswordSyntax.ta";
import { authPasswordExactMatch } from "../AuthPasswordSchema/authPasswordExactMatch.oa";
export { authPasswordExactMatch } from "../AuthPasswordSchema/authPasswordExactMatch.oa";
import { authPasswordSyntax } from "../AuthPasswordSchema/authPasswordSyntax.oa";
export { authPasswordSyntax } from "../AuthPasswordSchema/authPasswordSyntax.oa";
import { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";
export { id_at_openldap_schema } from "../AuthPasswordSchema/id-at-openldap-schema.va";


/* START_OF_SYMBOL_DEFINITION authPassword */
/**
 * @summary authPassword
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * authPassword ATTRIBUTE ::= {
 *     WITH SYNTAX                 AuthPasswordSyntax
 *     EQUALITY MATCHING RULE      authPasswordExactMatch
 *     LDAP-SYNTAX                 authPasswordSyntax.&id
 *     LDAP-NAME                   { "authPassword" }
 *     LDAP-DESC                   "password authentication information"
 *     ID                          { id-at-openldap-schema 3 4 }
 * }
 * ```
 * 
 * @constant
 * @type {ATTRIBUTE<AuthPasswordSyntax>}
 * @implements {ATTRIBUTE<AuthPasswordSyntax>}
 */
export
const authPassword: ATTRIBUTE<AuthPasswordSyntax> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_AuthPasswordSyntax,
    },
    encoderFor: {
        "&Type": _encode_AuthPasswordSyntax,
    },
    "&equality-match": authPasswordExactMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": authPasswordSyntax["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["authPassword"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "password authentication information" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([3, 4,], id_at_openldap_schema) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPassword */

/* eslint-enable */
