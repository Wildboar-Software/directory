/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method */
/**
 * @summary DocumentStoreSyntax_method
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DocumentStoreSyntax-method ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type DocumentStoreSyntax_method = INTEGER;
/* END_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method */

/* START_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method_ftp */
/**
 * @summary DocumentStoreSyntax_method_ftp
 * @constant
 * @type {number}
 */
export
const DocumentStoreSyntax_method_ftp: DocumentStoreSyntax_method = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method_ftp */

/* START_OF_SYMBOL_DEFINITION ftp */
/**
 * @summary DocumentStoreSyntax_method_ftp
 * @constant
 * @type {number}
 */
export
const ftp: DocumentStoreSyntax_method = DocumentStoreSyntax_method_ftp; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION ftp */

/* START_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method_ftam */
/**
 * @summary DocumentStoreSyntax_method_ftam
 * @constant
 * @type {number}
 */
export
const DocumentStoreSyntax_method_ftam: DocumentStoreSyntax_method = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION DocumentStoreSyntax_method_ftam */

/* START_OF_SYMBOL_DEFINITION ftam */
/**
 * @summary DocumentStoreSyntax_method_ftam
 * @constant
 * @type {number}
 */
export
const ftam: DocumentStoreSyntax_method = DocumentStoreSyntax_method_ftam; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION ftam */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DocumentStoreSyntax_method */
let _cached_decoder_for_DocumentStoreSyntax_method: $.ASN1Decoder<DocumentStoreSyntax_method> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DocumentStoreSyntax_method */

/* START_OF_SYMBOL_DEFINITION _decode_DocumentStoreSyntax_method */
/**
 * @summary Decodes an ASN.1 element into a(n) DocumentStoreSyntax_method
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DocumentStoreSyntax_method} The decoded data structure.
 */
export
function _decode_DocumentStoreSyntax_method (el: _Element) {
    if (!_cached_decoder_for_DocumentStoreSyntax_method) { _cached_decoder_for_DocumentStoreSyntax_method = $._decodeInteger; }
    return _cached_decoder_for_DocumentStoreSyntax_method(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DocumentStoreSyntax_method */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DocumentStoreSyntax_method */
let _cached_encoder_for_DocumentStoreSyntax_method: $.ASN1Encoder<DocumentStoreSyntax_method> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DocumentStoreSyntax_method */

/* START_OF_SYMBOL_DEFINITION _encode_DocumentStoreSyntax_method */
/**
 * @summary Encodes a(n) DocumentStoreSyntax_method into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DocumentStoreSyntax_method, encoded as an ASN.1 Element.
 */
export
function _encode_DocumentStoreSyntax_method (value: DocumentStoreSyntax_method, elGetter: $.ASN1Encoder<DocumentStoreSyntax_method>) {
    if (!_cached_encoder_for_DocumentStoreSyntax_method) { _cached_encoder_for_DocumentStoreSyntax_method = $._encodeInteger; }
    return _cached_encoder_for_DocumentStoreSyntax_method(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DocumentStoreSyntax_method */

/* eslint-enable */
