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
import { UUID, _decode_UUID, _encode_UUID } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UUID.ta";
export { UUID, _decode_UUID, _encode_UUID } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UUID.ta";
import { id_lsx_uuid } from "../UUID/id-lsx-uuid.va";
export { id_lsx_uuid } from "../UUID/id-lsx-uuid.va";
import { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";


/* START_OF_SYMBOL_DEFINITION uuid */
/**
 * @summary uuid
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * uuid SYNTAX-NAME ::= {
 *     LDAP-DESC               "UUID"
 *     DIRECTORY SYNTAX        UUID
 *     ID                      id-lsx-uuid
 * }
 * ```
 * 
 * @constant
 * @type {SYNTAX_NAME<UUID>}
 * @implements {SYNTAX_NAME<UUID>}
 */
export
const uuid: SYNTAX_NAME<UUID> = {
    class: "SYNTAX-NAME",
    decoderFor: {
        "&Type": _decode_UUID,
    },
    encoderFor: {
        "&Type": _encode_UUID,
    },
    "&ldapDesc": "UUID" /* OBJECT_FIELD_SETTING */,
    "&id": id_lsx_uuid /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uuid */

/* eslint-enable */
