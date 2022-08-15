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
import { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
export { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { dc } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa";
export { dc } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa";
import { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
export { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
export { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import { organizationalUnitName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
export { organizationalUnitName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
import { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
export { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
import { streetAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa";
export { streetAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa";
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { owner } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa";
export { owner } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa";
import { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
export { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";


/* START_OF_SYMBOL_DEFINITION untypedObject */
/**
 * @summary untypedObject
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * untypedObject OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                structural
 *     MAY CONTAIN         {
 *         countryName
 *         | commonName
 *         | dc
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | stateOrProvinceName
 *         | streetAddress
 *         | uid
 *         | description
 *         | owner
 *         | seeAlso
 *     }
 *     LDAP-NAME           { "untypedObject" }
 *     LDAP-DESC           "Entry of no particular type"
 *     ID                  { 1 3 6 1 4 1 26027 1 2 900 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const untypedObject: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ countryName, commonName, dc, localityName, organizationName, organizationalUnitName, stateOrProvinceName, streetAddress, uid, description, owner, seeAlso, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["untypedObject"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Entry of no particular type" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 26027, 1, 2, 900,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION untypedObject */

/* eslint-enable */
