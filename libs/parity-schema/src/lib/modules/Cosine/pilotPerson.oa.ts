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
import { person } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";
export { person } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { textEncodedORAddress } from "../Cosine/textEncodedORAddress.oa";
export { textEncodedORAddress } from "../Cosine/textEncodedORAddress.oa";
import { favouriteDrink } from "../Cosine/favouriteDrink.oa";
export { favouriteDrink } from "../Cosine/favouriteDrink.oa";
import { roomNumber } from "../Cosine/roomNumber.oa";
export { roomNumber } from "../Cosine/roomNumber.oa";
import { userClass } from "../Cosine/userClass.oa";
export { userClass } from "../Cosine/userClass.oa";
import { homeTelephoneNumber } from "../Cosine/homeTelephoneNumber.oa";
export { homeTelephoneNumber } from "../Cosine/homeTelephoneNumber.oa";
import { homePostalAddress } from "../Cosine/homePostalAddress.oa";
export { homePostalAddress } from "../Cosine/homePostalAddress.oa";
import { secretary } from "../Cosine/secretary.oa";
export { secretary } from "../Cosine/secretary.oa";
import { personalTitle } from "../Cosine/personalTitle.oa";
export { personalTitle } from "../Cosine/personalTitle.oa";
import { preferredDeliveryMethod } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa";
export { preferredDeliveryMethod } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa";
import { businessCategory } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa";
export { businessCategory } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa";
import { janetMailbox } from "../Cosine/janetMailbox.oa";
export { janetMailbox } from "../Cosine/janetMailbox.oa";
import { pilotObjectClass } from "../Cosine/pilotObjectClass.va";
export { pilotObjectClass } from "../Cosine/pilotObjectClass.va";
import { mail } from "./mail.oa";
import { mobileTelephoneNumber } from "./mobileTelephoneNumber.oa";
import { pagerTelephoneNumber } from "./pagerTelephoneNumber.oa";
import { organizationalStatus } from "./organizationalStatus.oa";
import { mailPreferenceOption } from "./mailPreferenceOption.oa";


/* START_OF_SYMBOL_DEFINITION pilotPerson */
/**
 * @summary pilotPerson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotPerson OBJECT-CLASS ::= {
 *     SUBCLASS OF {person}
 *     KIND structural
 *     MAY CONTAIN {
 *         uid
 *         | textEncodedORAddress
 *         | rfc822Mailbox
 *         | favouriteDrink
 *         | roomNumber
 *         | userClass
 *         | homeTelephoneNumber
 *         | homePostalAddress
 *         | secretary
 *         | personalTitle
 *         | preferredDeliveryMethod
 *         | businessCategory
 *         | janetMailbox
 *         -- | otherMailbox
 *         | mobileTelephoneNumber
 *         | pagerTelephoneNumber
 *         | organizationalStatus
 *         -- | mailPreferenceOption
 *         -- | personalSignature
 *     }
 *     LDAP-NAME {"pilotPerson", "newPilotPerson"}
 *     ID { pilotObjectClass 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const pilotPerson: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ person, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [
        uid,
        textEncodedORAddress,
        mail,
        favouriteDrink,
        roomNumber,
        userClass,
        homeTelephoneNumber,
        homePostalAddress,
        secretary,
        personalTitle,
        preferredDeliveryMethod,
        businessCategory,
        janetMailbox,
        mobileTelephoneNumber,
        pagerTelephoneNumber,
        organizationalStatus,
        mailPreferenceOption,
    ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["pilotPerson","newPilotPerson"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([4,], pilotObjectClass) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotPerson */

/* eslint-enable */
