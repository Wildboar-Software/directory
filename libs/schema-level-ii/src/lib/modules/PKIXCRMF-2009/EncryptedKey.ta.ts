/* eslint-disable */
import { EnvelopedData, _decode_EnvelopedData, _encode_EnvelopedData } from "@wildboar/cms";
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { EncryptedValue, _decode_EncryptedValue, _encode_EncryptedValue } from "../PKIXCRMF-2009/EncryptedValue.ta";


/* START_OF_SYMBOL_DEFINITION EncryptedKey */
/**
 * @summary EncryptedKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * EncryptedKey  ::=  CHOICE {
 *     encryptedValue        EncryptedValue,   -- Deprecated
 *     envelopedData     [0] EnvelopedData }
 * ```
 */
export
type EncryptedKey =
    { encryptedValue: EncryptedValue } /* CHOICE_ALT_ROOT */
    | { envelopedData: EnvelopedData } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION EncryptedKey */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EncryptedKey */
let _cached_decoder_for_EncryptedKey: $.ASN1Decoder<EncryptedKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EncryptedKey */

/* START_OF_SYMBOL_DEFINITION _decode_EncryptedKey */
/**
 * @summary Decodes an ASN.1 element into a(n) EncryptedKey
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EncryptedKey} The decoded data structure.
 */
export
function _decode_EncryptedKey (el: _Element) {
    if (!_cached_decoder_for_EncryptedKey) { _cached_decoder_for_EncryptedKey = $._decode_inextensible_choice<EncryptedKey>({
    "UNIVERSAL 16": [ "encryptedValue", _decode_EncryptedValue ],
    "CONTEXT 0": [ "envelopedData", $._decode_implicit<EnvelopedData>(() => _decode_EnvelopedData) ]
}); }
    return _cached_decoder_for_EncryptedKey(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EncryptedKey */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EncryptedKey */
let _cached_encoder_for_EncryptedKey: $.ASN1Encoder<EncryptedKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EncryptedKey */

/* START_OF_SYMBOL_DEFINITION _encode_EncryptedKey */
/**
 * @summary Encodes a(n) EncryptedKey into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EncryptedKey, encoded as an ASN.1 Element.
 */
export
function _encode_EncryptedKey (value: EncryptedKey, elGetter: $.ASN1Encoder<EncryptedKey>) {
    if (!_cached_encoder_for_EncryptedKey) { _cached_encoder_for_EncryptedKey = $._encode_choice<EncryptedKey>({
    "encryptedValue": _encode_EncryptedValue,
    "envelopedData": $._encode_implicit(_TagClass.context, 0, () => _encode_EnvelopedData, $.BER),
}, $.BER); }
    return _cached_encoder_for_EncryptedKey(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EncryptedKey */

/* eslint-enable */
