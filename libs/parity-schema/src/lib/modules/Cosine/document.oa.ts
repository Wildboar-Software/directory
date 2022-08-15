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
import { documentIdentifier } from "../Cosine/documentIdentifier.oa";
export { documentIdentifier } from "../Cosine/documentIdentifier.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
export { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
import { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
export { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
export { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import { organizationalUnitName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
export { organizationalUnitName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
import { documentTitle } from "../Cosine/documentTitle.oa";
export { documentTitle } from "../Cosine/documentTitle.oa";
import { documentVersion } from "../Cosine/documentVersion.oa";
export { documentVersion } from "../Cosine/documentVersion.oa";
import { documentAuthor } from "../Cosine/documentAuthor.oa";
export { documentAuthor } from "../Cosine/documentAuthor.oa";
import { documentLocation } from "../Cosine/documentLocation.oa";
export { documentLocation } from "../Cosine/documentLocation.oa";
import { documentPublisher } from "../Cosine/documentPublisher.oa";
export { documentPublisher } from "../Cosine/documentPublisher.oa";
import { pilotObjectClass } from "../Cosine/pilotObjectClass.va";
export { pilotObjectClass } from "../Cosine/pilotObjectClass.va";


/* START_OF_SYMBOL_DEFINITION document */
/**
 * @summary document
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * document OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         documentIdentifier
 *     }
 *     MAY CONTAIN {
 *         commonName
 *         | description
 *         | seeAlso
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | documentTitle
 *         | documentVersion
 *         | documentAuthor
 *         | documentLocation
 *         | documentPublisher
 *     }
 *     LDAP-NAME {"document"}
 *     ID { pilotObjectClass 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const document: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ documentIdentifier, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ commonName, description, seeAlso, localityName, organizationName, organizationalUnitName, documentTitle, documentVersion, documentAuthor, documentLocation, documentPublisher, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["document"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([6,], pilotObjectClass) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION document */

/* eslint-enable */