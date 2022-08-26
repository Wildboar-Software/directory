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
import { AllOrFirstTier, AllOrFirstTier_allReceipts /* IMPORTED_LONG_NAMED_INTEGER */, allReceipts /* IMPORTED_SHORT_NAMED_INTEGER */, AllOrFirstTier_firstTierRecipients /* IMPORTED_LONG_NAMED_INTEGER */, firstTierRecipients /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_AllOrFirstTier, _encode_AllOrFirstTier } from "../ExtendedSecurityServices-2009/AllOrFirstTier.ta";
export { AllOrFirstTier, AllOrFirstTier_allReceipts /* IMPORTED_LONG_NAMED_INTEGER */, allReceipts /* IMPORTED_SHORT_NAMED_INTEGER */, AllOrFirstTier_firstTierRecipients /* IMPORTED_LONG_NAMED_INTEGER */, firstTierRecipients /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_AllOrFirstTier, _encode_AllOrFirstTier } from "../ExtendedSecurityServices-2009/AllOrFirstTier.ta";
import { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
export { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";


/* START_OF_SYMBOL_DEFINITION ReceiptsFrom */
/**
 * @summary ReceiptsFrom
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ReceiptsFrom  ::=  CHOICE {
 *     allOrFirstTier [0] AllOrFirstTier,
 *         -- formerly "allOrNone [0]AllOrNone"
 *     receiptList [1] SEQUENCE OF GeneralNames }
 * ```
 */
export
type ReceiptsFrom =
    { allOrFirstTier: AllOrFirstTier } /* CHOICE_ALT_ROOT */
    | { receiptList: GeneralNames[] } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptsFrom */
let _cached_decoder_for_ReceiptsFrom: $.ASN1Decoder<ReceiptsFrom> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _decode_ReceiptsFrom */
/**
 * @summary Decodes an ASN.1 element into a(n) ReceiptsFrom
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ReceiptsFrom} The decoded data structure.
 */
export
function _decode_ReceiptsFrom (el: _Element) {
    if (!_cached_decoder_for_ReceiptsFrom) { _cached_decoder_for_ReceiptsFrom = $._decode_inextensible_choice<ReceiptsFrom>({
    "CONTEXT 0": [ "allOrFirstTier", $._decode_implicit<AllOrFirstTier>(() => _decode_AllOrFirstTier) ],
    "CONTEXT 1": [ "receiptList", $._decode_implicit<GeneralNames[]>(() => $._decodeSequenceOf<GeneralNames>(() => _decode_GeneralNames)) ]
}); }
    return _cached_decoder_for_ReceiptsFrom(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptsFrom */
let _cached_encoder_for_ReceiptsFrom: $.ASN1Encoder<ReceiptsFrom> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptsFrom */

/* START_OF_SYMBOL_DEFINITION _encode_ReceiptsFrom */
/**
 * @summary Encodes a(n) ReceiptsFrom into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ReceiptsFrom, encoded as an ASN.1 Element.
 */
export
function _encode_ReceiptsFrom (value: ReceiptsFrom, elGetter: $.ASN1Encoder<ReceiptsFrom>) {
    if (!_cached_encoder_for_ReceiptsFrom) { _cached_encoder_for_ReceiptsFrom = $._encode_choice<ReceiptsFrom>({
    "allOrFirstTier": $._encode_implicit(_TagClass.context, 0, () => _encode_AllOrFirstTier, $.BER),
    "receiptList": $._encode_implicit(_TagClass.context, 1, () => $._encodeSequenceOf<GeneralNames>(() => _encode_GeneralNames, $.BER), $.BER),
}, $.BER); }
    return _cached_encoder_for_ReceiptsFrom(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ReceiptsFrom */

/* eslint-enable */
