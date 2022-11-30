/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    IA5String,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BootParameterSyntax */
/**
 * @summary BootParameterSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BootParameterSyntax ::= SEQUENCE {
 *     key     IA5String,
 *     server  IA5String,
 *     path    IA5String
 * }
 * ```
 *
 * @class
 */
export class BootParameterSyntax {
    constructor(
        /**
         * @summary `key`.
         * @public
         * @readonly
         */
        readonly key: IA5String,
        /**
         * @summary `server`.
         * @public
         * @readonly
         */
        readonly server: IA5String,
        /**
         * @summary `path`.
         * @public
         * @readonly
         */
        readonly path: IA5String,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a BootParameterSyntax
     * @description
     *
     * This takes an `object` and converts it to a `BootParameterSyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BootParameterSyntax`.
     * @returns {BootParameterSyntax}
     */
    public static _from_object(_o: {
        [_K in keyof BootParameterSyntax]: BootParameterSyntax[_K];
    }): BootParameterSyntax {
        return new BootParameterSyntax(
            _o.key,
            _o.server,
            _o.path,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BootParameterSyntax */
/**
 * @summary The Leading Root Component Types of BootParameterSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_BootParameterSyntax: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'key',
            false,
            $.hasTag(_TagClass.universal, 22),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'server',
            false,
            $.hasTag(_TagClass.universal, 22),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'path',
            false,
            $.hasTag(_TagClass.universal, 22),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BootParameterSyntax */
/**
 * @summary The Trailing Root Component Types of BootParameterSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_BootParameterSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BootParameterSyntax */
/**
 * @summary The Extension Addition Component Types of BootParameterSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_BootParameterSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BootParameterSyntax */
let _cached_decoder_for_BootParameterSyntax: $.ASN1Decoder<BootParameterSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_BootParameterSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) BootParameterSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BootParameterSyntax} The decoded data structure.
 */
export function _decode_BootParameterSyntax(el: _Element) {
    if (!_cached_decoder_for_BootParameterSyntax) {
        _cached_decoder_for_BootParameterSyntax = function (
            el: _Element
        ): BootParameterSyntax {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 3) {
                throw new _ConstructionError(
                    'BootParameterSyntax contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'key';
            sequence[1].name = 'server';
            sequence[2].name = 'path';
            let key!: IA5String;
            let server!: IA5String;
            let path!: IA5String;
            key = $._decodeIA5String(sequence[0]);
            server = $._decodeIA5String(sequence[1]);
            path = $._decodeIA5String(sequence[2]);
            return new BootParameterSyntax(
                key,
                server,
                path,
                sequence.slice(3)
            );
        };
    }
    return _cached_decoder_for_BootParameterSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BootParameterSyntax */
let _cached_encoder_for_BootParameterSyntax: $.ASN1Encoder<BootParameterSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BootParameterSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_BootParameterSyntax */
/**
 * @summary Encodes a(n) BootParameterSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BootParameterSyntax, encoded as an ASN.1 Element.
 */
export function _encode_BootParameterSyntax(
    value: BootParameterSyntax,
    elGetter: $.ASN1Encoder<BootParameterSyntax>
) {
    if (!_cached_encoder_for_BootParameterSyntax) {
        _cached_encoder_for_BootParameterSyntax = function (
            value: BootParameterSyntax,
            elGetter: $.ASN1Encoder<BootParameterSyntax>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeIA5String(
                                value.key,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeIA5String(
                                value.server,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeIA5String(
                                value.path,
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
    return _cached_encoder_for_BootParameterSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BootParameterSyntax */

/* eslint-enable */
