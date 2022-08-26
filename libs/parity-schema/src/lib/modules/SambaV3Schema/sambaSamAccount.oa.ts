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
import { sambaSID } from "../SambaV3Schema/sambaSID.oa";
export { sambaSID } from "../SambaV3Schema/sambaSID.oa";
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { displayName } from "../InetOrgPerson/displayName.oa";
export { displayName } from "../InetOrgPerson/displayName.oa";
import { sambaAcctFlags } from "../SambaV3Schema/sambaAcctFlags.oa";
export { sambaAcctFlags } from "../SambaV3Schema/sambaAcctFlags.oa";
import { sambaBadPasswordCount } from "../SambaV3Schema/sambaBadPasswordCount.oa";
export { sambaBadPasswordCount } from "../SambaV3Schema/sambaBadPasswordCount.oa";
import { sambaBadPasswordTime } from "../SambaV3Schema/sambaBadPasswordTime.oa";
export { sambaBadPasswordTime } from "../SambaV3Schema/sambaBadPasswordTime.oa";
import { sambaDomainName } from "../SambaV3Schema/sambaDomainName.oa";
export { sambaDomainName } from "../SambaV3Schema/sambaDomainName.oa";
import { sambaHomeDrive } from "../SambaV3Schema/sambaHomeDrive.oa";
export { sambaHomeDrive } from "../SambaV3Schema/sambaHomeDrive.oa";
import { sambaHomePath } from "../SambaV3Schema/sambaHomePath.oa";
export { sambaHomePath } from "../SambaV3Schema/sambaHomePath.oa";
import { sambaKickoffTime } from "../SambaV3Schema/sambaKickoffTime.oa";
export { sambaKickoffTime } from "../SambaV3Schema/sambaKickoffTime.oa";
import { sambaLMPassword } from "../SambaV3Schema/sambaLMPassword.oa";
export { sambaLMPassword } from "../SambaV3Schema/sambaLMPassword.oa";
import { sambaLogoffTime } from "../SambaV3Schema/sambaLogoffTime.oa";
export { sambaLogoffTime } from "../SambaV3Schema/sambaLogoffTime.oa";
import { sambaLogonHours } from "../SambaV3Schema/sambaLogonHours.oa";
export { sambaLogonHours } from "../SambaV3Schema/sambaLogonHours.oa";
import { sambaLogonScript } from "../SambaV3Schema/sambaLogonScript.oa";
export { sambaLogonScript } from "../SambaV3Schema/sambaLogonScript.oa";
import { sambaLogonTime } from "../SambaV3Schema/sambaLogonTime.oa";
export { sambaLogonTime } from "../SambaV3Schema/sambaLogonTime.oa";
import { sambaMungedDial } from "../SambaV3Schema/sambaMungedDial.oa";
export { sambaMungedDial } from "../SambaV3Schema/sambaMungedDial.oa";
import { sambaNTPassword } from "../SambaV3Schema/sambaNTPassword.oa";
export { sambaNTPassword } from "../SambaV3Schema/sambaNTPassword.oa";
import { sambaPasswordHistory } from "../SambaV3Schema/sambaPasswordHistory.oa";
export { sambaPasswordHistory } from "../SambaV3Schema/sambaPasswordHistory.oa";
import { sambaPrimaryGroupSID } from "../SambaV3Schema/sambaPrimaryGroupSID.oa";
export { sambaPrimaryGroupSID } from "../SambaV3Schema/sambaPrimaryGroupSID.oa";
import { sambaProfilePath } from "../SambaV3Schema/sambaProfilePath.oa";
export { sambaProfilePath } from "../SambaV3Schema/sambaProfilePath.oa";
import { sambaPwdCanChange } from "../SambaV3Schema/sambaPwdCanChange.oa";
export { sambaPwdCanChange } from "../SambaV3Schema/sambaPwdCanChange.oa";
import { sambaPwdLastSet } from "../SambaV3Schema/sambaPwdLastSet.oa";
export { sambaPwdLastSet } from "../SambaV3Schema/sambaPwdLastSet.oa";
import { sambaPwdMustChange } from "../SambaV3Schema/sambaPwdMustChange.oa";
export { sambaPwdMustChange } from "../SambaV3Schema/sambaPwdMustChange.oa";
import { sambaUserWorkstations } from "../SambaV3Schema/sambaUserWorkstations.oa";
export { sambaUserWorkstations } from "../SambaV3Schema/sambaUserWorkstations.oa";


/* START_OF_SYMBOL_DEFINITION sambaSamAccount */
/**
 * @summary sambaSamAccount
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * sambaSamAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {sambaSID | uid}
 *     MAY CONTAIN     {
 *         commonName
 *         | description
 *         | displayName
 *         | sambaAcctFlags
 *         | sambaBadPasswordCount
 *         | sambaBadPasswordTime
 *         | sambaDomainName
 *         | sambaHomeDrive
 *         | sambaHomePath
 *         | sambaKickoffTime
 *         | sambaLMPassword
 *         | sambaLogoffTime
 *         | sambaLogonHours
 *         | sambaLogonScript
 *         | sambaLogonTime
 *         | sambaMungedDial
 *         | sambaNTPassword
 *         | sambaPasswordHistory
 *         | sambaPrimaryGroupSID
 *         | sambaProfilePath
 *         | sambaPwdCanChange
 *         | sambaPwdLastSet
 *         | sambaPwdMustChange
 *         | sambaUserWorkstations
 *     }
 *     LDAP-NAME       {"sambaSamAccount"}
 *     LDAP-DESC       "Samba 3.0 Auxilary SAM Account"
 *     ID              { 1 3 6 1 4 1 7165 2 2 6 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const sambaSamAccount: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ sambaSID, uid, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ commonName, description, displayName, sambaAcctFlags, sambaBadPasswordCount, sambaBadPasswordTime, sambaDomainName, sambaHomeDrive, sambaHomePath, sambaKickoffTime, sambaLMPassword, sambaLogoffTime, sambaLogonHours, sambaLogonScript, sambaLogonTime, sambaMungedDial, sambaNTPassword, sambaPasswordHistory, sambaPrimaryGroupSID, sambaProfilePath, sambaPwdCanChange, sambaPwdLastSet, sambaPwdMustChange, sambaUserWorkstations, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["sambaSamAccount"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Samba 3.0 Auxilary SAM Account" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 7165, 2, 2, 6,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaSamAccount */

/* eslint-enable */
