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
import { eduPersonAffiliation } from "../EduPersonSchema/eduPersonAffiliation.oa";
export { eduPersonAffiliation } from "../EduPersonSchema/eduPersonAffiliation.oa";
import { eduPersonNickName } from "../EduPersonSchema/eduPersonNickName.oa";
export { eduPersonNickName } from "../EduPersonSchema/eduPersonNickName.oa";
import { eduPersonOrgDN } from "../EduPersonSchema/eduPersonOrgDN.oa";
export { eduPersonOrgDN } from "../EduPersonSchema/eduPersonOrgDN.oa";
import { eduPersonOrgUnitDN } from "../EduPersonSchema/eduPersonOrgUnitDN.oa";
export { eduPersonOrgUnitDN } from "../EduPersonSchema/eduPersonOrgUnitDN.oa";
import { eduPersonPrimaryAffiliation } from "../EduPersonSchema/eduPersonPrimaryAffiliation.oa";
export { eduPersonPrimaryAffiliation } from "../EduPersonSchema/eduPersonPrimaryAffiliation.oa";
import { eduPersonPrincipalName } from "../EduPersonSchema/eduPersonPrincipalName.oa";
export { eduPersonPrincipalName } from "../EduPersonSchema/eduPersonPrincipalName.oa";
import { eduPersonEntitlement } from "../EduPersonSchema/eduPersonEntitlement.oa";
export { eduPersonEntitlement } from "../EduPersonSchema/eduPersonEntitlement.oa";
import { eduPersonPrimaryOrgUnitDN } from "../EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa";
export { eduPersonPrimaryOrgUnitDN } from "../EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa";
import { eduPersonScopedAffiliation } from "../EduPersonSchema/eduPersonScopedAffiliation.oa";
export { eduPersonScopedAffiliation } from "../EduPersonSchema/eduPersonScopedAffiliation.oa";
import { eduPersonTargetedID } from "../EduPersonSchema/eduPersonTargetedID.oa";
export { eduPersonTargetedID } from "../EduPersonSchema/eduPersonTargetedID.oa";
import { eduPersonAssurance } from "../EduPersonSchema/eduPersonAssurance.oa";
export { eduPersonAssurance } from "../EduPersonSchema/eduPersonAssurance.oa";
import { eduPersonPrincipalNamePrior } from "../EduPersonSchema/eduPersonPrincipalNamePrior.oa";
export { eduPersonPrincipalNamePrior } from "../EduPersonSchema/eduPersonPrincipalNamePrior.oa";
import { eduPersonUniqueId } from "../EduPersonSchema/eduPersonUniqueId.oa";
export { eduPersonUniqueId } from "../EduPersonSchema/eduPersonUniqueId.oa";
import { eduPersonOrcid } from "../EduPersonSchema/eduPersonOrcid.oa";
export { eduPersonOrcid } from "../EduPersonSchema/eduPersonOrcid.oa";


/* START_OF_SYMBOL_DEFINITION eduPerson */
/**
 * @summary eduPerson
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * eduPerson OBJECT-CLASS ::= {
 *     KIND            auxiliary
 *     MAY CONTAIN     {
 *         eduPersonAffiliation
 *         | eduPersonNickName
 *         | eduPersonOrgDN
 *         | eduPersonOrgUnitDN
 *         | eduPersonPrimaryAffiliation
 *         | eduPersonPrincipalName
 *         | eduPersonEntitlement
 *         | eduPersonPrimaryOrgUnitDN
 *         | eduPersonScopedAffiliation
 *         | eduPersonTargetedID
 *         | eduPersonAssurance
 *         | eduPersonPrincipalNamePrior
 *         | eduPersonUniqueId
 *         | eduPersonOrcid
 *     }
 *     LDAP-NAME       {"eduPerson"}
 *     ID              { 1 3 6 1 4 1 5923 1 1 2 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const eduPerson: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ eduPersonAffiliation, eduPersonNickName, eduPersonOrgDN, eduPersonOrgUnitDN, eduPersonPrimaryAffiliation, eduPersonPrincipalName, eduPersonEntitlement, eduPersonPrimaryOrgUnitDN, eduPersonScopedAffiliation, eduPersonTargetedID, eduPersonAssurance, eduPersonPrincipalNamePrior, eduPersonUniqueId, eduPersonOrcid, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["eduPerson"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 5923, 1, 1, 2,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduPerson */

/* eslint-enable */
