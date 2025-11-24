/* eslint-disable */
import {
    type AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    PBKDF2_params_salt,
    _decode_PBKDF2_params_salt,
    _encode_PBKDF2_params_salt,
} from '../OtherAttributes/PBKDF2-params-salt.ta';

/* START_OF_SYMBOL_DEFINITION PBKDF2_params */
/**
 * @summary PBKDF2_params
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PBKDF2-params ::= SEQUENCE {
 *   salt CHOICE {
 *     specified   OCTET STRING,
 *     otherSource AlgorithmIdentifier{{SupportedAlgorithms}},
 *     ... },
 *   iterationCount INTEGER (1..MAX),
 *   keyLength      INTEGER (1..MAX) OPTIONAL,
 *   prf            AlgorithmIdentifier{{SupportedAlgorithms}},
 *   ... }
 * ```
 *
 * @class
 */
export class PBKDF2_params {
    constructor(
        /**
         * @summary `salt`.
         * @public
         * @readonly
         */
        readonly salt: PBKDF2_params_salt,
        /**
         * @summary `iterationCount`.
         * @public
         * @readonly
         */
        readonly iterationCount: INTEGER,
        /**
         * @summary `keyLength`.
         * @public
         * @readonly
         */
        readonly keyLength: OPTIONAL<INTEGER>,
        /**
         * @summary `prf`.
         * @public
         * @readonly
         */
        readonly prf: AlgorithmIdentifier,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a PBKDF2_params
     * @description
     *
     * This takes an `object` and converts it to a `PBKDF2_params`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PBKDF2_params`.
     * @returns {PBKDF2_params}
     */
    public static _from_object(_o: {
        [_K in keyof PBKDF2_params]: PBKDF2_params[_K];
    }): PBKDF2_params {
        return new PBKDF2_params(
            _o.salt,
            _o.iterationCount,
            _o.keyLength,
            _o.prf,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PBKDF2_params */
/**
 * @summary The Leading Root Component Types of PBKDF2_params
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_PBKDF2_params: $.ComponentSpec[] =
    [
        new $.ComponentSpec('salt', false, $.hasAnyTag, undefined, undefined),
        new $.ComponentSpec(
            'iterationCount',
            false,
            $.hasTag(_TagClass.universal, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'keyLength',
            true,
            $.hasTag(_TagClass.universal, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'prf',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PBKDF2_params */
/**
 * @summary The Trailing Root Component Types of PBKDF2_params
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_PBKDF2_params: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PBKDF2_params */
/**
 * @summary The Extension Addition Component Types of PBKDF2_params
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_PBKDF2_params: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PBKDF2_params */
let _cached_decoder_for_PBKDF2_params: $.ASN1Decoder<PBKDF2_params> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _decode_PBKDF2_params */
/**
 * @summary Decodes an ASN.1 element into a(n) PBKDF2_params
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PBKDF2_params} The decoded data structure.
 */
export function _decode_PBKDF2_params(el: _Element) {
    if (!_cached_decoder_for_PBKDF2_params) {
        _cached_decoder_for_PBKDF2_params = function (
            el: _Element
        ): PBKDF2_params {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let salt!: PBKDF2_params_salt;
            let iterationCount!: INTEGER;
            let keyLength: OPTIONAL<INTEGER>;
            let prf!: AlgorithmIdentifier;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                salt: (_el: _Element): void => {
                    salt = _decode_PBKDF2_params_salt(_el);
                },
                iterationCount: (_el: _Element): void => {
                    iterationCount = $._decodeInteger(_el);
                },
                keyLength: (_el: _Element): void => {
                    keyLength = $._decodeInteger(_el);
                },
                prf: (_el: _Element): void => {
                    prf = _decode_AlgorithmIdentifier(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_PBKDF2_params,
                _extension_additions_list_spec_for_PBKDF2_params,
                _root_component_type_list_2_spec_for_PBKDF2_params,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new PBKDF2_params /* SEQUENCE_CONSTRUCTOR_CALL */(
                salt,
                iterationCount,
                keyLength,
                prf,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_PBKDF2_params(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PBKDF2_params */
let _cached_encoder_for_PBKDF2_params: $.ASN1Encoder<PBKDF2_params> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PBKDF2_params */

/* START_OF_SYMBOL_DEFINITION _encode_PBKDF2_params */
/**
 * @summary Encodes a(n) PBKDF2_params into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PBKDF2_params, encoded as an ASN.1 Element.
 */
export function _encode_PBKDF2_params(
    value: PBKDF2_params,
    elGetter: $.ASN1Encoder<PBKDF2_params>
) {
    if (!_cached_encoder_for_PBKDF2_params) {
        _cached_encoder_for_PBKDF2_params = function (
            value: PBKDF2_params,
            elGetter: $.ASN1Encoder<PBKDF2_params>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_PBKDF2_params_salt(
                                value.salt,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeInteger(
                                value.iterationCount,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.keyLength === undefined
                                ? undefined
                                : $._encodeInteger(value.keyLength, $.BER),
                            /* REQUIRED   */ _encode_AlgorithmIdentifier(
                                value.prf,
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
    return _cached_encoder_for_PBKDF2_params(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PBKDF2_params */

/* eslint-enable */
