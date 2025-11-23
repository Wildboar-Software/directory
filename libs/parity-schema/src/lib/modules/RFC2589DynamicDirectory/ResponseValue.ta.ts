/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ResponseValue */
/**
 * @summary ResponseValue
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ResponseValue ::= SEQUENCE {
 *     responseTtl [1] INTEGER,
 *     ...
 * }
 * ```
 *
 * @class
 */
export class ResponseValue {
    constructor(
        /**
         * @summary `responseTtl`.
         * @public
         * @readonly
         */
        readonly responseTtl: INTEGER,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a ResponseValue
     * @description
     *
     * This takes an `object` and converts it to a `ResponseValue`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ResponseValue`.
     * @returns {ResponseValue}
     */
    public static _from_object(_o: {
        [_K in keyof ResponseValue]: ResponseValue[_K];
    }): ResponseValue {
        return new ResponseValue(
            _o.responseTtl,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION ResponseValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ResponseValue */
/**
 * @summary The Leading Root Component Types of ResponseValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ResponseValue: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'responseTtl',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ResponseValue */
/**
 * @summary The Trailing Root Component Types of ResponseValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ResponseValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ResponseValue */
/**
 * @summary The Extension Addition Component Types of ResponseValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ResponseValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ResponseValue */
let _cached_decoder_for_ResponseValue: $.ASN1Decoder<ResponseValue> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _decode_ResponseValue */
/**
 * @summary Decodes an ASN.1 element into a(n) ResponseValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ResponseValue} The decoded data structure.
 */
export function _decode_ResponseValue(el: _Element) {
    if (!_cached_decoder_for_ResponseValue) {
        _cached_decoder_for_ResponseValue = function (
            el: _Element
        ): ResponseValue {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 1) {
                throw new _ConstructionError(
                    'ResponseValue contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'responseTtl';
            let responseTtl!: INTEGER;
            responseTtl = $._decode_explicit<INTEGER>(() => $._decodeInteger)(
                sequence[0]
            );
            return new ResponseValue(responseTtl, sequence.slice(1));
        };
    }
    return _cached_decoder_for_ResponseValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ResponseValue */
let _cached_encoder_for_ResponseValue: $.ASN1Encoder<ResponseValue> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ResponseValue */

/* START_OF_SYMBOL_DEFINITION _encode_ResponseValue */
/**
 * @summary Encodes a(n) ResponseValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ResponseValue, encoded as an ASN.1 Element.
 */
export function _encode_ResponseValue(
    value: ResponseValue,
    elGetter: $.ASN1Encoder<ResponseValue>
) {
    if (!_cached_encoder_for_ResponseValue) {
        _cached_encoder_for_ResponseValue = function (
            value: ResponseValue,
            elGetter: $.ASN1Encoder<ResponseValue>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encode_explicit(
                                _TagClass.context,
                                1,
                                () => $._encodeInteger,
                                $.BER
                            )(value.responseTtl, $.BER),
                        ],
                        value._unrecognizedExtensionsList
                            ? value._unrecognizedExtensionsList
                            : []
                    )
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_ResponseValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ResponseValue */

/* eslint-enable */
