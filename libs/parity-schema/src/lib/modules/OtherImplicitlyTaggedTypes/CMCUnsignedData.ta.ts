/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    BodyPartPath,
    _decode_BodyPartPath,
    _encode_BodyPartPath,
} from '../OtherImplicitlyTaggedTypes/BodyPartPath.ta';

/* START_OF_SYMBOL_DEFINITION CMCUnsignedData */
/**
 * @summary CMCUnsignedData
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CMCUnsignedData ::= SEQUENCE {
 *     bodyPartPath        BodyPartPath,
 *     identifier          TYPE-IDENTIFIER.&id,
 *     content             TYPE-IDENTIFIER.&Type }
 * ```
 *
 * @class
 */
export class CMCUnsignedData {
    constructor(
        /**
         * @summary `bodyPartPath`.
         * @public
         * @readonly
         */
        readonly bodyPartPath: BodyPartPath,
        /**
         * @summary `identifier`.
         * @public
         * @readonly
         */
        readonly identifier: OBJECT_IDENTIFIER,
        /**
         * @summary `content`.
         * @public
         * @readonly
         */
        readonly content: _Element,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a CMCUnsignedData
     * @description
     *
     * This takes an `object` and converts it to a `CMCUnsignedData`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CMCUnsignedData`.
     * @returns {CMCUnsignedData}
     */
    public static _from_object(_o: {
        [_K in keyof CMCUnsignedData]: CMCUnsignedData[_K];
    }): CMCUnsignedData {
        return new CMCUnsignedData(
            _o.bodyPartPath,
            _o.identifier,
            _o.content,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CMCUnsignedData */
/**
 * @summary The Leading Root Component Types of CMCUnsignedData
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_CMCUnsignedData: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'bodyPartPath',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'identifier',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'content',
            false,
            $.hasAnyTag,
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CMCUnsignedData */
/**
 * @summary The Trailing Root Component Types of CMCUnsignedData
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_CMCUnsignedData: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CMCUnsignedData */
/**
 * @summary The Extension Addition Component Types of CMCUnsignedData
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_CMCUnsignedData: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CMCUnsignedData */
let _cached_decoder_for_CMCUnsignedData: $.ASN1Decoder<CMCUnsignedData> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _decode_CMCUnsignedData */
/**
 * @summary Decodes an ASN.1 element into a(n) CMCUnsignedData
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CMCUnsignedData} The decoded data structure.
 */
export function _decode_CMCUnsignedData(el: _Element) {
    if (!_cached_decoder_for_CMCUnsignedData) {
        _cached_decoder_for_CMCUnsignedData = function (
            el: _Element
        ): CMCUnsignedData {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 3) {
                throw new _ConstructionError(
                    'CMCUnsignedData contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'bodyPartPath';
            sequence[1].name = 'identifier';
            sequence[2].name = 'content';
            let bodyPartPath!: BodyPartPath;
            let identifier!: OBJECT_IDENTIFIER;
            let content!: _Element;
            bodyPartPath = _decode_BodyPartPath(sequence[0]);
            identifier = $._decodeObjectIdentifier(sequence[1]);
            content = $._decodeAny(sequence[2]);
            return new CMCUnsignedData(
                bodyPartPath,
                identifier,
                content,
                sequence.slice(3)
            );
        };
    }
    return _cached_decoder_for_CMCUnsignedData(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CMCUnsignedData */
let _cached_encoder_for_CMCUnsignedData: $.ASN1Encoder<CMCUnsignedData> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CMCUnsignedData */

/* START_OF_SYMBOL_DEFINITION _encode_CMCUnsignedData */
/**
 * @summary Encodes a(n) CMCUnsignedData into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CMCUnsignedData, encoded as an ASN.1 Element.
 */
export function _encode_CMCUnsignedData(
    value: CMCUnsignedData,
    elGetter: $.ASN1Encoder<CMCUnsignedData>
) {
    if (!_cached_encoder_for_CMCUnsignedData) {
        _cached_encoder_for_CMCUnsignedData = function (
            value: CMCUnsignedData,
            elGetter: $.ASN1Encoder<CMCUnsignedData>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_BodyPartPath(
                                value.bodyPartPath,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.identifier,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeAny(value.content, $.BER),
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
    return _cached_encoder_for_CMCUnsignedData(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CMCUnsignedData */

/* eslint-enable */
