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
import { xmozillanickname } from "../MozillaSchema/xmozillanickname.oa";
export { xmozillanickname } from "../MozillaSchema/xmozillanickname.oa";
import { xmozillausehtmlmail } from "../MozillaSchema/xmozillausehtmlmail.oa";
export { xmozillausehtmlmail } from "../MozillaSchema/xmozillausehtmlmail.oa";
import { mozillaSecondEmail } from "../MozillaSchema/mozillaSecondEmail.oa";
export { mozillaSecondEmail } from "../MozillaSchema/mozillaSecondEmail.oa";
import { mozillaPostalAddress2 } from "../MozillaSchema/mozillaPostalAddress2.oa";
export { mozillaPostalAddress2 } from "../MozillaSchema/mozillaPostalAddress2.oa";
import { mozillaHomePostalAddress2 } from "../MozillaSchema/mozillaHomePostalAddress2.oa";
export { mozillaHomePostalAddress2 } from "../MozillaSchema/mozillaHomePostalAddress2.oa";
import { mozillaHomeLocalityName } from "../MozillaSchema/mozillaHomeLocalityName.oa";
export { mozillaHomeLocalityName } from "../MozillaSchema/mozillaHomeLocalityName.oa";
import { mozillaHomeState } from "../MozillaSchema/mozillaHomeState.oa";
export { mozillaHomeState } from "../MozillaSchema/mozillaHomeState.oa";
import { mozillaHomePostalCode } from "../MozillaSchema/mozillaHomePostalCode.oa";
export { mozillaHomePostalCode } from "../MozillaSchema/mozillaHomePostalCode.oa";
import { mozillaHomeCountryName } from "../MozillaSchema/mozillaHomeCountryName.oa";
export { mozillaHomeCountryName } from "../MozillaSchema/mozillaHomeCountryName.oa";
import { mozillaHomeFriendlyCountryName } from "../MozillaSchema/mozillaHomeFriendlyCountryName.oa";
export { mozillaHomeFriendlyCountryName } from "../MozillaSchema/mozillaHomeFriendlyCountryName.oa";
import { homeurl } from "../MozillaSchema/homeurl.oa";
export { homeurl } from "../MozillaSchema/homeurl.oa";
import { workurl } from "../MozillaSchema/workurl.oa";
export { workurl } from "../MozillaSchema/workurl.oa";
import { custom1 } from "../MozillaSchema/custom1.oa";
export { custom1 } from "../MozillaSchema/custom1.oa";
import { custom2 } from "../MozillaSchema/custom2.oa";
export { custom2 } from "../MozillaSchema/custom2.oa";
import { custom3 } from "../MozillaSchema/custom3.oa";
export { custom3 } from "../MozillaSchema/custom3.oa";
import { custom4 } from "../MozillaSchema/custom4.oa";
export { custom4 } from "../MozillaSchema/custom4.oa";
import { nsAIMid } from "../MozillaSchema/nsAIMid.oa";
export { nsAIMid } from "../MozillaSchema/nsAIMid.oa";
import { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
export { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import { friendlyCountryName } from "../Cosine/friendlyCountryName.oa";
export { friendlyCountryName } from "../Cosine/friendlyCountryName.oa";
import { inetOrgPerson } from "../InetOrgPerson/inetOrgPerson.oa";


/* START_OF_SYMBOL_DEFINITION mozillaAbPersonObsolete */
/**
 * @summary mozillaAbPersonObsolete
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mozillaAbPersonObsolete OBJECT-CLASS ::= {
 *     SUBCLASS OF     {inetOrgPerson}
 *     KIND            structural
 *     MAY CONTAIN     {
 *         xmozillanickname
 *         | xmozillausehtmlmail
 *         | mozillaSecondEmail
 *         | mozillaPostalAddress2
 *         | mozillaHomePostalAddress2
 *         | mozillaHomeLocalityName
 *         | mozillaHomeState
 *         | mozillaHomePostalCode
 *         | mozillaHomeCountryName
 *         | mozillaHomeFriendlyCountryName
 *         | homeurl
 *         | workurl
 *         | custom1
 *         | custom2
 *         | custom3
 *         | custom4
 *         | nsAIMid
 *         | countryName
 *         | friendlyCountryName
 *     }
 *     LDAP-NAME       {"mozillaAbPersonObsolete"}
 *     ID              { 1 3 6 1 4 1 13769 2 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const mozillaAbPersonObsolete: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ inetOrgPerson, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ xmozillanickname, xmozillausehtmlmail, mozillaSecondEmail, mozillaPostalAddress2, mozillaHomePostalAddress2, mozillaHomeLocalityName, mozillaHomeState, mozillaHomePostalCode, mozillaHomeCountryName, mozillaHomeFriendlyCountryName, homeurl, workurl, custom1, custom2, custom3, custom4, nsAIMid, countryName, friendlyCountryName, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["mozillaAbPersonObsolete"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 13769, 2, 2, 1,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mozillaAbPersonObsolete */

/* eslint-enable */
