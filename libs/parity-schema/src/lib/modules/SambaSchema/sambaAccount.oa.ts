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
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
export { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { rid } from "../SambaSchema/rid.oa";
export { rid } from "../SambaSchema/rid.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { lmPassword } from "../SambaSchema/lmPassword.oa";
export { lmPassword } from "../SambaSchema/lmPassword.oa";
import { ntPassword } from "../SambaSchema/ntPassword.oa";
export { ntPassword } from "../SambaSchema/ntPassword.oa";
import { pwdLastSet } from "../SambaSchema/pwdLastSet.oa";
export { pwdLastSet } from "../SambaSchema/pwdLastSet.oa";
import { logonTime } from "../SambaSchema/logonTime.oa";
export { logonTime } from "../SambaSchema/logonTime.oa";
import { logoffTime } from "../SambaSchema/logoffTime.oa";
export { logoffTime } from "../SambaSchema/logoffTime.oa";
import { kickoffTime } from "../SambaSchema/kickoffTime.oa";
export { kickoffTime } from "../SambaSchema/kickoffTime.oa";
import { pwdCanChange } from "../SambaSchema/pwdCanChange.oa";
export { pwdCanChange } from "../SambaSchema/pwdCanChange.oa";
import { pwdMustChange } from "../SambaSchema/pwdMustChange.oa";
export { pwdMustChange } from "../SambaSchema/pwdMustChange.oa";
import { acctFlags } from "../SambaSchema/acctFlags.oa";
export { acctFlags } from "../SambaSchema/acctFlags.oa";
import { displayName } from "../InetOrgPerson/displayName.oa";
export { displayName } from "../InetOrgPerson/displayName.oa";
import { smbHome } from "../SambaSchema/smbHome.oa";
export { smbHome } from "../SambaSchema/smbHome.oa";
import { homeDrive } from "../SambaSchema/homeDrive.oa";
export { homeDrive } from "../SambaSchema/homeDrive.oa";
import { scriptPath } from "../SambaSchema/scriptPath.oa";
export { scriptPath } from "../SambaSchema/scriptPath.oa";
import { profilePath } from "../SambaSchema/profilePath.oa";
export { profilePath } from "../SambaSchema/profilePath.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { userWorkstations } from "../SambaSchema/userWorkstations.oa";
export { userWorkstations } from "../SambaSchema/userWorkstations.oa";
import { primaryGroupID } from "../SambaSchema/primaryGroupID.oa";
export { primaryGroupID } from "../SambaSchema/primaryGroupID.oa";
import { domain } from "../SambaSchema/domain.oa";
export { domain } from "../SambaSchema/domain.oa";
import { id_samba_oc } from "../SambaSchema/id-samba-oc.va";
export { id_samba_oc } from "../SambaSchema/id-samba-oc.va";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";


/* START_OF_SYMBOL_DEFINITION sambaAccount */
/**
 * @summary sambaAccount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MUST CONTAIN        { uid | rid }
 *     MAY CONTAIN         {
 *         commonName
 *         | lmPassword
 *         | ntPassword
 *         | pwdLastSet
 *         | logonTime
 *         | logoffTime
 *         | kickoffTime
 *         | pwdCanChange
 *         | pwdMustChange
 *         | acctFlags
 *         | displayName
 *         | smbHome
 *         | homeDrive
 *         | scriptPath
 *         | profilePath
 *         | description
 *         | userWorkstations
 *         | primaryGroupID
 *         | domain
 *     }
 *     LDAP-NAME           { "sambaAccount" }
 *     LDAP-DESC           "Samba Auxilary Account"
 *     ID                  { id-samba-oc 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const sambaAccount: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ uid, rid, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ commonName, lmPassword, ntPassword, pwdLastSet, logonTime, logoffTime, kickoffTime, pwdCanChange, pwdMustChange, acctFlags, displayName, smbHome, homeDrive, scriptPath, profilePath, description, userWorkstations, primaryGroupID, domain, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["sambaAccount"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Samba Auxilary Account" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([3,], id_samba_oc) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaAccount */

/* eslint-enable */
