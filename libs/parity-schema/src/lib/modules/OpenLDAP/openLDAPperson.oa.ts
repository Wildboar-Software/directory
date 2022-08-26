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
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { givenName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/givenName.oa";
import { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import { id_openldap_oc } from "../OpenLDAP/id-openldap-oc.va";
export { id_openldap_oc } from "../OpenLDAP/id-openldap-oc.va";
import { pilotPerson } from "../Cosine/pilotPerson.oa";
import { labeledURI } from "../OpenLDAPCoreSchema/labeledURI.oa";
import { inetOrgPerson } from "../InetOrgPerson/inetOrgPerson.oa";


/* START_OF_SYMBOL_DEFINITION openLDAPperson */
/**
 * @summary openLDAPperson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * openLDAPperson OBJECT-CLASS ::= {
 *     SUBCLASS OF     {pilotPerson | inetOrgPerson}
 *     KIND            structural
 *     MUST CONTAIN    {uid | commonName}
 *     MAY CONTAIN     {givenName | labeledURI | organizationName}
 *     LDAP-NAME        {"OpenLDAPperson"}
 *     LDAP-DESC       "OpenLDAP Person"
 *     ID                { id-openldap-oc 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const openLDAPperson: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ pilotPerson, inetOrgPerson, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uid, commonName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ givenName, labeledURI, organizationName, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["OpenLDAPperson"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "OpenLDAP Person" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([5,], id_openldap_oc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPperson */

/* eslint-enable */
