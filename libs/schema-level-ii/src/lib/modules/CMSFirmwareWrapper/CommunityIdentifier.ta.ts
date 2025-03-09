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
import { HardwareModules, _decode_HardwareModules, _encode_HardwareModules } from "../CMSFirmwareWrapper/HardwareModules.ta";
export { HardwareModules, _decode_HardwareModules, _encode_HardwareModules } from "../CMSFirmwareWrapper/HardwareModules.ta";


/* START_OF_SYMBOL_DEFINITION CommunityIdentifier */
/**
 * @summary CommunityIdentifier
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * CommunityIdentifier  ::=  CHOICE {
 *     communityOID                OBJECT IDENTIFIER,
 *     hwModuleList                HardwareModules
 * }
 * ```
 */
export
type CommunityIdentifier =
    { communityOID: OBJECT_IDENTIFIER } /* CHOICE_ALT_ROOT */
    | { hwModuleList: HardwareModules } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifier */
let _cached_decoder_for_CommunityIdentifier: $.ASN1Decoder<CommunityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_CommunityIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) CommunityIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CommunityIdentifier} The decoded data structure.
 */
export
function _decode_CommunityIdentifier (el: _Element) {
    if (!_cached_decoder_for_CommunityIdentifier) { _cached_decoder_for_CommunityIdentifier = $._decode_inextensible_choice<CommunityIdentifier>({
    "UNIVERSAL 6": [ "communityOID", $._decodeObjectIdentifier ],
    "UNIVERSAL 16": [ "hwModuleList", _decode_HardwareModules ]
}); }
    return _cached_decoder_for_CommunityIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifier */
let _cached_encoder_for_CommunityIdentifier: $.ASN1Encoder<CommunityIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CommunityIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_CommunityIdentifier */
/**
 * @summary Encodes a(n) CommunityIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CommunityIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_CommunityIdentifier (value: CommunityIdentifier, elGetter: $.ASN1Encoder<CommunityIdentifier>) {
    if (!_cached_encoder_for_CommunityIdentifier) { _cached_encoder_for_CommunityIdentifier = $._encode_choice<CommunityIdentifier>({
    "communityOID": $._encodeObjectIdentifier,
    "hwModuleList": _encode_HardwareModules,
}, $.BER); }
    return _cached_encoder_for_CommunityIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CommunityIdentifier */

/* eslint-enable */
