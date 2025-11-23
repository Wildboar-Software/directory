/* eslint-disable */
import {
    OPTIONAL,
    PrintableString,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { AttributeQuality, _decode_AttributeQuality, _encode_AttributeQuality } from "../Thorn/AttributeQuality.ta";
import { DataQualitySyntax_attributeQuality_Item, _decode_DataQualitySyntax_attributeQuality_Item, _encode_DataQualitySyntax_attributeQuality_Item } from "../Thorn/DataQualitySyntax-attributeQuality-Item.ta";
import { DataQualitySyntax_namespace_completeness, _decode_DataQualitySyntax_namespace_completeness, _encode_DataQualitySyntax_namespace_completeness, _enum_for_DataQualitySyntax_namespace_completeness } from "../Thorn/DataQualitySyntax-namespace-completeness.ta";



/* START_OF_SYMBOL_DEFINITION DataQualitySyntax */
/**
 * @summary DataQualitySyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DataQualitySyntax ::= SEQUENCE {
 *     namespace-completeness ENUMERATED {
 *         none        (1),
 *         sample      (2),
 *         selected    (3),
 *         substantial (4),
 *         full        (5) },
 *     defaultAttributeQuality     AttributeQuality,
 *     attributeQuality    SET OF SEQUENCE {
 *         type        AttributeType,
 *         quality     AttributeQuality,
 *         ...
 *     },
 *     description     PrintableString OPTIONAL,
 *     ...
 * }
 * ```
 *
 * @class
 */
export
class DataQualitySyntax {
    constructor (
        /**
         * @summary `namespace_completeness`.
         * @public
         * @readonly
         */
        readonly namespace_completeness: DataQualitySyntax_namespace_completeness,
        /**
         * @summary `defaultAttributeQuality`.
         * @public
         * @readonly
         */
        readonly defaultAttributeQuality: AttributeQuality,
        /**
         * @summary `attributeQuality`.
         * @public
         * @readonly
         */
        readonly attributeQuality: DataQualitySyntax_attributeQuality_Item[],
        /**
         * @summary `description`.
         * @public
         * @readonly
         */
        readonly description: OPTIONAL<PrintableString>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a DataQualitySyntax
     * @description
     *
     * This takes an `object` and converts it to a `DataQualitySyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `DataQualitySyntax`.
     * @returns {DataQualitySyntax}
     */
    public static _from_object (_o: { [_K in keyof (DataQualitySyntax)]: (DataQualitySyntax)[_K] }): DataQualitySyntax {
        return new DataQualitySyntax(_o.namespace_completeness, _o.defaultAttributeQuality, _o.attributeQuality, _o.description, _o._unrecognizedExtensionsList);
    }

        /**
         * @summary The enum used as the type of the component `namespace_completeness`
         * @public
         * @static
         */

    public static _enum_for_namespace_completeness = _enum_for_DataQualitySyntax_namespace_completeness;
}
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DataQualitySyntax */
/**
 * @summary The Leading Root Component Types of DataQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_DataQualitySyntax: $.ComponentSpec[] = [
    new $.ComponentSpec("namespace-completeness", false, $.hasTag(_TagClass.universal, 10), undefined, undefined),
    new $.ComponentSpec("defaultAttributeQuality", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("attributeQuality", false, $.hasTag(_TagClass.universal, 17), undefined, undefined),
    new $.ComponentSpec("description", true, $.hasTag(_TagClass.universal, 19), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DataQualitySyntax */
/**
 * @summary The Trailing Root Component Types of DataQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_DataQualitySyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DataQualitySyntax */
/**
 * @summary The Extension Addition Component Types of DataQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_DataQualitySyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DataQualitySyntax */
let _cached_decoder_for_DataQualitySyntax: $.ASN1Decoder<DataQualitySyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _decode_DataQualitySyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) DataQualitySyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DataQualitySyntax} The decoded data structure.
 */
export
function _decode_DataQualitySyntax (el: _Element) {
    if (!_cached_decoder_for_DataQualitySyntax) { _cached_decoder_for_DataQualitySyntax = function (el: _Element): DataQualitySyntax {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let namespace_completeness!: DataQualitySyntax_namespace_completeness;
    let defaultAttributeQuality!: AttributeQuality;
    let attributeQuality!: DataQualitySyntax_attributeQuality_Item[];
    let description: OPTIONAL<PrintableString>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "namespace-completeness": (_el: _Element): void => { namespace_completeness = _decode_DataQualitySyntax_namespace_completeness(_el); },
        "defaultAttributeQuality": (_el: _Element): void => { defaultAttributeQuality = _decode_AttributeQuality(_el); },
        "attributeQuality": (_el: _Element): void => { attributeQuality = $._decodeSetOf<DataQualitySyntax_attributeQuality_Item>(() => _decode_DataQualitySyntax_attributeQuality_Item)(_el); },
        "description": (_el: _Element): void => { description = $._decodePrintableString(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_DataQualitySyntax,
        _extension_additions_list_spec_for_DataQualitySyntax,
        _root_component_type_list_2_spec_for_DataQualitySyntax,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new DataQualitySyntax( /* SEQUENCE_CONSTRUCTOR_CALL */
        namespace_completeness,
        defaultAttributeQuality,
        attributeQuality,
        description,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_DataQualitySyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DataQualitySyntax */
let _cached_encoder_for_DataQualitySyntax: $.ASN1Encoder<DataQualitySyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DataQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _encode_DataQualitySyntax */
/**
 * @summary Encodes a(n) DataQualitySyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DataQualitySyntax, encoded as an ASN.1 Element.
 */
export
function _encode_DataQualitySyntax (value: DataQualitySyntax, elGetter: $.ASN1Encoder<DataQualitySyntax>) {
    if (!_cached_encoder_for_DataQualitySyntax) { _cached_encoder_for_DataQualitySyntax = function (value: DataQualitySyntax, elGetter: $.ASN1Encoder<DataQualitySyntax>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_DataQualitySyntax_namespace_completeness(value.namespace_completeness, $.BER),
            /* REQUIRED   */ _encode_AttributeQuality(value.defaultAttributeQuality, $.BER),
            /* REQUIRED   */ $._encodeSetOf<DataQualitySyntax_attributeQuality_Item>(() => _encode_DataQualitySyntax_attributeQuality_Item, $.BER)(value.attributeQuality, $.BER),
            /* IF_ABSENT  */ ((value.description === undefined) ? undefined : $._encodePrintableString(value.description, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_DataQualitySyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DataQualitySyntax */

/* eslint-enable */
