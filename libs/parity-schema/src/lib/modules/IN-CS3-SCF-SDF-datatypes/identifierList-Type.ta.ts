/* eslint-disable */
import {
    type AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    MethodIdentifier,
    _decode_MethodIdentifier,
    _encode_MethodIdentifier,
} from '../IN-CS3-SCF-SDF-datatypes/MethodIdentifier.ta';

export {
    MethodIdentifier,
    _decode_MethodIdentifier,
    _encode_MethodIdentifier,
} from '../IN-CS3-SCF-SDF-datatypes/MethodIdentifier.ta';

/* START_OF_SYMBOL_DEFINITION identifierList_Type */
/**
 * @summary identifierList_Type
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * identifierList-Type ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 *
 * @class
 */
export class identifierList_Type {
    constructor(
        /**
         * @summary `conformMethodIdentifier`.
         * @public
         * @readonly
         */
        readonly conformMethodIdentifier: MethodIdentifier,
        /**
         * @summary `fillMethodIdentifier`.
         * @public
         * @readonly
         */
        readonly fillMethodIdentifier: MethodIdentifier,
        /**
         * @summary `oneToOneAlgorithm`.
         * @public
         * @readonly
         */
        readonly oneToOneAlgorithm: AlgorithmIdentifier,
        /**
         * @summary `oneToTwoAlgorithm`.
         * @public
         * @readonly
         */
        readonly oneToTwoAlgorithm: AlgorithmIdentifier
    ) {}

    /**
     * @summary Restructures an object into a identifierList_Type
     * @description
     *
     * This takes an `object` and converts it to a `identifierList_Type`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `identifierList_Type`.
     * @returns {identifierList_Type}
     */
    public static _from_object(_o: {
        [_K in keyof identifierList_Type]: identifierList_Type[_K];
    }): identifierList_Type {
        return new identifierList_Type(
            _o.conformMethodIdentifier,
            _o.fillMethodIdentifier,
            _o.oneToOneAlgorithm,
            _o.oneToTwoAlgorithm
        );
    }
}
/* END_OF_SYMBOL_DEFINITION identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_identifierList_Type */
/**
 * @summary The Leading Root Component Types of identifierList_Type
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_identifierList_Type: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'conformMethodIdentifier',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'fillMethodIdentifier',
            false,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'oneToOneAlgorithm',
            false,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'oneToTwoAlgorithm',
            false,
            $.hasTag(_TagClass.context, 4),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_identifierList_Type */
/**
 * @summary The Trailing Root Component Types of identifierList_Type
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_identifierList_Type: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_identifierList_Type */
/**
 * @summary The Extension Addition Component Types of identifierList_Type
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_identifierList_Type: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_identifierList_Type */
let _cached_decoder_for_identifierList_Type: $.ASN1Decoder<identifierList_Type> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _decode_identifierList_Type */
/**
 * @summary Decodes an ASN.1 element into a(n) identifierList_Type
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {identifierList_Type} The decoded data structure.
 */
export function _decode_identifierList_Type(el: _Element) {
    if (!_cached_decoder_for_identifierList_Type) {
        _cached_decoder_for_identifierList_Type = function (
            el: _Element
        ): identifierList_Type {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 4) {
                throw new _ConstructionError(
                    'identifierList-Type contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'conformMethodIdentifier';
            sequence[1].name = 'fillMethodIdentifier';
            sequence[2].name = 'oneToOneAlgorithm';
            sequence[3].name = 'oneToTwoAlgorithm';
            let conformMethodIdentifier!: MethodIdentifier;
            let fillMethodIdentifier!: MethodIdentifier;
            let oneToOneAlgorithm!: AlgorithmIdentifier;
            let oneToTwoAlgorithm!: AlgorithmIdentifier;
            conformMethodIdentifier = $._decode_explicit<MethodIdentifier>(
                () => _decode_MethodIdentifier
            )(sequence[0]);
            fillMethodIdentifier = $._decode_explicit<MethodIdentifier>(
                () => _decode_MethodIdentifier
            )(sequence[1]);
            oneToOneAlgorithm = $._decode_explicit<AlgorithmIdentifier>(
                () => _decode_AlgorithmIdentifier
            )(sequence[2]);
            oneToTwoAlgorithm = $._decode_explicit<AlgorithmIdentifier>(
                () => _decode_AlgorithmIdentifier
            )(sequence[3]);
            return new identifierList_Type(
                conformMethodIdentifier,
                fillMethodIdentifier,
                oneToOneAlgorithm,
                oneToTwoAlgorithm
            );
        };
    }
    return _cached_decoder_for_identifierList_Type(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_identifierList_Type */
let _cached_encoder_for_identifierList_Type: $.ASN1Encoder<identifierList_Type> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_identifierList_Type */

/* START_OF_SYMBOL_DEFINITION _encode_identifierList_Type */
/**
 * @summary Encodes a(n) identifierList_Type into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The identifierList_Type, encoded as an ASN.1 Element.
 */
export function _encode_identifierList_Type(
    value: identifierList_Type,
    elGetter: $.ASN1Encoder<identifierList_Type>
) {
    if (!_cached_encoder_for_identifierList_Type) {
        _cached_encoder_for_identifierList_Type = function (
            value: identifierList_Type,
            elGetter: $.ASN1Encoder<identifierList_Type>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            1,
                            () => _encode_MethodIdentifier,
                            $.BER
                        )(value.conformMethodIdentifier, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            2,
                            () => _encode_MethodIdentifier,
                            $.BER
                        )(value.fillMethodIdentifier, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            3,
                            () => _encode_AlgorithmIdentifier,
                            $.BER
                        )(value.oneToOneAlgorithm, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            4,
                            () => _encode_AlgorithmIdentifier,
                            $.BER
                        )(value.oneToTwoAlgorithm, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_identifierList_Type(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_identifierList_Type */

/* eslint-enable */
