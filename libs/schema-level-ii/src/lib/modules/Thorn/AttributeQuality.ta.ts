/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { _decode_AttributeQuality_attribute_completeness, _encode_AttributeQuality_attribute_completeness, _enum_for_AttributeQuality_attribute_completeness, AttributeQuality_attribute_completeness, AttributeQuality_attribute_completeness_full /* IMPORTED_LONG_ENUMERATION_ITEM */ } from "../Thorn/AttributeQuality-attribute-completeness.ta";
import { _decode_AttributeQuality_maintenance_level, _encode_AttributeQuality_maintenance_level, _enum_for_AttributeQuality_maintenance_level, AttributeQuality_maintenance_level } from "../Thorn/AttributeQuality-maintenance-level.ta";


/* START_OF_SYMBOL_DEFINITION AttributeQuality */
/**
 * @summary AttributeQuality
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality ::= SEQUENCE {
 *     maintenance-level ENUMERATED {
 *         unknown           (1),
 *         external          (2),
 *         system-maintained (3),
 *         user-supplied     (4) },
 *     attribute-completeness ENUMERATED {
 *         none        (1),
 *         sample      (2),
 *         selected    (3),
 *         substantial (4),
 *         full        (5) } DEFAULT full,
 *     ...
 * }
 * ```
 *
 * @class
 */
export
class AttributeQuality {
    constructor (
        /**
         * @summary `maintenance_level`.
         * @public
         * @readonly
         */
        readonly maintenance_level: AttributeQuality_maintenance_level,
        /**
         * @summary `attribute_completeness`.
         * @public
         * @readonly
         */
        readonly attribute_completeness: OPTIONAL<AttributeQuality_attribute_completeness>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a AttributeQuality
     * @description
     *
     * This takes an `object` and converts it to a `AttributeQuality`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `AttributeQuality`.
     * @returns {AttributeQuality}
     */
    public static _from_object (_o: { [_K in keyof (AttributeQuality)]: (AttributeQuality)[_K] }): AttributeQuality {
        return new AttributeQuality(_o.maintenance_level, _o.attribute_completeness, _o._unrecognizedExtensionsList);
    }

    /**
     * @summary Getter that returns the default value for `attribute_completeness`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_attribute_completeness () { return AttributeQuality_attribute_completeness_full; }        /**
         * @summary The enum used as the type of the component `maintenance_level`
         * @public
         * @static
         */

    public static _enum_for_maintenance_level = _enum_for_AttributeQuality_maintenance_level;        /**
         * @summary The enum used as the type of the component `attribute_completeness`
         * @public
         * @static
         */

    public static _enum_for_attribute_completeness = _enum_for_AttributeQuality_attribute_completeness;
}
/* END_OF_SYMBOL_DEFINITION AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeQuality */
/**
 * @summary The Leading Root Component Types of AttributeQuality
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_AttributeQuality: $.ComponentSpec[] = [
    new $.ComponentSpec("maintenance-level", false, $.hasTag(_TagClass.universal, 10), undefined, undefined),
    new $.ComponentSpec("attribute-completeness", true, $.hasTag(_TagClass.universal, 10), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeQuality */
/**
 * @summary The Trailing Root Component Types of AttributeQuality
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_AttributeQuality: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeQuality */
/**
 * @summary The Extension Addition Component Types of AttributeQuality
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_AttributeQuality: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality */
let _cached_decoder_for_AttributeQuality: $.ASN1Decoder<AttributeQuality> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeQuality */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeQuality
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeQuality} The decoded data structure.
 */
export
function _decode_AttributeQuality (el: _Element) {
    if (!_cached_decoder_for_AttributeQuality) { _cached_decoder_for_AttributeQuality = function (el: _Element): AttributeQuality {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let maintenance_level!: AttributeQuality_maintenance_level;
    let attribute_completeness: OPTIONAL<AttributeQuality_attribute_completeness> = AttributeQuality._default_value_for_attribute_completeness;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "maintenance-level": (_el: _Element): void => { maintenance_level = _decode_AttributeQuality_maintenance_level(_el); },
        "attribute-completeness": (_el: _Element): void => { attribute_completeness = _decode_AttributeQuality_attribute_completeness(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_AttributeQuality,
        _extension_additions_list_spec_for_AttributeQuality,
        _root_component_type_list_2_spec_for_AttributeQuality,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new AttributeQuality( /* SEQUENCE_CONSTRUCTOR_CALL */
        maintenance_level,
        attribute_completeness,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_AttributeQuality(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality */
let _cached_encoder_for_AttributeQuality: $.ASN1Encoder<AttributeQuality> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeQuality */
/**
 * @summary Encodes a(n) AttributeQuality into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeQuality, encoded as an ASN.1 Element.
 */
export
function _encode_AttributeQuality (value: AttributeQuality, elGetter: $.ASN1Encoder<AttributeQuality>) {
    if (!_cached_encoder_for_AttributeQuality) { _cached_encoder_for_AttributeQuality = function (value: AttributeQuality, elGetter: $.ASN1Encoder<AttributeQuality>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_AttributeQuality_maintenance_level(value.maintenance_level, $.BER),
            /* IF_DEFAULT */ (value.attribute_completeness === undefined || $.deepEq(value.attribute_completeness, AttributeQuality._default_value_for_attribute_completeness) ? undefined : _encode_AttributeQuality_attribute_completeness(value.attribute_completeness, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_AttributeQuality(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeQuality */

/* eslint-enable */
