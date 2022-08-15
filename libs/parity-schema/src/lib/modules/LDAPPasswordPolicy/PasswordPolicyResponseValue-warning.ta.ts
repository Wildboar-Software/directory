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



/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_warning */
/**
 * @summary PasswordPolicyResponseValue_warning
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PasswordPolicyResponseValue-warning ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type PasswordPolicyResponseValue_warning =
    { timeBeforeExpiration: INTEGER } /* CHOICE_ALT_ROOT */
    | { graceAuthNsRemaining: INTEGER } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_warning */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue_warning */
let _cached_decoder_for_PasswordPolicyResponseValue_warning: $.ASN1Decoder<PasswordPolicyResponseValue_warning> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue_warning */

/* START_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue_warning */
/**
 * @summary Decodes an ASN.1 element into a(n) PasswordPolicyResponseValue_warning
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PasswordPolicyResponseValue_warning} The decoded data structure.
 */
export
function _decode_PasswordPolicyResponseValue_warning (el: _Element) {
    if (!_cached_decoder_for_PasswordPolicyResponseValue_warning) { _cached_decoder_for_PasswordPolicyResponseValue_warning = $._decode_extensible_choice<PasswordPolicyResponseValue_warning>({
    "CONTEXT 0": [ "timeBeforeExpiration", $._decode_implicit<INTEGER>(() => $._decodeInteger) ],
    "CONTEXT 1": [ "graceAuthNsRemaining", $._decode_implicit<INTEGER>(() => $._decodeInteger) ]
}); }
    return _cached_decoder_for_PasswordPolicyResponseValue_warning(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue_warning */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue_warning */
let _cached_encoder_for_PasswordPolicyResponseValue_warning: $.ASN1Encoder<PasswordPolicyResponseValue_warning> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue_warning */

/* START_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue_warning */
/**
 * @summary Encodes a(n) PasswordPolicyResponseValue_warning into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PasswordPolicyResponseValue_warning, encoded as an ASN.1 Element.
 */
export
function _encode_PasswordPolicyResponseValue_warning (value: PasswordPolicyResponseValue_warning, elGetter: $.ASN1Encoder<PasswordPolicyResponseValue_warning>) {
    if (!_cached_encoder_for_PasswordPolicyResponseValue_warning) { _cached_encoder_for_PasswordPolicyResponseValue_warning = $._encode_choice<PasswordPolicyResponseValue_warning>({
    "timeBeforeExpiration": $._encode_implicit(_TagClass.context, 0, () => $._encodeInteger, $.BER),
    "graceAuthNsRemaining": $._encode_implicit(_TagClass.context, 1, () => $._encodeInteger, $.BER),
}, $.BER); }
    return _cached_encoder_for_PasswordPolicyResponseValue_warning(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue_warning */

/* eslint-enable */
