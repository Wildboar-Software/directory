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
import { Certificate, _decode_Certificate, _encode_Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
export { Certificate, _decode_Certificate, _encode_Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";
export { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";


/* START_OF_SYMBOL_DEFINITION BdcPKCInformation */
/**
 * @summary BdcPKCInformation
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BdcPKCInformation  ::=  CHOICE {
 *   bdcPublicKeyCertificate  Certificate,
 *   -- Certificate is imported from [ITU-T X.509]
 *   bpuCertificateReference  URI
 * }
 * ```
 */
export
type BdcPKCInformation =
    { bdcPublicKeyCertificate: Certificate } /* CHOICE_ALT_ROOT */
    | { bpuCertificateReference: URI } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BdcPKCInformation */
let _cached_decoder_for_BdcPKCInformation: $.ASN1Decoder<BdcPKCInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _decode_BdcPKCInformation */
/**
 * @summary Decodes an ASN.1 element into a(n) BdcPKCInformation
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BdcPKCInformation} The decoded data structure.
 */
export
function _decode_BdcPKCInformation (el: _Element) {
    if (!_cached_decoder_for_BdcPKCInformation) { _cached_decoder_for_BdcPKCInformation = $._decode_inextensible_choice<BdcPKCInformation>({
    "CONTEXT 0": [ "bdcPublicKeyCertificate", _decode_Certificate ],
    "CONTEXT 1": [ "bpuCertificateReference", _decode_URI ]
}); }
    return _cached_decoder_for_BdcPKCInformation(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BdcPKCInformation */
let _cached_encoder_for_BdcPKCInformation: $.ASN1Encoder<BdcPKCInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _encode_BdcPKCInformation */
/**
 * @summary Encodes a(n) BdcPKCInformation into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BdcPKCInformation, encoded as an ASN.1 Element.
 */
export
function _encode_BdcPKCInformation (value: BdcPKCInformation, elGetter: $.ASN1Encoder<BdcPKCInformation>) {
    if (!_cached_encoder_for_BdcPKCInformation) { _cached_encoder_for_BdcPKCInformation = $._encode_choice<BdcPKCInformation>({
    "bdcPublicKeyCertificate": _encode_Certificate,
    "bpuCertificateReference": _encode_URI,
}, $.BER); }
    return _cached_encoder_for_BdcPKCInformation(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BdcPKCInformation */

/* eslint-enable */
