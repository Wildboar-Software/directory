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
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";

import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/InformationFramework";

import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";

import { organizationalPerson } from "@wildboar/x500/SelectedObjectClasses";

import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";

import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";

import { id_oc_atn_OrganizationalPerson } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-OrganizationalPerson.va";


/* START_OF_SYMBOL_DEFINITION atn_organizational_person */
/**
 * @summary atn_organizational_person
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-organizational-person OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organizationalPerson}
 *     MAY CONTAIN     {atn-per-certificate | atn-der-certificate}
 *     ID              id-oc-atn-OrganizationalPerson
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_organizational_person: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ organizationalPerson, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, atn_der_certificate, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_OrganizationalPerson /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_organizational_person */

/* eslint-enable */
