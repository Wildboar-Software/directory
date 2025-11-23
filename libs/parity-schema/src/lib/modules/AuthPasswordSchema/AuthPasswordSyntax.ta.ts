/* eslint-disable */
import {
    AlgorithmIdentifier,
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
    PlaintextPasswordSyntax,
    _decode_PlaintextPasswordSyntax,
    _encode_PlaintextPasswordSyntax,
} from '../AuthPasswordSchema/PlaintextPasswordSyntax.ta';

/* START_OF_SYMBOL_DEFINITION AuthPasswordSyntax */
/**
 * @summary AuthPasswordSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AuthPasswordSyntax ::= SEQUENCE {
 *     algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
 *     hashValue            PlaintextPasswordSyntax,
 *     ...
 * }
 * ```
 *
 * @class
 */
export class AuthPasswordSyntax {
    constructor(
        /**
         * @summary `algorithmIdentifier`.
         * @public
         * @readonly
         */
        readonly algorithmIdentifier: AlgorithmIdentifier,
        /**
         * @summary `hashValue`.
         * @public
         * @readonly
         */
        readonly hashValue: PlaintextPasswordSyntax,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a AuthPasswordSyntax
     * @description
     *
     * This takes an `object` and converts it to a `AuthPasswordSyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `AuthPasswordSyntax`.
     * @returns {AuthPasswordSyntax}
     */
    public static _from_object(_o: {
        [_K in keyof AuthPasswordSyntax]: AuthPasswordSyntax[_K];
    }): AuthPasswordSyntax {
        return new AuthPasswordSyntax(
            _o.algorithmIdentifier,
            _o.hashValue,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AuthPasswordSyntax */
/**
 * @summary The Leading Root Component Types of AuthPasswordSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_AuthPasswordSyntax: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'algorithmIdentifier',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'hashValue',
            false,
            $.hasTag(_TagClass.universal, 4),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AuthPasswordSyntax */
/**
 * @summary The Trailing Root Component Types of AuthPasswordSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_AuthPasswordSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AuthPasswordSyntax */
/**
 * @summary The Extension Addition Component Types of AuthPasswordSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_AuthPasswordSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AuthPasswordSyntax */
let _cached_decoder_for_AuthPasswordSyntax: $.ASN1Decoder<AuthPasswordSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_AuthPasswordSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) AuthPasswordSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AuthPasswordSyntax} The decoded data structure.
 */
export function _decode_AuthPasswordSyntax(el: _Element) {
    if (!_cached_decoder_for_AuthPasswordSyntax) {
        _cached_decoder_for_AuthPasswordSyntax = function (
            el: _Element
        ): AuthPasswordSyntax {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'AuthPasswordSyntax contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'algorithmIdentifier';
            sequence[1].name = 'hashValue';
            let algorithmIdentifier!: AlgorithmIdentifier;
            let hashValue!: PlaintextPasswordSyntax;
            algorithmIdentifier = _decode_AlgorithmIdentifier(sequence[0]);
            hashValue = _decode_PlaintextPasswordSyntax(sequence[1]);
            return new AuthPasswordSyntax(
                algorithmIdentifier,
                hashValue,
                sequence.slice(2)
            );
        };
    }
    return _cached_decoder_for_AuthPasswordSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AuthPasswordSyntax */
let _cached_encoder_for_AuthPasswordSyntax: $.ASN1Encoder<AuthPasswordSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AuthPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_AuthPasswordSyntax */
/**
 * @summary Encodes a(n) AuthPasswordSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AuthPasswordSyntax, encoded as an ASN.1 Element.
 */
export function _encode_AuthPasswordSyntax(
    value: AuthPasswordSyntax,
    elGetter: $.ASN1Encoder<AuthPasswordSyntax>
) {
    if (!_cached_encoder_for_AuthPasswordSyntax) {
        _cached_encoder_for_AuthPasswordSyntax = function (
            value: AuthPasswordSyntax,
            elGetter: $.ASN1Encoder<AuthPasswordSyntax>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_AlgorithmIdentifier(
                                value.algorithmIdentifier,
                                $.BER
                            ),
                            /* REQUIRED   */ _encode_PlaintextPasswordSyntax(
                                value.hashValue,
                                $.BER
                            ),
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
    return _cached_encoder_for_AuthPasswordSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AuthPasswordSyntax */

/* eslint-enable */
