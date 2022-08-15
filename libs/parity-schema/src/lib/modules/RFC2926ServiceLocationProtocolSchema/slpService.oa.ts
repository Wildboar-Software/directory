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
import { template_major_version_number } from "../RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa";
export { template_major_version_number } from "../RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa";
import { template_minor_version_number } from "../RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa";
export { template_minor_version_number } from "../RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { template_url_syntax } from "../RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa";
export { template_url_syntax } from "../RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa";
import { service_advert_service_type } from "../RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa";
export { service_advert_service_type } from "../RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa";
import { service_advert_scopes } from "../RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa";
export { service_advert_scopes } from "../RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa";
import { service_advert_url_authenticator } from "../RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa";
export { service_advert_url_authenticator } from "../RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa";
import { service_advert_attribute_authenticator } from "../RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa";
export { service_advert_attribute_authenticator } from "../RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa";
import { id_james_kempf } from "../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va";
export { id_james_kempf } from "../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";


/* START_OF_SYMBOL_DEFINITION slpService */
/**
 * @summary slpService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * slpService OBJECT-CLASS ::= {
 *     SUBCLASS OF { top }
 *     KIND                abstract
 *     MUST CONTAIN {
 *         template-major-version-number
 *         | template-minor-version-number
 *         | description
 *         | template-url-syntax
 *         | service-advert-service-type
 *         | service-advert-scopes
 *     }
 *     MAY CONTAIN {
 *         service-advert-url-authenticator
 *         | service-advert-attribute-authenticator
 *     }
 *     LDAP-NAME { "slpService" }
 *     LDAP-DESC           "authentication password mix in class"
 *     ID { id-james-kempf 2 27 6 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const slpService: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": abstract /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ template_major_version_number, template_minor_version_number, description, template_url_syntax, service_advert_service_type, service_advert_scopes, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ service_advert_url_authenticator, service_advert_attribute_authenticator, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["slpService"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "authentication password mix in class" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 27, 6, 2, 1,], id_james_kempf) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION slpService */

/* eslint-enable */
