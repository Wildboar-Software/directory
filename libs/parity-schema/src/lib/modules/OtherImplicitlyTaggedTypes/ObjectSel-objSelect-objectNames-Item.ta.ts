/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ObjectSel_objSelect_objectNames_Item_object,
    _decode_ObjectSel_objSelect_objectNames_Item_object,
    _encode_ObjectSel_objSelect_objectNames_Item_object,
} from '../OtherImplicitlyTaggedTypes/ObjectSel-objSelect-objectNames-Item-object.ta';
import {
    TargetSelect,
    _decode_TargetSelect,
    _encode_TargetSelect,
} from '../OtherImplicitlyTaggedTypes/TargetSelect.ta';

/* START_OF_SYMBOL_DEFINITION ObjectSel_objSelect_objectNames_Item */
/**
 * @summary ObjectSel_objSelect_objectNames_Item
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ObjectSel-objSelect-objectNames-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 *
 * @class
 */
export class ObjectSel_objSelect_objectNames_Item {
    constructor(
        /**
         * @summary `object`.
         * @public
         * @readonly
         */
        readonly object: ObjectSel_objSelect_objectNames_Item_object,
        /**
         * @summary `select`.
         * @public
         * @readonly
         */
        readonly select: TargetSelect,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a ObjectSel_objSelect_objectNames_Item
     * @description
     *
     * This takes an `object` and converts it to a `ObjectSel_objSelect_objectNames_Item`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ObjectSel_objSelect_objectNames_Item`.
     * @returns {ObjectSel_objSelect_objectNames_Item}
     */
    public static _from_object(_o: {
        [_K in keyof ObjectSel_objSelect_objectNames_Item]: ObjectSel_objSelect_objectNames_Item[_K];
    }): ObjectSel_objSelect_objectNames_Item {
        return new ObjectSel_objSelect_objectNames_Item(
            _o.object,
            _o.select,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ObjectSel_objSelect_objectNames_Item */
/**
 * @summary The Leading Root Component Types of ObjectSel_objSelect_objectNames_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ObjectSel_objSelect_objectNames_Item: $.ComponentSpec[] =
    [
        new $.ComponentSpec('object', false, $.hasAnyTag, undefined, undefined),
        new $.ComponentSpec(
            'select',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ObjectSel_objSelect_objectNames_Item */
/**
 * @summary The Trailing Root Component Types of ObjectSel_objSelect_objectNames_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ObjectSel_objSelect_objectNames_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ObjectSel_objSelect_objectNames_Item */
/**
 * @summary The Extension Addition Component Types of ObjectSel_objSelect_objectNames_Item
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ObjectSel_objSelect_objectNames_Item: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectSel_objSelect_objectNames_Item */
let _cached_decoder_for_ObjectSel_objSelect_objectNames_Item: $.ASN1Decoder<ObjectSel_objSelect_objectNames_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _decode_ObjectSel_objSelect_objectNames_Item */
/**
 * @summary Decodes an ASN.1 element into a(n) ObjectSel_objSelect_objectNames_Item
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ObjectSel_objSelect_objectNames_Item} The decoded data structure.
 */
export function _decode_ObjectSel_objSelect_objectNames_Item(el: _Element) {
    if (!_cached_decoder_for_ObjectSel_objSelect_objectNames_Item) {
        _cached_decoder_for_ObjectSel_objSelect_objectNames_Item = function (
            el: _Element
        ): ObjectSel_objSelect_objectNames_Item {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'ObjectSel-objSelect-objectNames-Item contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'object';
            sequence[1].name = 'select';
            let object!: ObjectSel_objSelect_objectNames_Item_object;
            let select!: TargetSelect;
            object = _decode_ObjectSel_objSelect_objectNames_Item_object(
                sequence[0]
            );
            select = _decode_TargetSelect(sequence[1]);
            return new ObjectSel_objSelect_objectNames_Item(
                object,
                select,
                sequence.slice(2)
            );
        };
    }
    return _cached_decoder_for_ObjectSel_objSelect_objectNames_Item(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectSel_objSelect_objectNames_Item */
let _cached_encoder_for_ObjectSel_objSelect_objectNames_Item: $.ASN1Encoder<ObjectSel_objSelect_objectNames_Item> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectSel_objSelect_objectNames_Item */

/* START_OF_SYMBOL_DEFINITION _encode_ObjectSel_objSelect_objectNames_Item */
/**
 * @summary Encodes a(n) ObjectSel_objSelect_objectNames_Item into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ObjectSel_objSelect_objectNames_Item, encoded as an ASN.1 Element.
 */
export function _encode_ObjectSel_objSelect_objectNames_Item(
    value: ObjectSel_objSelect_objectNames_Item,
    elGetter: $.ASN1Encoder<ObjectSel_objSelect_objectNames_Item>
) {
    if (!_cached_encoder_for_ObjectSel_objSelect_objectNames_Item) {
        _cached_encoder_for_ObjectSel_objSelect_objectNames_Item = function (
            value: ObjectSel_objSelect_objectNames_Item,
            elGetter: $.ASN1Encoder<ObjectSel_objSelect_objectNames_Item>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_ObjectSel_objSelect_objectNames_Item_object(
                                value.object,
                                $.BER
                            ),
                            /* REQUIRED   */ _encode_TargetSelect(
                                value.select,
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
    return _cached_encoder_for_ObjectSel_objSelect_objectNames_Item(
        value,
        elGetter
    );
}

/* END_OF_SYMBOL_DEFINITION _encode_ObjectSel_objSelect_objectNames_Item */

/* eslint-enable */
