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
import { dhcpPrimaryDN } from "../DHCP-Schema/dhcpPrimaryDN.oa";
export { dhcpPrimaryDN } from "../DHCP-Schema/dhcpPrimaryDN.oa";
import { dhcpSecondaryDN } from "../DHCP-Schema/dhcpSecondaryDN.oa";
export { dhcpSecondaryDN } from "../DHCP-Schema/dhcpSecondaryDN.oa";
import { dhcpSharedNetworkDN } from "../DHCP-Schema/dhcpSharedNetworkDN.oa";
export { dhcpSharedNetworkDN } from "../DHCP-Schema/dhcpSharedNetworkDN.oa";
import { dhcpSubnetDN } from "../DHCP-Schema/dhcpSubnetDN.oa";
export { dhcpSubnetDN } from "../DHCP-Schema/dhcpSubnetDN.oa";
import { dhcpGroupDN } from "../DHCP-Schema/dhcpGroupDN.oa";
export { dhcpGroupDN } from "../DHCP-Schema/dhcpGroupDN.oa";
import { dhcpHostDN } from "../DHCP-Schema/dhcpHostDN.oa";
export { dhcpHostDN } from "../DHCP-Schema/dhcpHostDN.oa";
import { dhcpClassesDN } from "../DHCP-Schema/dhcpClassesDN.oa";
export { dhcpClassesDN } from "../DHCP-Schema/dhcpClassesDN.oa";
import { dhcpOptionsDN } from "../DHCP-Schema/dhcpOptionsDN.oa";
export { dhcpOptionsDN } from "../DHCP-Schema/dhcpOptionsDN.oa";
import { dhcpStatements } from "../DHCP-Schema/dhcpStatements.oa";
export { dhcpStatements } from "../DHCP-Schema/dhcpStatements.oa";


/* START_OF_SYMBOL_DEFINITION dhcpService */
/**
 * @summary dhcpService
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * dhcpService OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | dhcpPrimaryDN}
 *     MAY CONTAIN     {dhcpSecondaryDN | dhcpSharedNetworkDN | dhcpSubnetDN | dhcpGroupDN | dhcpHostDN | dhcpClassesDN | dhcpOptionsDN | dhcpStatements}
 *     LDAP-NAME       {"dhcpService"}
 *     ID              { 2 16 840 1 113719 1 203 6 1 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const dhcpService: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, dhcpPrimaryDN, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ dhcpSecondaryDN, dhcpSharedNetworkDN, dhcpSubnetDN, dhcpGroupDN, dhcpHostDN, dhcpClassesDN, dhcpOptionsDN, dhcpStatements, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["dhcpService"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([2, 16, 840, 1, 113719, 1, 203, 6, 1,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dhcpService */

/* eslint-enable */
