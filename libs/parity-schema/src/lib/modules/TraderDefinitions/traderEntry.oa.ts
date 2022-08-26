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
import { traderInterface } from "../TraderDefinitions/traderInterface.oa";
export { traderInterface } from "../TraderDefinitions/traderInterface.oa";
import { dsaName } from "../TraderDefinitions/dsaName.oa";
export { dsaName } from "../TraderDefinitions/dsaName.oa";
import { typeRepos } from "../TraderDefinitions/typeRepos.oa";
export { typeRepos } from "../TraderDefinitions/typeRepos.oa";
import { defSearchCard } from "../TraderDefinitions/defSearchCard.oa";
export { defSearchCard } from "../TraderDefinitions/defSearchCard.oa";
import { maxSearchCard } from "../TraderDefinitions/maxSearchCard.oa";
export { maxSearchCard } from "../TraderDefinitions/maxSearchCard.oa";
import { defMatchCard } from "../TraderDefinitions/defMatchCard.oa";
export { defMatchCard } from "../TraderDefinitions/defMatchCard.oa";
import { maxMatchCard } from "../TraderDefinitions/maxMatchCard.oa";
export { maxMatchCard } from "../TraderDefinitions/maxMatchCard.oa";
import { defReturnCard } from "../TraderDefinitions/defReturnCard.oa";
export { defReturnCard } from "../TraderDefinitions/defReturnCard.oa";
import { maxReturnCard } from "../TraderDefinitions/maxReturnCard.oa";
export { maxReturnCard } from "../TraderDefinitions/maxReturnCard.oa";
import { defHopCount } from "../TraderDefinitions/defHopCount.oa";
export { defHopCount } from "../TraderDefinitions/defHopCount.oa";
import { maxHopCount } from "../TraderDefinitions/maxHopCount.oa";
export { maxHopCount } from "../TraderDefinitions/maxHopCount.oa";
import { defFollowPolicy } from "../TraderDefinitions/defFollowPolicy.oa";
export { defFollowPolicy } from "../TraderDefinitions/defFollowPolicy.oa";
import { maxFollowPolicy } from "../TraderDefinitions/maxFollowPolicy.oa";
export { maxFollowPolicy } from "../TraderDefinitions/maxFollowPolicy.oa";
import { maxLinkFollowPolicy } from "../TraderDefinitions/maxLinkFollowPolicy.oa";
export { maxLinkFollowPolicy } from "../TraderDefinitions/maxLinkFollowPolicy.oa";
import { supportsModifiableProperties } from "../TraderDefinitions/supportsModifiableProperties.oa";
export { supportsModifiableProperties } from "../TraderDefinitions/supportsModifiableProperties.oa";
import { supportsDynamicProperties } from "../TraderDefinitions/supportsDynamicProperties.oa";
export { supportsDynamicProperties } from "../TraderDefinitions/supportsDynamicProperties.oa";
import { supportsProxyOffers } from "../TraderDefinitions/supportsProxyOffers.oa";
export { supportsProxyOffers } from "../TraderDefinitions/supportsProxyOffers.oa";
import { maxList } from "../TraderDefinitions/maxList.oa";
export { maxList } from "../TraderDefinitions/maxList.oa";
import { requestIdStem } from "../TraderDefinitions/requestIdStem.oa";
export { requestIdStem } from "../TraderDefinitions/requestIdStem.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
export { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { id_trader_oc_traderEntry } from "../TraderDefinitions/id-trader-oc-traderEntry.va";
export { id_trader_oc_traderEntry } from "../TraderDefinitions/id-trader-oc-traderEntry.va";


/* START_OF_SYMBOL_DEFINITION traderEntry */
/**
 * @summary traderEntry
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * traderEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {commonName | traderInterface | dsaName | typeRepos | defSearchCard |
 *       maxSearchCard | defMatchCard | maxMatchCard | defReturnCard |
 *       maxReturnCard | defHopCount | maxHopCount | defFollowPolicy |
 *       maxFollowPolicy | maxLinkFollowPolicy | supportsModifiableProperties |
 *       supportsDynamicProperties | supportsProxyOffers | maxList |
 *       requestIdStem}
 *   MAY CONTAIN   {description | userPassword}
 *   ID            id-trader-oc-traderEntry
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const traderEntry: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, traderInterface, dsaName, typeRepos, defSearchCard, maxSearchCard, defMatchCard, maxMatchCard, defReturnCard, maxReturnCard, defHopCount, maxHopCount, defFollowPolicy, maxFollowPolicy, maxLinkFollowPolicy, supportsModifiableProperties, supportsDynamicProperties, supportsProxyOffers, maxList, requestIdStem, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ description, userPassword, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_trader_oc_traderEntry /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderEntry */

/* eslint-enable */
