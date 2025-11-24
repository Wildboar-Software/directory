/* eslint-disable */
import {
    type DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import {
    type DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';



/* START_OF_SYMBOL_DEFINITION DynamicPropValue */
/**
 * @summary DynamicPropValue
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DynamicPropValue ::= SEQUENCE {
 *   propertyType       OBJECT IDENTIFIER,
 *   dynamicPropEvalIf  DistinguishedName,
 *   extraInfo          DirectoryString{ub-dynamic-value-extra-info}
 * }
 * ```
 *
 * @class
 */
export class DynamicPropValue {
    constructor(
        /**
         * @summary `propertyType`.
         * @public
         * @readonly
         */
        readonly propertyType: OBJECT_IDENTIFIER,
        /**
         * @summary `dynamicPropEvalIf`.
         * @public
         * @readonly
         */
        readonly dynamicPropEvalIf: DistinguishedName,
        /**
         * @summary `extraInfo`.
         * @public
         * @readonly
         */
        readonly extraInfo: DirectoryString
    ) {}

    /**
     * @summary Restructures an object into a DynamicPropValue
     * @description
     *
     * This takes an `object` and converts it to a `DynamicPropValue`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `DynamicPropValue`.
     * @returns {DynamicPropValue}
     */
    public static _from_object(_o: {
        [_K in keyof DynamicPropValue]: DynamicPropValue[_K];
    }): DynamicPropValue {
        return new DynamicPropValue(
            _o.propertyType,
            _o.dynamicPropEvalIf,
            _o.extraInfo
        );
    }
}
/* END_OF_SYMBOL_DEFINITION DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DynamicPropValue */
/**
 * @summary The Leading Root Component Types of DynamicPropValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_DynamicPropValue: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'propertyType',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'dynamicPropEvalIf',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'extraInfo',
            false,
            $.hasAnyTag,
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DynamicPropValue */
/**
 * @summary The Trailing Root Component Types of DynamicPropValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_DynamicPropValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DynamicPropValue */
/**
 * @summary The Extension Addition Component Types of DynamicPropValue
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_DynamicPropValue: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DynamicPropValue */
let _cached_decoder_for_DynamicPropValue: $.ASN1Decoder<DynamicPropValue> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _decode_DynamicPropValue */
/**
 * @summary Decodes an ASN.1 element into a(n) DynamicPropValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DynamicPropValue} The decoded data structure.
 */
export function _decode_DynamicPropValue(el: _Element) {
    if (!_cached_decoder_for_DynamicPropValue) {
        _cached_decoder_for_DynamicPropValue = function (
            el: _Element
        ): DynamicPropValue {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 3) {
                throw new _ConstructionError(
                    'DynamicPropValue contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'propertyType';
            sequence[1].name = 'dynamicPropEvalIf';
            sequence[2].name = 'extraInfo';
            let propertyType!: OBJECT_IDENTIFIER;
            let dynamicPropEvalIf!: DistinguishedName;
            let extraInfo!: DirectoryString;
            propertyType = $._decodeObjectIdentifier(sequence[0]);
            dynamicPropEvalIf = _decode_DistinguishedName(sequence[1]);
            extraInfo = _decode_DirectoryString(sequence[2]);
            return new DynamicPropValue(
                propertyType,
                dynamicPropEvalIf,
                extraInfo
            );
        };
    }
    return _cached_decoder_for_DynamicPropValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DynamicPropValue */
let _cached_encoder_for_DynamicPropValue: $.ASN1Encoder<DynamicPropValue> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DynamicPropValue */

/* START_OF_SYMBOL_DEFINITION _encode_DynamicPropValue */
/**
 * @summary Encodes a(n) DynamicPropValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DynamicPropValue, encoded as an ASN.1 Element.
 */
export function _encode_DynamicPropValue(
    value: DynamicPropValue,
    elGetter: $.ASN1Encoder<DynamicPropValue>
) {
    if (!_cached_encoder_for_DynamicPropValue) {
        _cached_encoder_for_DynamicPropValue = function (
            value: DynamicPropValue,
            elGetter: $.ASN1Encoder<DynamicPropValue>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encodeObjectIdentifier(
                            value.propertyType,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_DistinguishedName(
                            value.dynamicPropEvalIf,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_DirectoryString(
                            value.extraInfo,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_DynamicPropValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DynamicPropValue */

/* eslint-enable */
