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
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { defaultServerList } from "../DUAConf/defaultServerList.oa";
export { defaultServerList } from "../DUAConf/defaultServerList.oa";
import { preferredServerList } from "../DUAConf/preferredServerList.oa";
export { preferredServerList } from "../DUAConf/preferredServerList.oa";
import { defaultSearchBase } from "../DUAConf/defaultSearchBase.oa";
export { defaultSearchBase } from "../DUAConf/defaultSearchBase.oa";
import { defaultSearchScope } from "../DUAConf/defaultSearchScope.oa";
export { defaultSearchScope } from "../DUAConf/defaultSearchScope.oa";
import { searchTimeLimit } from "../DUAConf/searchTimeLimit.oa";
export { searchTimeLimit } from "../DUAConf/searchTimeLimit.oa";
import { bindTimeLimit } from "../DUAConf/bindTimeLimit.oa";
export { bindTimeLimit } from "../DUAConf/bindTimeLimit.oa";
import { credentialLevel } from "../DUAConf/credentialLevel.oa";
export { credentialLevel } from "../DUAConf/credentialLevel.oa";
import { authenticationMethod } from "../DUAConf/authenticationMethod.oa";
export { authenticationMethod } from "../DUAConf/authenticationMethod.oa";
import { followReferrals } from "../DUAConf/followReferrals.oa";
export { followReferrals } from "../DUAConf/followReferrals.oa";
import { dereferenceAliases } from "../DUAConf/dereferenceAliases.oa";
export { dereferenceAliases } from "../DUAConf/dereferenceAliases.oa";
import { serviceSearchDescriptor } from "../DUAConf/serviceSearchDescriptor.oa";
export { serviceSearchDescriptor } from "../DUAConf/serviceSearchDescriptor.oa";
import { serviceCredentialLevel } from "../DUAConf/serviceCredentialLevel.oa";
export { serviceCredentialLevel } from "../DUAConf/serviceCredentialLevel.oa";
import { serviceAuthenticationMethod } from "../DUAConf/serviceAuthenticationMethod.oa";
export { serviceAuthenticationMethod } from "../DUAConf/serviceAuthenticationMethod.oa";
import { objectclassMap } from "../DUAConf/objectclassMap.oa";
export { objectclassMap } from "../DUAConf/objectclassMap.oa";
import { attributeMap } from "../DUAConf/attributeMap.oa";
export { attributeMap } from "../DUAConf/attributeMap.oa";
import { profileTTL } from "../DUAConf/profileTTL.oa";
export { profileTTL } from "../DUAConf/profileTTL.oa";
import { duaConfSchemaOID } from "../DUAConf/duaConfSchemaOID.va";
export { duaConfSchemaOID } from "../DUAConf/duaConfSchemaOID.va";


/* START_OF_SYMBOL_DEFINITION duaConfigProfile */
/**
 * @summary duaConfigProfile
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * duaConfigProfile OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN        {
 *         defaultServerList
 *         | preferredServerList
 *         | defaultSearchBase
 *         | defaultSearchScope
 *         | searchTimeLimit
 *         | bindTimeLimit
 *         | credentialLevel
 *         | authenticationMethod
 *         | followReferrals
 *         | dereferenceAliases
 *         | serviceSearchDescriptor
 *         | serviceCredentialLevel
 *         | serviceAuthenticationMethod
 *         | objectclassMap
 *         | attributeMap
 *         | profileTTL
 *     }
 *     LDAP-NAME        {"DUAConfigProfile"}
 *     LDAP-DESC        "Abstraction of a base configuration for a DUA"
 *     ID                { duaConfSchemaOID 2 5 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const duaConfigProfile: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ defaultServerList, preferredServerList, defaultSearchBase, defaultSearchScope, searchTimeLimit, bindTimeLimit, credentialLevel, authenticationMethod, followReferrals, dereferenceAliases, serviceSearchDescriptor, serviceCredentialLevel, serviceAuthenticationMethod, objectclassMap, attributeMap, profileTTL, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["DUAConfigProfile"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Abstraction of a base configuration for a DUA" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 5,], duaConfSchemaOID) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION duaConfigProfile */

/* eslint-enable */
