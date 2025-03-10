/* eslint-disable */
import {
    BOOLEAN,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { EncryptedKey, _decode_EncryptedKey, _encode_EncryptedKey } from "../PKIXCRMF-2009/EncryptedKey.ta";
import { KeyGenParameters, _decode_KeyGenParameters, _encode_KeyGenParameters } from "../PKIXCRMF-2009/KeyGenParameters.ta";
export { EncryptedKey, _decode_EncryptedKey, _encode_EncryptedKey } from "../PKIXCRMF-2009/EncryptedKey.ta";
export { KeyGenParameters, _decode_KeyGenParameters, _encode_KeyGenParameters } from "../PKIXCRMF-2009/KeyGenParameters.ta";


/* START_OF_SYMBOL_DEFINITION PKIArchiveOptions */
/**
 * @summary PKIArchiveOptions
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PKIArchiveOptions  ::=  CHOICE {
 *     encryptedPrivKey     [0] EncryptedKey,
 *     -- the actual value of the private key
 *     keyGenParameters     [1] KeyGenParameters,
 *     -- parameters that allow the private key to be re-generated
 *     archiveRemGenPrivKey [2] BOOLEAN }
 * ```
 */
export
type PKIArchiveOptions =
    { encryptedPrivKey: EncryptedKey } /* CHOICE_ALT_ROOT */
    | { keyGenParameters: KeyGenParameters } /* CHOICE_ALT_ROOT */
    | { archiveRemGenPrivKey: BOOLEAN } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION PKIArchiveOptions */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIArchiveOptions */
let _cached_decoder_for_PKIArchiveOptions: $.ASN1Decoder<PKIArchiveOptions> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIArchiveOptions */

/* START_OF_SYMBOL_DEFINITION _decode_PKIArchiveOptions */
/**
 * @summary Decodes an ASN.1 element into a(n) PKIArchiveOptions
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PKIArchiveOptions} The decoded data structure.
 */
export
function _decode_PKIArchiveOptions (el: _Element) {
    if (!_cached_decoder_for_PKIArchiveOptions) { _cached_decoder_for_PKIArchiveOptions = $._decode_inextensible_choice<PKIArchiveOptions>({
    "CONTEXT 0": [ "encryptedPrivKey", $._decode_explicit<EncryptedKey>(() => _decode_EncryptedKey) ],
    "CONTEXT 1": [ "keyGenParameters", $._decode_implicit<KeyGenParameters>(() => _decode_KeyGenParameters) ],
    "CONTEXT 2": [ "archiveRemGenPrivKey", $._decode_implicit<BOOLEAN>(() => $._decodeBoolean) ]
}); }
    return _cached_decoder_for_PKIArchiveOptions(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PKIArchiveOptions */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIArchiveOptions */
let _cached_encoder_for_PKIArchiveOptions: $.ASN1Encoder<PKIArchiveOptions> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIArchiveOptions */

/* START_OF_SYMBOL_DEFINITION _encode_PKIArchiveOptions */
/**
 * @summary Encodes a(n) PKIArchiveOptions into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PKIArchiveOptions, encoded as an ASN.1 Element.
 */
export
function _encode_PKIArchiveOptions (value: PKIArchiveOptions, elGetter: $.ASN1Encoder<PKIArchiveOptions>) {
    if (!_cached_encoder_for_PKIArchiveOptions) { _cached_encoder_for_PKIArchiveOptions = $._encode_choice<PKIArchiveOptions>({
    "encryptedPrivKey": $._encode_explicit(_TagClass.context, 0, () => _encode_EncryptedKey, $.BER),
    "keyGenParameters": $._encode_implicit(_TagClass.context, 1, () => _encode_KeyGenParameters, $.BER),
    "archiveRemGenPrivKey": $._encode_implicit(_TagClass.context, 2, () => $._encodeBoolean, $.BER),
}, $.BER); }
    return _cached_encoder_for_PKIArchiveOptions(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PKIArchiveOptions */

/* eslint-enable */
