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
import { fedfsFsl } from "../FedFSSchema/fedfsFsl.oa";
export { fedfsFsl } from "../FedFSSchema/fedfsFsl.oa";
import { fedfsNfsURI } from "../FedFSSchema/fedfsNfsURI.oa";
export { fedfsNfsURI } from "../FedFSSchema/fedfsNfsURI.oa";
import { fedfsNfsCurrency } from "../FedFSSchema/fedfsNfsCurrency.oa";
export { fedfsNfsCurrency } from "../FedFSSchema/fedfsNfsCurrency.oa";
import { fedfsNfsGenFlagWritable } from "../FedFSSchema/fedfsNfsGenFlagWritable.oa";
export { fedfsNfsGenFlagWritable } from "../FedFSSchema/fedfsNfsGenFlagWritable.oa";
import { fedfsNfsGenFlagGoing } from "../FedFSSchema/fedfsNfsGenFlagGoing.oa";
export { fedfsNfsGenFlagGoing } from "../FedFSSchema/fedfsNfsGenFlagGoing.oa";
import { fedfsNfsGenFlagSplit } from "../FedFSSchema/fedfsNfsGenFlagSplit.oa";
export { fedfsNfsGenFlagSplit } from "../FedFSSchema/fedfsNfsGenFlagSplit.oa";
import { fedfsNfsTransFlagRdma } from "../FedFSSchema/fedfsNfsTransFlagRdma.oa";
export { fedfsNfsTransFlagRdma } from "../FedFSSchema/fedfsNfsTransFlagRdma.oa";
import { fedfsNfsClassSimul } from "../FedFSSchema/fedfsNfsClassSimul.oa";
export { fedfsNfsClassSimul } from "../FedFSSchema/fedfsNfsClassSimul.oa";
import { fedfsNfsClassHandle } from "../FedFSSchema/fedfsNfsClassHandle.oa";
export { fedfsNfsClassHandle } from "../FedFSSchema/fedfsNfsClassHandle.oa";
import { fedfsNfsClassFileid } from "../FedFSSchema/fedfsNfsClassFileid.oa";
export { fedfsNfsClassFileid } from "../FedFSSchema/fedfsNfsClassFileid.oa";
import { fedfsNfsClassWritever } from "../FedFSSchema/fedfsNfsClassWritever.oa";
export { fedfsNfsClassWritever } from "../FedFSSchema/fedfsNfsClassWritever.oa";
import { fedfsNfsClassChange } from "../FedFSSchema/fedfsNfsClassChange.oa";
export { fedfsNfsClassChange } from "../FedFSSchema/fedfsNfsClassChange.oa";
import { fedfsNfsClassReaddir } from "../FedFSSchema/fedfsNfsClassReaddir.oa";
export { fedfsNfsClassReaddir } from "../FedFSSchema/fedfsNfsClassReaddir.oa";
import { fedfsNfsReadRank } from "../FedFSSchema/fedfsNfsReadRank.oa";
export { fedfsNfsReadRank } from "../FedFSSchema/fedfsNfsReadRank.oa";
import { fedfsNfsReadOrder } from "../FedFSSchema/fedfsNfsReadOrder.oa";
export { fedfsNfsReadOrder } from "../FedFSSchema/fedfsNfsReadOrder.oa";
import { fedfsNfsWriteRank } from "../FedFSSchema/fedfsNfsWriteRank.oa";
export { fedfsNfsWriteRank } from "../FedFSSchema/fedfsNfsWriteRank.oa";
import { fedfsNfsWriteOrder } from "../FedFSSchema/fedfsNfsWriteOrder.oa";
export { fedfsNfsWriteOrder } from "../FedFSSchema/fedfsNfsWriteOrder.oa";
import { fedfsNfsVarSub } from "../FedFSSchema/fedfsNfsVarSub.oa";
export { fedfsNfsVarSub } from "../FedFSSchema/fedfsNfsVarSub.oa";
import { fedfsNfsValidFor } from "../FedFSSchema/fedfsNfsValidFor.oa";
export { fedfsNfsValidFor } from "../FedFSSchema/fedfsNfsValidFor.oa";
import { daniel_ellard } from "../FedFSSchema/daniel-ellard.va";
export { daniel_ellard } from "../FedFSSchema/daniel-ellard.va";


/* START_OF_SYMBOL_DEFINITION fedfsNfsFsl */
/**
 * @summary fedfsNfsFsl
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * fedfsNfsFsl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {fedfsFsl}
 *     KIND            structural
 *     MUST CONTAIN    {
 *         fedfsNfsURI
 *         | fedfsNfsCurrency
 *         | fedfsNfsGenFlagWritable
 *         | fedfsNfsGenFlagGoing
 *         | fedfsNfsGenFlagSplit
 *         | fedfsNfsTransFlagRdma
 *         | fedfsNfsClassSimul
 *         | fedfsNfsClassHandle
 *         | fedfsNfsClassFileid
 *         | fedfsNfsClassWritever
 *         | fedfsNfsClassChange
 *         | fedfsNfsClassReaddir
 *         | fedfsNfsReadRank
 *         | fedfsNfsReadOrder
 *         | fedfsNfsWriteRank
 *         | fedfsNfsWriteOrder
 *         | fedfsNfsVarSub
 *         | fedfsNfsValidFor
 *     }
 *     LDAP-NAME       {"fedfsNfsFsl"}
 *     LDAP-DESC       "An NFS location of a fileset"
 *     ID              { daniel-ellard 1 1004 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const fedfsNfsFsl: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ fedfsFsl, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ fedfsNfsURI, fedfsNfsCurrency, fedfsNfsGenFlagWritable, fedfsNfsGenFlagGoing, fedfsNfsGenFlagSplit, fedfsNfsTransFlagRdma, fedfsNfsClassSimul, fedfsNfsClassHandle, fedfsNfsClassFileid, fedfsNfsClassWritever, fedfsNfsClassChange, fedfsNfsClassReaddir, fedfsNfsReadRank, fedfsNfsReadOrder, fedfsNfsWriteRank, fedfsNfsWriteOrder, fedfsNfsVarSub, fedfsNfsValidFor, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["fedfsNfsFsl"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "An NFS location of a fileset" /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 1004,], daniel_ellard) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsNfsFsl */

/* eslint-enable */
