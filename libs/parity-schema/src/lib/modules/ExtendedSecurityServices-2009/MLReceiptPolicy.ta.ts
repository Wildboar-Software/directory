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
import { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
export { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";


/* START_OF_SYMBOL_DEFINITION MLReceiptPolicy */
/**
 * @summary MLReceiptPolicy
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MLReceiptPolicy  ::=  CHOICE {
 *     none         [0] NULL,
 *     insteadOf    [1] SEQUENCE SIZE (1..MAX) OF GeneralNames,
 *     inAdditionTo [2] SEQUENCE SIZE (1..MAX) OF GeneralNames }
 * ```
 */
export
type MLReceiptPolicy =
    { none: NULL } /* CHOICE_ALT_ROOT */
    | { insteadOf: GeneralNames[] } /* CHOICE_ALT_ROOT */
    | { inAdditionTo: GeneralNames[] } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MLReceiptPolicy */
let _cached_decoder_for_MLReceiptPolicy: $.ASN1Decoder<MLReceiptPolicy> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _decode_MLReceiptPolicy */
/**
 * @summary Decodes an ASN.1 element into a(n) MLReceiptPolicy
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MLReceiptPolicy} The decoded data structure.
 */
export
function _decode_MLReceiptPolicy (el: _Element) {
    if (!_cached_decoder_for_MLReceiptPolicy) { _cached_decoder_for_MLReceiptPolicy = $._decode_inextensible_choice<MLReceiptPolicy>({
    "CONTEXT 0": [ "none", $._decode_implicit<NULL>(() => $._decodeNull) ],
    "CONTEXT 1": [ "insteadOf", $._decode_implicit<GeneralNames[]>(() => $._decodeSequenceOf<GeneralNames>(() => _decode_GeneralNames)) ],
    "CONTEXT 2": [ "inAdditionTo", $._decode_implicit<GeneralNames[]>(() => $._decodeSequenceOf<GeneralNames>(() => _decode_GeneralNames)) ]
}); }
    return _cached_decoder_for_MLReceiptPolicy(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MLReceiptPolicy */
let _cached_encoder_for_MLReceiptPolicy: $.ASN1Encoder<MLReceiptPolicy> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MLReceiptPolicy */

/* START_OF_SYMBOL_DEFINITION _encode_MLReceiptPolicy */
/**
 * @summary Encodes a(n) MLReceiptPolicy into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MLReceiptPolicy, encoded as an ASN.1 Element.
 */
export
function _encode_MLReceiptPolicy (value: MLReceiptPolicy, elGetter: $.ASN1Encoder<MLReceiptPolicy>) {
    if (!_cached_encoder_for_MLReceiptPolicy) { _cached_encoder_for_MLReceiptPolicy = $._encode_choice<MLReceiptPolicy>({
    "none": $._encode_implicit(_TagClass.context, 0, () => $._encodeNull, $.BER),
    "insteadOf": $._encode_implicit(_TagClass.context, 1, () => $._encodeSequenceOf<GeneralNames>(() => _encode_GeneralNames, $.BER), $.BER),
    "inAdditionTo": $._encode_implicit(_TagClass.context, 2, () => $._encodeSequenceOf<GeneralNames>(() => _encode_GeneralNames, $.BER), $.BER),
}, $.BER); }
    return _cached_encoder_for_MLReceiptPolicy(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MLReceiptPolicy */

/* eslint-enable */
