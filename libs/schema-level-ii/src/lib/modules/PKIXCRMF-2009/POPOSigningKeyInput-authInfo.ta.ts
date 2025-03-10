/* eslint-disable */
import { GeneralName, _decode_GeneralName, _encode_GeneralName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PKMACValue, _decode_PKMACValue, _encode_PKMACValue } from "../PKIXCRMF-2009/PKMACValue.ta";


/* START_OF_SYMBOL_DEFINITION POPOSigningKeyInput_authInfo */
/**
 * @summary POPOSigningKeyInput_authInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * POPOSigningKeyInput-authInfo ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type POPOSigningKeyInput_authInfo =
    { sender: GeneralName } /* CHOICE_ALT_ROOT */
    | { publicKeyMAC: PKMACValue } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION POPOSigningKeyInput_authInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKeyInput_authInfo */
let _cached_decoder_for_POPOSigningKeyInput_authInfo: $.ASN1Decoder<POPOSigningKeyInput_authInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKeyInput_authInfo */

/* START_OF_SYMBOL_DEFINITION _decode_POPOSigningKeyInput_authInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) POPOSigningKeyInput_authInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {POPOSigningKeyInput_authInfo} The decoded data structure.
 */
export
function _decode_POPOSigningKeyInput_authInfo (el: _Element) {
    if (!_cached_decoder_for_POPOSigningKeyInput_authInfo) { _cached_decoder_for_POPOSigningKeyInput_authInfo = $._decode_inextensible_choice<POPOSigningKeyInput_authInfo>({
    "CONTEXT 0": [ "sender", $._decode_implicit<GeneralName>(() => _decode_GeneralName) ],
    "UNIVERSAL 16": [ "publicKeyMAC", _decode_PKMACValue ]
}); }
    return _cached_decoder_for_POPOSigningKeyInput_authInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_POPOSigningKeyInput_authInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKeyInput_authInfo */
let _cached_encoder_for_POPOSigningKeyInput_authInfo: $.ASN1Encoder<POPOSigningKeyInput_authInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKeyInput_authInfo */

/* START_OF_SYMBOL_DEFINITION _encode_POPOSigningKeyInput_authInfo */
/**
 * @summary Encodes a(n) POPOSigningKeyInput_authInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The POPOSigningKeyInput_authInfo, encoded as an ASN.1 Element.
 */
export
function _encode_POPOSigningKeyInput_authInfo (value: POPOSigningKeyInput_authInfo, elGetter: $.ASN1Encoder<POPOSigningKeyInput_authInfo>) {
    if (!_cached_encoder_for_POPOSigningKeyInput_authInfo) { _cached_encoder_for_POPOSigningKeyInput_authInfo = $._encode_choice<POPOSigningKeyInput_authInfo>({
    "sender": $._encode_implicit(_TagClass.context, 0, () => _encode_GeneralName, $.BER),
    "publicKeyMAC": _encode_PKMACValue,
}, $.BER); }
    return _cached_encoder_for_POPOSigningKeyInput_authInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_POPOSigningKeyInput_authInfo */

/* eslint-enable */
