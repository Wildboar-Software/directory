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
import { dc } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa";
export { dc } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa";
import { associatedName } from "../Cosine/associatedName.oa";
export { associatedName } from "../Cosine/associatedName.oa";
import { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
export { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { businessCategory } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa";
export { businessCategory } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa";
import { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
export { seeAlso } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
import { searchGuide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchGuide.oa";
export { searchGuide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchGuide.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
export { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
export { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
export { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
import { physicalDeliveryOfficeName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa";
export { physicalDeliveryOfficeName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa";
import { postalAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa";
export { postalAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa";
import { postalCode } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa";
export { postalCode } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa";
import { postOfficeBox } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa";
export { postOfficeBox } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa";
import { streetAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa";
export { streetAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa";
import { facsimileTelephoneNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa";
export { facsimileTelephoneNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa";
import { internationalISDNNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa";
export { internationalISDNNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa";
import { telephoneNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa";
export { telephoneNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa";
import { pilotObjectClass } from "../Cosine/pilotObjectClass.va";
export { pilotObjectClass } from "../Cosine/pilotObjectClass.va";
import { telexNumber } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telexNumber.oa";
import { preferredDeliveryMethod } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa";
import { destinationIndicator } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/destinationIndicator.oa";
import { registeredAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/registeredAddress.oa";
import { x121Address } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/x121Address.oa";


/* START_OF_SYMBOL_DEFINITION domain */
/**
 * @summary domain
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * domain OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         dc
 *     }
 *     MAY CONTAIN {
 *         associatedName
 *         | organizationName
 *         | description
 *         | businessCategory
 *         | seeAlso
 *         | searchGuide
 *         | userPassword
 *         | localityName
 *         | stateOrProvinceName
 *         | physicalDeliveryOfficeName
 *         | postalAddress
 *         | postalCode
 *         | postOfficeBox
 *         | streetAddress
 *         | facsimileTelephoneNumber
 *         | internationalISDNNumber
 *         | telephoneNumber
 *         -- | teletexTerminalIdentifier
 *         | telexNumber
 *         | preferredDeliveryMethod
 *         | destinationIndicator
 *         | registeredAddress
 *         | x121Address
 *     }
 *     LDAP-NAME {"domain"}
 *     ID { pilotObjectClass 13 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const domain: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ dc, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [
        associatedName,
        organizationName,
        description,
        businessCategory,
        seeAlso,
        searchGuide,
        userPassword,
        localityName,
        stateOrProvinceName,
        physicalDeliveryOfficeName,
        postalAddress,
        postalCode,
        postOfficeBox,
        streetAddress,
        facsimileTelephoneNumber,
        internationalISDNNumber,
        telephoneNumber,
        telexNumber,
        preferredDeliveryMethod,
        destinationIndicator,
        registeredAddress,
        x121Address,
    ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["domain"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([13,], pilotObjectClass) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION domain */

/* eslint-enable */