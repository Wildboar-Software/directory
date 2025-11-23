/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ObjectSel_objSelect,
    _decode_ObjectSel_objSelect,
    _encode_ObjectSel_objSelect,
} from '../OtherImplicitlyTaggedTypes/ObjectSel-objSelect.ta';

/* START_OF_SYMBOL_DEFINITION ObjectSel */
/**
 * @summary ObjectSel
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ObjectSel ::= SEQUENCE {
 *   objecClass         OBJECT-CLASS.&id,
 *   objSelect          CHOICE {
 *     allObj        [0]  TargetSelect,
 *     objectNames   [1]  SEQUENCE SIZE (1..MAX) OF SEQUENCE {
 *       object             CHOICE {
 *         names         [1]  SEQUENCE SIZE (1..MAX) OF DistinguishedName,
 *         subtree       [2]  DistinguishedName,
 *         ... },
 *       select           TargetSelect,
 *       ... },
 *     ... },
 *   ... }
 * ```
 *
 * @class
 */
export class ObjectSel {
    constructor(
        /**
         * @summary `objecClass`.
         * @public
         * @readonly
         */
        readonly objecClass: OBJECT_IDENTIFIER,
        /**
         * @summary `objSelect`.
         * @public
         * @readonly
         */
        readonly objSelect: ObjectSel_objSelect,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a ObjectSel
     * @description
     *
     * This takes an `object` and converts it to a `ObjectSel`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ObjectSel`.
     * @returns {ObjectSel}
     */
    public static _from_object(_o: {
        [_K in keyof ObjectSel]: ObjectSel[_K];
    }): ObjectSel {
        return new ObjectSel(
            _o.objecClass,
            _o.objSelect,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION ObjectSel */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ObjectSel */
/**
 * @summary The Leading Root Component Types of ObjectSel
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ObjectSel: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'objecClass',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'objSelect',
            false,
            $.hasAnyTag,
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ObjectSel */
/**
 * @summary The Trailing Root Component Types of ObjectSel
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ObjectSel: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ObjectSel */
/**
 * @summary The Extension Addition Component Types of ObjectSel
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ObjectSel: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectSel */
let _cached_decoder_for_ObjectSel: $.ASN1Decoder<ObjectSel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _decode_ObjectSel */
/**
 * @summary Decodes an ASN.1 element into a(n) ObjectSel
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ObjectSel} The decoded data structure.
 */
export function _decode_ObjectSel(el: _Element) {
    if (!_cached_decoder_for_ObjectSel) {
        _cached_decoder_for_ObjectSel = function (el: _Element): ObjectSel {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'ObjectSel contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'objecClass';
            sequence[1].name = 'objSelect';
            let objecClass!: OBJECT_IDENTIFIER;
            let objSelect!: ObjectSel_objSelect;
            objecClass = $._decodeObjectIdentifier(sequence[0]);
            objSelect = _decode_ObjectSel_objSelect(sequence[1]);
            return new ObjectSel(objecClass, objSelect, sequence.slice(2));
        };
    }
    return _cached_decoder_for_ObjectSel(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectSel */
let _cached_encoder_for_ObjectSel: $.ASN1Encoder<ObjectSel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ObjectSel */

/* START_OF_SYMBOL_DEFINITION _encode_ObjectSel */
/**
 * @summary Encodes a(n) ObjectSel into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ObjectSel, encoded as an ASN.1 Element.
 */
export function _encode_ObjectSel(
    value: ObjectSel,
    elGetter: $.ASN1Encoder<ObjectSel>
) {
    if (!_cached_encoder_for_ObjectSel) {
        _cached_encoder_for_ObjectSel = function (
            value: ObjectSel,
            elGetter: $.ASN1Encoder<ObjectSel>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.objecClass,
                                $.BER
                            ),
                            /* REQUIRED   */ _encode_ObjectSel_objSelect(
                                value.objSelect,
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
    return _cached_encoder_for_ObjectSel(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ObjectSel */

/* eslint-enable */
