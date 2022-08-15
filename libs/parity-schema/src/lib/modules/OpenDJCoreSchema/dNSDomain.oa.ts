/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { aRecord } from "../Cosine/aRecord.oa";
export { aRecord } from "../Cosine/aRecord.oa";
import { mDRecord } from "../Cosine/mDRecord.oa";
import { mxRecord } from "../Cosine/mxRecord.oa";
import { nSRecord } from "../Cosine/nSRecord.oa";
import { sOARecord } from "../Cosine/sOARecord.oa";
export { sOARecord } from "../Cosine/sOARecord.oa";
import { cNAMERecord } from "../Cosine/cNAMERecord.oa";
import { domain } from "../Cosine/domain.oa";


/* START_OF_SYMBOL_DEFINITION dNSDomain */
/**
 * @summary dNSDomain
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dNSDomain OBJECT-CLASS ::= {
 *     SUBCLASS OF         { domain }
 *     KIND                structural
 *     MAY CONTAIN         {
 *         aRecord
 *         | mDRecord
 *         | mxRecord
 *         | nSRecord
 *         | sOARecord
 *         | cNAMERecord
 *     }
 *     LDAP-NAME           { "dNSDomain" }
 *     ID                  { 0 9 2342 19200300 100 4 15 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const dNSDomain: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ domain, ] /* OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ aRecord, mDRecord, mxRecord, nSRecord, sOARecord, cNAMERecord, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["dNSDomain"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([0, 9, 2342, 19200300, 100, 4, 15,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dNSDomain */

/* eslint-enable */
