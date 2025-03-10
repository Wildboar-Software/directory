/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { PKIArchiveOptions, _decode_PKIArchiveOptions, _encode_PKIArchiveOptions } from "../PKIXCRMF-2009/PKIArchiveOptions.ta";
import { id_regCtrl_pkiArchiveOptions } from "../PKIXCRMF-2009/id-regCtrl-pkiArchiveOptions.va";




/* START_OF_SYMBOL_DEFINITION regCtrl_pkiArchiveOptions */
/**
 * @summary regCtrl_pkiArchiveOptions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * regCtrl-pkiArchiveOptions ATTRIBUTE ::= {
 *     WITH SYNTAX     PKIArchiveOptions
 *     ID              id-regCtrl-pkiArchiveOptions
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PKIArchiveOptions>}
 * @implements {ATTRIBUTE<PKIArchiveOptions>}
 */
export
const regCtrl_pkiArchiveOptions: ATTRIBUTE<PKIArchiveOptions> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_PKIArchiveOptions,
    },
    encoderFor: {
        "&Type": _encode_PKIArchiveOptions,
    },
    "&id": id_regCtrl_pkiArchiveOptions /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION regCtrl_pkiArchiveOptions */

/* eslint-enable */
