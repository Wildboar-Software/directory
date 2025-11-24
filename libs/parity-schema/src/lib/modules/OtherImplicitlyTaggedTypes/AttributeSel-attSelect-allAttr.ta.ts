/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    AttributeOperations,
    _decode_AttributeOperations,
    _encode_AttributeOperations,
} from '../OtherImplicitlyTaggedTypes/AttributeOperations.ta';

/* START_OF_SYMBOL_DEFINITION AttributeSel_attSelect_allAttr */
/**
 * @summary AttributeSel_attSelect_allAttr
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeSel-attSelect-allAttr ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 *
 * @class
 */
export class AttributeSel_attSelect_allAttr {
    constructor(
        /**
         * @summary `attrOper1`.
         * @public
         * @readonly
         */
        readonly attrOper1: OPTIONAL<AttributeOperations>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a AttributeSel_attSelect_allAttr
     * @description
     *
     * This takes an `object` and converts it to a `AttributeSel_attSelect_allAttr`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `AttributeSel_attSelect_allAttr`.
     * @returns {AttributeSel_attSelect_allAttr}
     */
    public static _from_object(_o: {
        [_K in keyof AttributeSel_attSelect_allAttr]: AttributeSel_attSelect_allAttr[_K];
    }): AttributeSel_attSelect_allAttr {
        return new AttributeSel_attSelect_allAttr(
            _o.attrOper1,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeSel_attSelect_allAttr */
/**
 * @summary The Leading Root Component Types of AttributeSel_attSelect_allAttr
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_AttributeSel_attSelect_allAttr: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'attrOper1',
            true,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeSel_attSelect_allAttr */
/**
 * @summary The Trailing Root Component Types of AttributeSel_attSelect_allAttr
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_AttributeSel_attSelect_allAttr: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeSel_attSelect_allAttr */
/**
 * @summary The Extension Addition Component Types of AttributeSel_attSelect_allAttr
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_AttributeSel_attSelect_allAttr: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect_allAttr */
let _cached_decoder_for_AttributeSel_attSelect_allAttr: $.ASN1Decoder<AttributeSel_attSelect_allAttr> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect_allAttr */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeSel_attSelect_allAttr
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeSel_attSelect_allAttr} The decoded data structure.
 */
export function _decode_AttributeSel_attSelect_allAttr(el: _Element) {
    if (!_cached_decoder_for_AttributeSel_attSelect_allAttr) {
        _cached_decoder_for_AttributeSel_attSelect_allAttr = function (
            el: _Element
        ): AttributeSel_attSelect_allAttr {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let attrOper1: OPTIONAL<AttributeOperations>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                attrOper1: (_el: _Element): void => {
                    attrOper1 = $._decode_implicit<AttributeOperations>(
                        () => _decode_AttributeOperations
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_AttributeSel_attSelect_allAttr,
                _extension_additions_list_spec_for_AttributeSel_attSelect_allAttr,
                _root_component_type_list_2_spec_for_AttributeSel_attSelect_allAttr,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new AttributeSel_attSelect_allAttr /* SEQUENCE_CONSTRUCTOR_CALL */(
                attrOper1,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_AttributeSel_attSelect_allAttr(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect_allAttr */
let _cached_encoder_for_AttributeSel_attSelect_allAttr: $.ASN1Encoder<AttributeSel_attSelect_allAttr> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect_allAttr */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect_allAttr */
/**
 * @summary Encodes a(n) AttributeSel_attSelect_allAttr into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeSel_attSelect_allAttr, encoded as an ASN.1 Element.
 */
export function _encode_AttributeSel_attSelect_allAttr(
    value: AttributeSel_attSelect_allAttr,
    elGetter: $.ASN1Encoder<AttributeSel_attSelect_allAttr>
) {
    if (!_cached_encoder_for_AttributeSel_attSelect_allAttr) {
        _cached_encoder_for_AttributeSel_attSelect_allAttr = function (
            value: AttributeSel_attSelect_allAttr,
            elGetter: $.ASN1Encoder<AttributeSel_attSelect_allAttr>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* IF_ABSENT  */ value.attrOper1 === undefined
                                ? undefined
                                : $._encode_implicit(
                                      _TagClass.context,
                                      0,
                                      () => _encode_AttributeOperations,
                                      $.BER
                                  )(value.attrOper1, $.BER),
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
    return _cached_encoder_for_AttributeSel_attSelect_allAttr(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect_allAttr */

/* eslint-enable */
