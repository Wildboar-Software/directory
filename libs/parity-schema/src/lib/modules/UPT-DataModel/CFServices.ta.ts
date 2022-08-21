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
import { Service, Service_isdnTelephony /* IMPORTED_LONG_NAMED_INTEGER */, isdnTelephony /* IMPORTED_SHORT_NAMED_INTEGER */, Service_icRegistration /* IMPORTED_LONG_NAMED_INTEGER */, icRegistration /* IMPORTED_SHORT_NAMED_INTEGER */, Service_serviceProfileModification /* IMPORTED_LONG_NAMED_INTEGER */, serviceProfileModification /* IMPORTED_SHORT_NAMED_INTEGER */, Service_standard /* IMPORTED_LONG_NAMED_INTEGER */, standard /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingUnconditional /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingUnconditional /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnNoReply /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnNoReply /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnBusy /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnBusy /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnTime /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnTime /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnCallingLine /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnCallingLine /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_Service, _encode_Service } from "../UPT-DataModel/Service.ta";
export { Service, Service_isdnTelephony /* IMPORTED_LONG_NAMED_INTEGER */, isdnTelephony /* IMPORTED_SHORT_NAMED_INTEGER */, Service_icRegistration /* IMPORTED_LONG_NAMED_INTEGER */, icRegistration /* IMPORTED_SHORT_NAMED_INTEGER */, Service_serviceProfileModification /* IMPORTED_LONG_NAMED_INTEGER */, serviceProfileModification /* IMPORTED_SHORT_NAMED_INTEGER */, Service_standard /* IMPORTED_LONG_NAMED_INTEGER */, standard /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingUnconditional /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingUnconditional /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnNoReply /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnNoReply /* IMPORTED_SHORT_NAMED_INTEGER */, Service_callForwardingOnBusy /* IMPORTED_LONG_NAMED_INTEGER */, callForwardingOnBusy /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnTime /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnTime /* IMPORTED_SHORT_NAMED_INTEGER */, Service_variableRoutingOnCallingLine /* IMPORTED_LONG_NAMED_INTEGER */, variableRoutingOnCallingLine /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_Service, _encode_Service } from "../UPT-DataModel/Service.ta";


/* START_OF_SYMBOL_DEFINITION CFServices */
/**
 * @summary CFServices
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * CFServices  ::=  SET OF Service(40..49)
 * ```
 */
export
type CFServices = Service[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION CFServices */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CFServices */
let _cached_decoder_for_CFServices: $.ASN1Decoder<CFServices> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CFServices */

/* START_OF_SYMBOL_DEFINITION _decode_CFServices */
/**
 * @summary Decodes an ASN.1 element into a(n) CFServices
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CFServices} The decoded data structure.
 */
export
function _decode_CFServices (el: _Element) {
    if (!_cached_decoder_for_CFServices) { _cached_decoder_for_CFServices = $._decodeSetOf<Service>(() => _decode_Service); }
    return _cached_decoder_for_CFServices(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CFServices */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CFServices */
let _cached_encoder_for_CFServices: $.ASN1Encoder<CFServices> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CFServices */

/* START_OF_SYMBOL_DEFINITION _encode_CFServices */
/**
 * @summary Encodes a(n) CFServices into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CFServices, encoded as an ASN.1 Element.
 */
export
function _encode_CFServices (value: CFServices, elGetter: $.ASN1Encoder<CFServices>) {
    if (!_cached_encoder_for_CFServices) { _cached_encoder_for_CFServices = $._encodeSetOf<Service>(() => _encode_Service, $.BER); }
    return _cached_encoder_for_CFServices(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CFServices */

/* eslint-enable */
