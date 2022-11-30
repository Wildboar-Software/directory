/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    Service,
    _decode_Service,
    _encode_Service,
} from '../UPT-DataModel/Service.ta';

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
export type CFServices = Service[]; // SetOfType
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
export function _decode_CFServices(el: _Element) {
    if (!_cached_decoder_for_CFServices) {
        _cached_decoder_for_CFServices = $._decodeSetOf<Service>(
            () => _decode_Service
        );
    }
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
export function _encode_CFServices(
    value: CFServices,
    elGetter: $.ASN1Encoder<CFServices>
) {
    if (!_cached_encoder_for_CFServices) {
        _cached_encoder_for_CFServices = $._encodeSetOf<Service>(
            () => _encode_Service,
            $.BER
        );
    }
    return _cached_encoder_for_CFServices(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CFServices */

/* eslint-enable */
