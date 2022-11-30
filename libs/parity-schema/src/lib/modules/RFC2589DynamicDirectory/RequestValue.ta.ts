/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    OCTET_STRING,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION RequestValue */
/**
 * @summary RequestValue
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * RequestValue ::= SEQUENCE {
 *     entryName  [0] LDAPDN,
 *     requestTtl [1] INTEGER,
 *     ...
 * }
 * ```
 *
 * @class
 */
export class RequestValue {
    constructor(
        /**
         * @summary `entryName`.
         * @public
         * @readonly
         */
        readonly entryName: OCTET_STRING,
        /**
         * @summary `requestTtl`.
         * @public
         * @readonly
         */
        readonly requestTtl: INTEGER,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a RequestValue
     * @description
     *
     * This takes an `object` and converts it to a `RequestValue`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `RequestValue`.
     * @returns {RequestValue}
     */
    public static _from_object(_o: {
        [_K in keyof RequestValue]: RequestValue[_K];
    }): RequestValue {
        return new RequestValue(
            _o.entryName,
            _o.requestTtl,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION RequestValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_RequestValue */
/**
 * @summary The Leading Root Component Types of RequestValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_RequestValue: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'entryName',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'requestTtl',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_RequestValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_RequestValue */
/**
 * @summary The Trailing Root Component Types of RequestValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_RequestValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_RequestValue */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_RequestValue */
/**
 * @summary The Extension Addition Component Types of RequestValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_RequestValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_RequestValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_RequestValue */
let _cached_decoder_for_RequestValue: $.ASN1Decoder<RequestValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_RequestValue */

/* START_OF_SYMBOL_DEFINITION _decode_RequestValue */
/**
 * @summary Decodes an ASN.1 element into a(n) RequestValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {RequestValue} The decoded data structure.
 */
export function _decode_RequestValue(el: _Element) {
    if (!_cached_decoder_for_RequestValue) {
        _cached_decoder_for_RequestValue = function (
            el: _Element
        ): RequestValue {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'RequestValue contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'entryName';
            sequence[1].name = 'requestTtl';
            let entryName!: OCTET_STRING;
            let requestTtl!: INTEGER;
            entryName = $._decode_explicit<OCTET_STRING>(
                () => $._decodeOctetString
            )(sequence[0]);
            requestTtl = $._decode_explicit<INTEGER>(() => $._decodeInteger)(
                sequence[1]
            );
            return new RequestValue(entryName, requestTtl, sequence.slice(2));
        };
    }
    return _cached_decoder_for_RequestValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_RequestValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_RequestValue */
let _cached_encoder_for_RequestValue: $.ASN1Encoder<RequestValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_RequestValue */

/* START_OF_SYMBOL_DEFINITION _encode_RequestValue */
/**
 * @summary Encodes a(n) RequestValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The RequestValue, encoded as an ASN.1 Element.
 */
export function _encode_RequestValue(
    value: RequestValue,
    elGetter: $.ASN1Encoder<RequestValue>
) {
    if (!_cached_encoder_for_RequestValue) {
        _cached_encoder_for_RequestValue = function (
            value: RequestValue,
            elGetter: $.ASN1Encoder<RequestValue>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encode_explicit(
                                _TagClass.context,
                                0,
                                () => $._encodeOctetString,
                                $.BER
                            )(value.entryName, $.BER),
                            /* REQUIRED   */ $._encode_explicit(
                                _TagClass.context,
                                1,
                                () => $._encodeInteger,
                                $.BER
                            )(value.requestTtl, $.BER),
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
    return _cached_encoder_for_RequestValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_RequestValue */

/* eslint-enable */
