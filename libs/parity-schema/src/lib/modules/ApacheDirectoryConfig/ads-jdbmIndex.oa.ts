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
import { ads_index } from "../ApacheDirectoryConfig/ads-index.oa";
export { ads_index } from "../ApacheDirectoryConfig/ads-index.oa";
import { ads_indexFileName } from "../ApacheDirectoryConfig/ads-indexFileName.oa";
export { ads_indexFileName } from "../ApacheDirectoryConfig/ads-indexFileName.oa";
import { ads_indexWorkingDir } from "../ApacheDirectoryConfig/ads-indexWorkingDir.oa";
export { ads_indexWorkingDir } from "../ApacheDirectoryConfig/ads-indexWorkingDir.oa";
import { ads_indexNumDupLimit } from "../ApacheDirectoryConfig/ads-indexNumDupLimit.oa";
export { ads_indexNumDupLimit } from "../ApacheDirectoryConfig/ads-indexNumDupLimit.oa";
import { ads_indexCacheSize } from "../ApacheDirectoryConfig/ads-indexCacheSize.oa";
export { ads_indexCacheSize } from "../ApacheDirectoryConfig/ads-indexCacheSize.oa";


/* START_OF_SYMBOL_DEFINITION ads_jdbmIndex */
/**
 * @summary ads_jdbmIndex
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ads-jdbmIndex OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-index}
 *     MAY CONTAIN     {
 *         ads-indexFileName
 *         | ads-indexWorkingDir
 *         | ads-indexNumDupLimit
 *         | ads-indexCacheSize
 *     }
 *     LDAP-NAME       {"ads-jdbmIndex"}
 *     LDAP-DESC       "A JDBM indexed attribute"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 161 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const ads_jdbmIndex: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ ads_index, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ ads_indexFileName, ads_indexWorkingDir, ads_indexNumDupLimit, ads_indexCacheSize, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["ads-jdbmIndex"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "A JDBM indexed attribute" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 161,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_jdbmIndex */

/* eslint-enable */
