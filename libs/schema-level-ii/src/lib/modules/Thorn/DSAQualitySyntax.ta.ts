/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL,
    PrintableString
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { _decode_DSAQualitySyntax_serviceQuality, _encode_DSAQualitySyntax_serviceQuality, _enum_for_DSAQualitySyntax_serviceQuality, DSAQualitySyntax_serviceQuality } from "../Thorn/DSAQualitySyntax-serviceQuality.ta";
export { _decode_DSAQualitySyntax_serviceQuality, _encode_DSAQualitySyntax_serviceQuality, _enum_for_DSAQualitySyntax_serviceQuality, best_effort /* IMPORTED_SHORT_ENUMERATION_ITEM */, defunct /* IMPORTED_SHORT_ENUMERATION_ITEM */, DSAQualitySyntax_serviceQuality, DSAQualitySyntax_serviceQuality_best_effort /* IMPORTED_LONG_ENUMERATION_ITEM */, DSAQualitySyntax_serviceQuality_defunct /* IMPORTED_LONG_ENUMERATION_ITEM */, DSAQualitySyntax_serviceQuality_experimental /* IMPORTED_LONG_ENUMERATION_ITEM */, DSAQualitySyntax_serviceQuality_full_service /* IMPORTED_LONG_ENUMERATION_ITEM */, DSAQualitySyntax_serviceQuality_pilot_service /* IMPORTED_LONG_ENUMERATION_ITEM */, experimental /* IMPORTED_SHORT_ENUMERATION_ITEM */, full_service /* IMPORTED_SHORT_ENUMERATION_ITEM */, pilot_service /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "../Thorn/DSAQualitySyntax-serviceQuality.ta";


/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax */
/**
 * @summary DSAQualitySyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DSAQualitySyntax ::= SEQUENCE {
 *     serviceQuality      ENUMERATED {
 *         defunct       (0),
 *         experimental  (1),
 *         best-effort   (2),
 *         pilot-service (3),
 *         full-service  (4) },
 *     description     PrintableString OPTIONAL,
 *     ...
 * }
 * ```
 *
 * @class
 */
export
class DSAQualitySyntax {
    constructor (
        /**
         * @summary `serviceQuality`.
         * @public
         * @readonly
         */
        readonly serviceQuality: DSAQualitySyntax_serviceQuality,
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
     * @summary Restructures an object into a DSAQualitySyntax
     * @description
     *
     * This takes an `object` and converts it to a `DSAQualitySyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `DSAQualitySyntax`.
     * @returns {DSAQualitySyntax}
     */
    public static _from_object (_o: { [_K in keyof (DSAQualitySyntax)]: (DSAQualitySyntax)[_K] }): DSAQualitySyntax {
        return new DSAQualitySyntax(_o.serviceQuality, _o.description, _o._unrecognizedExtensionsList);
    }

        /**
         * @summary The enum used as the type of the component `serviceQuality`
         * @public
         * @static
         */

    public static _enum_for_serviceQuality = _enum_for_DSAQualitySyntax_serviceQuality;
}
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DSAQualitySyntax */
/**
 * @summary The Leading Root Component Types of DSAQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_DSAQualitySyntax: $.ComponentSpec[] = [
    new $.ComponentSpec("serviceQuality", false, $.hasTag(_TagClass.universal, 10), undefined, undefined),
    new $.ComponentSpec("description", true, $.hasTag(_TagClass.universal, 19), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DSAQualitySyntax */
/**
 * @summary The Trailing Root Component Types of DSAQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_DSAQualitySyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DSAQualitySyntax */
/**
 * @summary The Extension Addition Component Types of DSAQualitySyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_DSAQualitySyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DSAQualitySyntax */
let _cached_decoder_for_DSAQualitySyntax: $.ASN1Decoder<DSAQualitySyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _decode_DSAQualitySyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) DSAQualitySyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DSAQualitySyntax} The decoded data structure.
 */
export
function _decode_DSAQualitySyntax (el: _Element) {
    if (!_cached_decoder_for_DSAQualitySyntax) { _cached_decoder_for_DSAQualitySyntax = function (el: _Element): DSAQualitySyntax {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let serviceQuality!: DSAQualitySyntax_serviceQuality;
    let description: OPTIONAL<PrintableString>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "serviceQuality": (_el: _Element): void => { serviceQuality = _decode_DSAQualitySyntax_serviceQuality(_el); },
        "description": (_el: _Element): void => { description = $._decodePrintableString(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_DSAQualitySyntax,
        _extension_additions_list_spec_for_DSAQualitySyntax,
        _root_component_type_list_2_spec_for_DSAQualitySyntax,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new DSAQualitySyntax( /* SEQUENCE_CONSTRUCTOR_CALL */
        serviceQuality,
        description,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_DSAQualitySyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DSAQualitySyntax */
let _cached_encoder_for_DSAQualitySyntax: $.ASN1Encoder<DSAQualitySyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DSAQualitySyntax */

/* START_OF_SYMBOL_DEFINITION _encode_DSAQualitySyntax */
/**
 * @summary Encodes a(n) DSAQualitySyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DSAQualitySyntax, encoded as an ASN.1 Element.
 */
export
function _encode_DSAQualitySyntax (value: DSAQualitySyntax, elGetter: $.ASN1Encoder<DSAQualitySyntax>) {
    if (!_cached_encoder_for_DSAQualitySyntax) { _cached_encoder_for_DSAQualitySyntax = function (value: DSAQualitySyntax, elGetter: $.ASN1Encoder<DSAQualitySyntax>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_DSAQualitySyntax_serviceQuality(value.serviceQuality, $.BER),
            /* IF_ABSENT  */ ((value.description === undefined) ? undefined : $._encodePrintableString(value.description, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_DSAQualitySyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DSAQualitySyntax */

/* eslint-enable */
