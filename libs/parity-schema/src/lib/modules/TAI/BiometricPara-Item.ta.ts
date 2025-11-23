/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    BIT_STRING,
    INTEGER,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BiometricPara_Item */
/**
 * @summary BiometricPara_Item
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricPara-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 *
 * @class
 */
export class BiometricPara_Item {
    constructor(
        /**
         * @summary `biometricType`.
         * @public
         * @readonly
         */
        readonly biometricType: BIT_STRING,
        /**
         * @summary `fMR_Value`.
         * @public
         * @readonly
         */
        readonly fMR_Value: INTEGER,
        /**
         * @summary `trialNumber`.
         * @public
         * @readonly
         */
        readonly trialNumber: OPTIONAL<INTEGER>,
        /**
         * @summary `requestQuality`.
         * @public
         * @readonly
         */
        readonly requestQuality: OPTIONAL<INTEGER>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a BiometricPara_Item
     * @description
     *
     * This takes an `object` and converts it to a `BiometricPara_Item`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BiometricPara_Item`.
     * @returns {BiometricPara_Item}
     */
    public static _from_object(_o: {
        [_K in keyof BiometricPara_Item]: BiometricPara_Item[_K];
    }): BiometricPara_Item {
        return new BiometricPara_Item(
            _o.biometricType,
            _o.fMR_Value,
            _o.trialNumber,
            _o.requestQuality,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricPara_Item */
/**
 * @summary The Leading Root Component Types of BiometricPara_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_BiometricPara_Item: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'biometricType',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'fMR-Value',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'trialNumber',
            true,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'requestQuality',
            true,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricPara_Item */
/**
 * @summary The Trailing Root Component Types of BiometricPara_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_BiometricPara_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricPara_Item */
/**
 * @summary The Extension Addition Component Types of BiometricPara_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_BiometricPara_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara_Item */
let _cached_decoder_for_BiometricPara_Item: $.ASN1Decoder<BiometricPara_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPara_Item */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPara_Item
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPara_Item} The decoded data structure.
 */
export function _decode_BiometricPara_Item(el: _Element) {
    if (!_cached_decoder_for_BiometricPara_Item) {
        _cached_decoder_for_BiometricPara_Item = function (
            el: _Element
        ): BiometricPara_Item {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let biometricType!: BIT_STRING;
            let fMR_Value!: INTEGER;
            let trialNumber: OPTIONAL<INTEGER>;
            let requestQuality: OPTIONAL<INTEGER>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                biometricType: (_el: _Element): void => {
                    biometricType = $._decodeBitString(_el);
                },
                'fMR-Value': (_el: _Element): void => {
                    fMR_Value = $._decodeInteger(_el);
                },
                trialNumber: (_el: _Element): void => {
                    trialNumber = $._decodeInteger(_el);
                },
                requestQuality: (_el: _Element): void => {
                    requestQuality = $._decodeInteger(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_BiometricPara_Item,
                _extension_additions_list_spec_for_BiometricPara_Item,
                _root_component_type_list_2_spec_for_BiometricPara_Item,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new BiometricPara_Item /* SEQUENCE_CONSTRUCTOR_CALL */(
                biometricType,
                fMR_Value,
                trialNumber,
                requestQuality,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_BiometricPara_Item(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara_Item */
let _cached_encoder_for_BiometricPara_Item: $.ASN1Encoder<BiometricPara_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara_Item */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPara_Item */
/**
 * @summary Encodes a(n) BiometricPara_Item into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPara_Item, encoded as an ASN.1 Element.
 */
export function _encode_BiometricPara_Item(
    value: BiometricPara_Item,
    elGetter: $.ASN1Encoder<BiometricPara_Item>
) {
    if (!_cached_encoder_for_BiometricPara_Item) {
        _cached_encoder_for_BiometricPara_Item = function (
            value: BiometricPara_Item,
            elGetter: $.ASN1Encoder<BiometricPara_Item>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeBitString(
                                value.biometricType,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeInteger(
                                value.fMR_Value,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.trialNumber === undefined
                                ? undefined
                                : $._encodeInteger(value.trialNumber, $.BER),
                            /* IF_ABSENT  */ value.requestQuality === undefined
                                ? undefined
                                : $._encodeInteger(value.requestQuality, $.BER),
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
    return _cached_encoder_for_BiometricPara_Item(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPara_Item */

/* eslint-enable */
