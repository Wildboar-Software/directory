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
import { Currency, _decode_Currency, _encode_Currency } from "../UPT-DataModel/Currency.ta";
export { Currency, _decode_Currency, _encode_Currency } from "../UPT-DataModel/Currency.ta";


/* START_OF_SYMBOL_DEFINITION CurrencyValue */
/**
 * @summary CurrencyValue
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * CurrencyValue  ::=  CHOICE {
 *   usDollar        [0]  Currency,
 *   frenchFranc     [1]  Currency,
 *   germanMark      [2]  Currency,
 *   dutchGuilder    [3]  Currency,
 *   italianLira     [4]  Currency,
 *   englishPound    [5]  Currency,
 *   spanishPeseta   [6]  Currency,
 *   swedishKrone    [7]  Currency,
 *   norwegianKrone  [8]  Currency,
 *   japaneseYen     [9]  Currency
 * }
 * ```
 */
export
type CurrencyValue =
    { usDollar: Currency } /* CHOICE_ALT_ROOT */
    | { frenchFranc: Currency } /* CHOICE_ALT_ROOT */
    | { germanMark: Currency } /* CHOICE_ALT_ROOT */
    | { dutchGuilder: Currency } /* CHOICE_ALT_ROOT */
    | { italianLira: Currency } /* CHOICE_ALT_ROOT */
    | { englishPound: Currency } /* CHOICE_ALT_ROOT */
    | { spanishPeseta: Currency } /* CHOICE_ALT_ROOT */
    | { swedishKrone: Currency } /* CHOICE_ALT_ROOT */
    | { norwegianKrone: Currency } /* CHOICE_ALT_ROOT */
    | { japaneseYen: Currency } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION CurrencyValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CurrencyValue */
let _cached_decoder_for_CurrencyValue: $.ASN1Decoder<CurrencyValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CurrencyValue */

/* START_OF_SYMBOL_DEFINITION _decode_CurrencyValue */
/**
 * @summary Decodes an ASN.1 element into a(n) CurrencyValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CurrencyValue} The decoded data structure.
 */
export
function _decode_CurrencyValue (el: _Element) {
    if (!_cached_decoder_for_CurrencyValue) { _cached_decoder_for_CurrencyValue = $._decode_inextensible_choice<CurrencyValue>({
    "CONTEXT 0": [ "usDollar", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 1": [ "frenchFranc", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 2": [ "germanMark", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 3": [ "dutchGuilder", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 4": [ "italianLira", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 5": [ "englishPound", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 6": [ "spanishPeseta", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 7": [ "swedishKrone", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 8": [ "norwegianKrone", $._decode_implicit<Currency>(() => _decode_Currency) ],
    "CONTEXT 9": [ "japaneseYen", $._decode_implicit<Currency>(() => _decode_Currency) ]
}); }
    return _cached_decoder_for_CurrencyValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CurrencyValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CurrencyValue */
let _cached_encoder_for_CurrencyValue: $.ASN1Encoder<CurrencyValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CurrencyValue */

/* START_OF_SYMBOL_DEFINITION _encode_CurrencyValue */
/**
 * @summary Encodes a(n) CurrencyValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CurrencyValue, encoded as an ASN.1 Element.
 */
export
function _encode_CurrencyValue (value: CurrencyValue, elGetter: $.ASN1Encoder<CurrencyValue>) {
    if (!_cached_encoder_for_CurrencyValue) { _cached_encoder_for_CurrencyValue = $._encode_choice<CurrencyValue>({
    "usDollar": $._encode_implicit(_TagClass.context, 0, () => _encode_Currency, $.BER),
    "frenchFranc": $._encode_implicit(_TagClass.context, 1, () => _encode_Currency, $.BER),
    "germanMark": $._encode_implicit(_TagClass.context, 2, () => _encode_Currency, $.BER),
    "dutchGuilder": $._encode_implicit(_TagClass.context, 3, () => _encode_Currency, $.BER),
    "italianLira": $._encode_implicit(_TagClass.context, 4, () => _encode_Currency, $.BER),
    "englishPound": $._encode_implicit(_TagClass.context, 5, () => _encode_Currency, $.BER),
    "spanishPeseta": $._encode_implicit(_TagClass.context, 6, () => _encode_Currency, $.BER),
    "swedishKrone": $._encode_implicit(_TagClass.context, 7, () => _encode_Currency, $.BER),
    "norwegianKrone": $._encode_implicit(_TagClass.context, 8, () => _encode_Currency, $.BER),
    "japaneseYen": $._encode_implicit(_TagClass.context, 9, () => _encode_Currency, $.BER),
}, $.BER); }
    return _cached_encoder_for_CurrencyValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CurrencyValue */

/* eslint-enable */
