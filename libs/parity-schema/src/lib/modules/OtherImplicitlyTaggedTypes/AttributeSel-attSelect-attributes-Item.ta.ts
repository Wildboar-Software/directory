/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    AttributeOperations,
    _decode_AttributeOperations,
    _encode_AttributeOperations,
} from '../OtherImplicitlyTaggedTypes/AttributeOperations.ta';

/* START_OF_SYMBOL_DEFINITION AttributeSel_attSelect_attributes_Item */
/**
 * @summary AttributeSel_attSelect_attributes_Item
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeSel-attSelect-attributes-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 *
 * @class
 */
export class AttributeSel_attSelect_attributes_Item {
    constructor(
        /**
         * @summary `select`.
         * @public
         * @readonly
         */
        readonly select: OBJECT_IDENTIFIER[],
        /**
         * @summary `attrOper2`.
         * @public
         * @readonly
         */
        readonly attrOper2: OPTIONAL<AttributeOperations>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a AttributeSel_attSelect_attributes_Item
     * @description
     *
     * This takes an `object` and converts it to a `AttributeSel_attSelect_attributes_Item`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `AttributeSel_attSelect_attributes_Item`.
     * @returns {AttributeSel_attSelect_attributes_Item}
     */
    public static _from_object(_o: {
        [_K in keyof AttributeSel_attSelect_attributes_Item]: AttributeSel_attSelect_attributes_Item[_K];
    }): AttributeSel_attSelect_attributes_Item {
        return new AttributeSel_attSelect_attributes_Item(
            _o.select,
            _o.attrOper2,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeSel_attSelect_attributes_Item */
/**
 * @summary The Leading Root Component Types of AttributeSel_attSelect_attributes_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_AttributeSel_attSelect_attributes_Item: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'select',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'attrOper2',
            true,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeSel_attSelect_attributes_Item */
/**
 * @summary The Trailing Root Component Types of AttributeSel_attSelect_attributes_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_AttributeSel_attSelect_attributes_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeSel_attSelect_attributes_Item */
/**
 * @summary The Extension Addition Component Types of AttributeSel_attSelect_attributes_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_AttributeSel_attSelect_attributes_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect_attributes_Item */
let _cached_decoder_for_AttributeSel_attSelect_attributes_Item: $.ASN1Decoder<AttributeSel_attSelect_attributes_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect_attributes_Item */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeSel_attSelect_attributes_Item
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeSel_attSelect_attributes_Item} The decoded data structure.
 */
export function _decode_AttributeSel_attSelect_attributes_Item(el: _Element) {
    if (!_cached_decoder_for_AttributeSel_attSelect_attributes_Item) {
        _cached_decoder_for_AttributeSel_attSelect_attributes_Item = function (
            el: _Element
        ): AttributeSel_attSelect_attributes_Item {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let select!: OBJECT_IDENTIFIER[];
            let attrOper2: OPTIONAL<AttributeOperations>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                select: (_el: _Element): void => {
                    select = $._decodeSequenceOf<OBJECT_IDENTIFIER>(
                        () => $._decodeObjectIdentifier
                    )(_el);
                },
                attrOper2: (_el: _Element): void => {
                    attrOper2 = $._decode_implicit<AttributeOperations>(
                        () => _decode_AttributeOperations
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_AttributeSel_attSelect_attributes_Item,
                _extension_additions_list_spec_for_AttributeSel_attSelect_attributes_Item,
                _root_component_type_list_2_spec_for_AttributeSel_attSelect_attributes_Item,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new AttributeSel_attSelect_attributes_Item /* SEQUENCE_CONSTRUCTOR_CALL */(
                select,
                attrOper2,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_AttributeSel_attSelect_attributes_Item(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect_attributes_Item */
let _cached_encoder_for_AttributeSel_attSelect_attributes_Item: $.ASN1Encoder<AttributeSel_attSelect_attributes_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeSel_attSelect_attributes_Item */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect_attributes_Item */
/**
 * @summary Encodes a(n) AttributeSel_attSelect_attributes_Item into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeSel_attSelect_attributes_Item, encoded as an ASN.1 Element.
 */
export function _encode_AttributeSel_attSelect_attributes_Item(
    value: AttributeSel_attSelect_attributes_Item,
    elGetter: $.ASN1Encoder<AttributeSel_attSelect_attributes_Item>
) {
    if (!_cached_encoder_for_AttributeSel_attSelect_attributes_Item) {
        _cached_encoder_for_AttributeSel_attSelect_attributes_Item = function (
            value: AttributeSel_attSelect_attributes_Item,
            elGetter: $.ASN1Encoder<AttributeSel_attSelect_attributes_Item>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeSequenceOf<OBJECT_IDENTIFIER>(
                                () => $._encodeObjectIdentifier,
                                $.BER
                            )(value.select, $.BER),
                            /* IF_ABSENT  */ value.attrOper2 === undefined
                                ? undefined
                                : $._encode_implicit(
                                      _TagClass.context,
                                      0,
                                      () => _encode_AttributeOperations,
                                      $.BER
                                  )(value.attrOper2, $.BER),
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
    return _cached_encoder_for_AttributeSel_attSelect_attributes_Item(
        value,
        elGetter
    );
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeSel_attSelect_attributes_Item */

/* eslint-enable */
