/* eslint-disable */
import { ASN1Element as _Element, BIT_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION SupplServiceStatus */
/**
 * @summary SupplServiceStatus
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SupplServiceStatus  ::=  BIT STRING {provisioned(0), registered(1), activated(2)}
 * ```
 */
export type SupplServiceStatus = BIT_STRING;
/* END_OF_SYMBOL_DEFINITION SupplServiceStatus */

/* START_OF_SYMBOL_DEFINITION SupplServiceStatus_provisioned */
/**
 * @summary SupplServiceStatus_provisioned
 * @constant
 */
export const SupplServiceStatus_provisioned: number = 0; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SupplServiceStatus_provisioned */

/* START_OF_SYMBOL_DEFINITION provisioned */
/**
 * @summary provisioned
 * @constant
 */
export const provisioned: number =
    SupplServiceStatus_provisioned; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION provisioned */

/* START_OF_SYMBOL_DEFINITION SupplServiceStatus_registered */
/**
 * @summary SupplServiceStatus_registered
 * @constant
 */
export const SupplServiceStatus_registered: number = 1; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SupplServiceStatus_registered */

/* START_OF_SYMBOL_DEFINITION registered */
/**
 * @summary registered
 * @constant
 */
export const registered: number =
    SupplServiceStatus_registered; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION registered */

/* START_OF_SYMBOL_DEFINITION SupplServiceStatus_activated */
/**
 * @summary SupplServiceStatus_activated
 * @constant
 */
export const SupplServiceStatus_activated: number = 2; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION SupplServiceStatus_activated */

/* START_OF_SYMBOL_DEFINITION activated */
/**
 * @summary activated
 * @constant
 */
export const activated: number =
    SupplServiceStatus_activated; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION activated */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SupplServiceStatus */
let _cached_decoder_for_SupplServiceStatus: $.ASN1Decoder<SupplServiceStatus> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SupplServiceStatus */

/* START_OF_SYMBOL_DEFINITION _decode_SupplServiceStatus */
/**
 * @summary Decodes an ASN.1 element into a(n) SupplServiceStatus
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SupplServiceStatus} The decoded data structure.
 */
export function _decode_SupplServiceStatus(el: _Element) {
    if (!_cached_decoder_for_SupplServiceStatus) {
        _cached_decoder_for_SupplServiceStatus = $._decodeBitString;
    }
    return _cached_decoder_for_SupplServiceStatus(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SupplServiceStatus */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SupplServiceStatus */
let _cached_encoder_for_SupplServiceStatus: $.ASN1Encoder<SupplServiceStatus> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SupplServiceStatus */

/* START_OF_SYMBOL_DEFINITION _encode_SupplServiceStatus */
/**
 * @summary Encodes a(n) SupplServiceStatus into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SupplServiceStatus, encoded as an ASN.1 Element.
 */
export function _encode_SupplServiceStatus(
    value: SupplServiceStatus,
    elGetter: $.ASN1Encoder<SupplServiceStatus>
) {
    if (!_cached_encoder_for_SupplServiceStatus) {
        _cached_encoder_for_SupplServiceStatus = $._encodeBitString;
    }
    return _cached_encoder_for_SupplServiceStatus(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SupplServiceStatus */

/* eslint-enable */
