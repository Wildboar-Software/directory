/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION Service */
/**
 * @summary Service
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Service  ::=  INTEGER {
 *   --basic services 0-9
 *   isdnTelephony(0),
 *   -- registration service 10-19
 *   icRegistration(10),
 *   --profile service 20-29
 *   serviceProfileModification(20),
 *   -- charging service 30-39
 *   standard(30),
 *   -- routing service 40-49
 *   callForwardingUnconditional(40), callForwardingOnNoReply(41),
 *   callForwardingOnBusy(42), variableRoutingOnTime(43),
 *   variableRoutingOnCallingLine(44)}
 * ```
 */
export type Service = INTEGER;
/* END_OF_SYMBOL_DEFINITION Service */

/* START_OF_SYMBOL_DEFINITION Service_isdnTelephony */
/**
 * @summary Service_isdnTelephony
 * @constant
 * @type {number}
 */
export const Service_isdnTelephony: Service = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_isdnTelephony */

/* START_OF_SYMBOL_DEFINITION isdnTelephony */
/**
 * @summary Service_isdnTelephony
 * @constant
 * @type {number}
 */
export const isdnTelephony: Service =
    Service_isdnTelephony; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION isdnTelephony */

/* START_OF_SYMBOL_DEFINITION Service_icRegistration */
/**
 * @summary Service_icRegistration
 * @constant
 * @type {number}
 */
export const Service_icRegistration: Service = 10; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_icRegistration */

/* START_OF_SYMBOL_DEFINITION icRegistration */
/**
 * @summary Service_icRegistration
 * @constant
 * @type {number}
 */
export const icRegistration: Service =
    Service_icRegistration; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION icRegistration */

/* START_OF_SYMBOL_DEFINITION Service_serviceProfileModification */
/**
 * @summary Service_serviceProfileModification
 * @constant
 * @type {number}
 */
export const Service_serviceProfileModification: Service = 20; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_serviceProfileModification */

/* START_OF_SYMBOL_DEFINITION serviceProfileModification */
/**
 * @summary Service_serviceProfileModification
 * @constant
 * @type {number}
 */
export const serviceProfileModification: Service =
    Service_serviceProfileModification; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION serviceProfileModification */

/* START_OF_SYMBOL_DEFINITION Service_standard */
/**
 * @summary Service_standard
 * @constant
 * @type {number}
 */
export const Service_standard: Service = 30; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_standard */

/* START_OF_SYMBOL_DEFINITION standard */
/**
 * @summary Service_standard
 * @constant
 * @type {number}
 */
export const standard: Service =
    Service_standard; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION standard */

/* START_OF_SYMBOL_DEFINITION Service_callForwardingUnconditional */
/**
 * @summary Service_callForwardingUnconditional
 * @constant
 * @type {number}
 */
export const Service_callForwardingUnconditional: Service = 40; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_callForwardingUnconditional */

/* START_OF_SYMBOL_DEFINITION callForwardingUnconditional */
/**
 * @summary Service_callForwardingUnconditional
 * @constant
 * @type {number}
 */
export const callForwardingUnconditional: Service =
    Service_callForwardingUnconditional; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION callForwardingUnconditional */

/* START_OF_SYMBOL_DEFINITION Service_callForwardingOnNoReply */
/**
 * @summary Service_callForwardingOnNoReply
 * @constant
 * @type {number}
 */
export const Service_callForwardingOnNoReply: Service = 41; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_callForwardingOnNoReply */

/* START_OF_SYMBOL_DEFINITION callForwardingOnNoReply */
/**
 * @summary Service_callForwardingOnNoReply
 * @constant
 * @type {number}
 */
export const callForwardingOnNoReply: Service =
    Service_callForwardingOnNoReply; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION callForwardingOnNoReply */

/* START_OF_SYMBOL_DEFINITION Service_callForwardingOnBusy */
/**
 * @summary Service_callForwardingOnBusy
 * @constant
 * @type {number}
 */
export const Service_callForwardingOnBusy: Service = 42; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_callForwardingOnBusy */

/* START_OF_SYMBOL_DEFINITION callForwardingOnBusy */
/**
 * @summary Service_callForwardingOnBusy
 * @constant
 * @type {number}
 */
export const callForwardingOnBusy: Service =
    Service_callForwardingOnBusy; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION callForwardingOnBusy */

/* START_OF_SYMBOL_DEFINITION Service_variableRoutingOnTime */
/**
 * @summary Service_variableRoutingOnTime
 * @constant
 * @type {number}
 */
export const Service_variableRoutingOnTime: Service = 43; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_variableRoutingOnTime */

/* START_OF_SYMBOL_DEFINITION variableRoutingOnTime */
/**
 * @summary Service_variableRoutingOnTime
 * @constant
 * @type {number}
 */
export const variableRoutingOnTime: Service =
    Service_variableRoutingOnTime; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION variableRoutingOnTime */

/* START_OF_SYMBOL_DEFINITION Service_variableRoutingOnCallingLine */
/**
 * @summary Service_variableRoutingOnCallingLine
 * @constant
 * @type {number}
 */
export const Service_variableRoutingOnCallingLine: Service = 44; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION Service_variableRoutingOnCallingLine */

/* START_OF_SYMBOL_DEFINITION variableRoutingOnCallingLine */
/**
 * @summary Service_variableRoutingOnCallingLine
 * @constant
 * @type {number}
 */
export const variableRoutingOnCallingLine: Service =
    Service_variableRoutingOnCallingLine; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION variableRoutingOnCallingLine */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Service */
let _cached_decoder_for_Service: $.ASN1Decoder<Service> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Service */

/* START_OF_SYMBOL_DEFINITION _decode_Service */
/**
 * @summary Decodes an ASN.1 element into a(n) Service
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Service} The decoded data structure.
 */
export function _decode_Service(el: _Element) {
    if (!_cached_decoder_for_Service) {
        _cached_decoder_for_Service = $._decodeInteger;
    }
    return _cached_decoder_for_Service(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Service */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Service */
let _cached_encoder_for_Service: $.ASN1Encoder<Service> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Service */

/* START_OF_SYMBOL_DEFINITION _encode_Service */
/**
 * @summary Encodes a(n) Service into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Service, encoded as an ASN.1 Element.
 */
export function _encode_Service(
    value: Service,
    elGetter: $.ASN1Encoder<Service>
) {
    if (!_cached_encoder_for_Service) {
        _cached_encoder_for_Service = $._encodeInteger;
    }
    return _cached_encoder_for_Service(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Service */

/* eslint-enable */
