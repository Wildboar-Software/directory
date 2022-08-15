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
import { sambaOptionName } from "../SambaV3Schema/sambaOptionName.oa";
export { sambaOptionName } from "../SambaV3Schema/sambaOptionName.oa";
import { sambaBoolOption } from "../SambaV3Schema/sambaBoolOption.oa";
export { sambaBoolOption } from "../SambaV3Schema/sambaBoolOption.oa";
import { sambaIntegerOption } from "../SambaV3Schema/sambaIntegerOption.oa";
export { sambaIntegerOption } from "../SambaV3Schema/sambaIntegerOption.oa";
import { sambaStringListOption } from "../SambaV3Schema/sambaStringListOption.oa";
export { sambaStringListOption } from "../SambaV3Schema/sambaStringListOption.oa";
import { sambaStringOption } from "../SambaV3Schema/sambaStringOption.oa";
export { sambaStringOption } from "../SambaV3Schema/sambaStringOption.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";


/* START_OF_SYMBOL_DEFINITION sambaConfigOption */
/**
 * @summary sambaConfigOption
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * sambaConfigOption OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {sambaOptionName}
 *     MAY CONTAIN     {sambaBoolOption | sambaIntegerOption | sambaStringListOption | sambaStringOption | description}
 *     LDAP-NAME       {"sambaConfigOption"}
 *     LDAP-DESC       "Samba Configuration Option"
 *     ID              { 1 3 6 1 4 1 7165 2 2 12 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const sambaConfigOption: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ sambaOptionName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ sambaBoolOption, sambaIntegerOption, sambaStringListOption, sambaStringOption, description, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["sambaConfigOption"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Samba Configuration Option" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 7165, 2, 2, 12,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaConfigOption */

/* eslint-enable */
