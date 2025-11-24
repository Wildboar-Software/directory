/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { UTF8Pairs, _decode_UTF8Pairs, _encode_UTF8Pairs } from "../PKIXCRMF-2009/UTF8Pairs.ta";
import { id_regInfo_utf8Pairs } from "../PKIXCRMF-2009/id-regInfo-utf8Pairs.va";




/* START_OF_SYMBOL_DEFINITION regInfo_utf8Pairs */
/**
 * @summary regInfo_utf8Pairs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * regInfo-utf8Pairs ATTRIBUTE ::= {
 *     WITH SYNTAX     UTF8Pairs
 *     ID              id-regInfo-utf8Pairs
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UTF8Pairs>}
 * @implements {ATTRIBUTE<UTF8Pairs>}
 */
export
const regInfo_utf8Pairs: ATTRIBUTE<UTF8Pairs> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_UTF8Pairs,
    },
    encoderFor: {
        "&Type": _encode_UTF8Pairs,
    },
    "&id": id_regInfo_utf8Pairs /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION regInfo_utf8Pairs */

/* eslint-enable */
