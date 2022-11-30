/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
    OPTIONAL,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION Tokenized */
/**
 * @summary Tokenized
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Tokenized ::= SEQUENCE {
 *     name  OBJECT IDENTIFIER,
 *     parts TYPE-IDENTIFIER.&Type OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class Tokenized {
    constructor(
        /**
         * @summary `name`.
         * @public
         * @readonly
         */
        readonly name: OBJECT_IDENTIFIER,
        /**
         * @summary `parts`.
         * @public
         * @readonly
         */
        readonly parts: OPTIONAL<_Element>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a Tokenized
     * @description
     *
     * This takes an `object` and converts it to a `Tokenized`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `Tokenized`.
     * @returns {Tokenized}
     */
    public static _from_object(_o: {
        [_K in keyof Tokenized]: Tokenized[_K];
    }): Tokenized {
        return new Tokenized(_o.name, _o.parts, _o._unrecognizedExtensionsList);
    }
}
/* END_OF_SYMBOL_DEFINITION Tokenized */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Tokenized */
/**
 * @summary The Leading Root Component Types of Tokenized
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_Tokenized: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'name',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'parts',
            true,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Tokenized */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Tokenized */
/**
 * @summary The Trailing Root Component Types of Tokenized
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_Tokenized: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Tokenized */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Tokenized */
/**
 * @summary The Extension Addition Component Types of Tokenized
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_Tokenized: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Tokenized */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Tokenized */
let _cached_decoder_for_Tokenized: $.ASN1Decoder<Tokenized> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Tokenized */

/* START_OF_SYMBOL_DEFINITION _decode_Tokenized */
/**
 * @summary Decodes an ASN.1 element into a(n) Tokenized
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Tokenized} The decoded data structure.
 */
export function _decode_Tokenized(el: _Element) {
    if (!_cached_decoder_for_Tokenized) {
        _cached_decoder_for_Tokenized = function (el: _Element): Tokenized {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let name!: OBJECT_IDENTIFIER;
            let parts: OPTIONAL<_Element>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                name: (_el: _Element): void => {
                    name = $._decodeObjectIdentifier(_el);
                },
                parts: (_el: _Element): void => {
                    parts = $._decodeAny(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_Tokenized,
                _extension_additions_list_spec_for_Tokenized,
                _root_component_type_list_2_spec_for_Tokenized,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new Tokenized /* SEQUENCE_CONSTRUCTOR_CALL */(
                name,
                parts,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_Tokenized(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Tokenized */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Tokenized */
let _cached_encoder_for_Tokenized: $.ASN1Encoder<Tokenized> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Tokenized */

/* START_OF_SYMBOL_DEFINITION _encode_Tokenized */
/**
 * @summary Encodes a(n) Tokenized into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Tokenized, encoded as an ASN.1 Element.
 */
export function _encode_Tokenized(
    value: Tokenized,
    elGetter: $.ASN1Encoder<Tokenized>
) {
    if (!_cached_encoder_for_Tokenized) {
        _cached_encoder_for_Tokenized = function (
            value: Tokenized,
            elGetter: $.ASN1Encoder<Tokenized>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.name,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.parts === undefined
                                ? undefined
                                : $._encodeAny(value.parts, $.BER),
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
    return _cached_encoder_for_Tokenized(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Tokenized */

/* eslint-enable */
