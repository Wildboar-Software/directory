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
import { sudoUser } from "../SudoSchema/sudoUser.oa";
export { sudoUser } from "../SudoSchema/sudoUser.oa";
import { sudoHost } from "../SudoSchema/sudoHost.oa";
export { sudoHost } from "../SudoSchema/sudoHost.oa";
import { sudoCommand } from "../SudoSchema/sudoCommand.oa";
export { sudoCommand } from "../SudoSchema/sudoCommand.oa";
import { sudoRunAs } from "../SudoSchema/sudoRunAs.oa";
export { sudoRunAs } from "../SudoSchema/sudoRunAs.oa";
import { sudoRunAsUser } from "../SudoSchema/sudoRunAsUser.oa";
export { sudoRunAsUser } from "../SudoSchema/sudoRunAsUser.oa";
import { sudoRunAsGroup } from "../SudoSchema/sudoRunAsGroup.oa";
export { sudoRunAsGroup } from "../SudoSchema/sudoRunAsGroup.oa";
import { sudoOption } from "../SudoSchema/sudoOption.oa";
export { sudoOption } from "../SudoSchema/sudoOption.oa";
import { sudoNotBefore } from "../SudoSchema/sudoNotBefore.oa";
export { sudoNotBefore } from "../SudoSchema/sudoNotBefore.oa";
import { sudoNotAfter } from "../SudoSchema/sudoNotAfter.oa";
export { sudoNotAfter } from "../SudoSchema/sudoNotAfter.oa";
import { sudoOrder } from "../SudoSchema/sudoOrder.oa";
export { sudoOrder } from "../SudoSchema/sudoOrder.oa";
import { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
export { description } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import { id_aaron_spangler } from "../SudoSchema/id-aaron-spangler.va";
export { id_aaron_spangler } from "../SudoSchema/id-aaron-spangler.va";


/* START_OF_SYMBOL_DEFINITION sudoRole */
/**
 * @summary sudoRole
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * sudoRole OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         {
 *         sudoUser
 *         | sudoHost
 *         | sudoCommand
 *         | sudoRunAs
 *         | sudoRunAsUser
 *         | sudoRunAsGroup
 *         | sudoOption
 *         | sudoNotBefore
 *         | sudoNotAfter
 *         | sudoOrder
 *         | description
 *     }
 *     LDAP-NAME           { "sudoRole" }
 *     LDAP-DESC           "Sudoer Entries"
 *     ID                  { id-aaron-spangler 9 2 1 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const sudoRole: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ sudoUser, sudoHost, sudoCommand, sudoRunAs, sudoRunAsUser, sudoRunAsGroup, sudoOption, sudoNotBefore, sudoNotAfter, sudoOrder, description, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["sudoRole"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Sudoer Entries" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([9, 2, 1,], id_aaron_spangler) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sudoRole */

/* eslint-enable */
