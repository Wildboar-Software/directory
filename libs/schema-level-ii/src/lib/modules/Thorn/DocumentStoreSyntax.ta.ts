/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    IA5String,
    OPTIONAL
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { _decode_DocumentStoreSyntax_method, _encode_DocumentStoreSyntax_method, DocumentStoreSyntax_method } from "../Thorn/DocumentStoreSyntax-method.ta";


/* START_OF_SYMBOL_DEFINITION DocumentStoreSyntax */
/**
 * @summary DocumentStoreSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DocumentStoreSyntax ::= SEQUENCE {
 *     method                  INTEGER { ftp(0), ftam(1) },
 *     textEncodedHostName     IA5String,
 *     directoryName           [0] IA5String OPTIONAL,
 *     fileFsName              IA5String,
 *     ...
 * }
 * ```
 *
 * @class
 */
export
class DocumentStoreSyntax {
    constructor (
        /**
         * @summary `method`.
         * @public
         * @readonly
         */
        readonly method: DocumentStoreSyntax_method,
        /**
         * @summary `textEncodedHostName`.
         * @public
         * @readonly
         */
        readonly textEncodedHostName: IA5String,
        /**
         * @summary `directoryName`.
         * @public
         * @readonly
         */
        readonly directoryName: OPTIONAL<IA5String>,
        /**
         * @summary `fileFsName`.
         * @public
         * @readonly
         */
        readonly fileFsName: IA5String,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a DocumentStoreSyntax
     * @description
     *
     * This takes an `object` and converts it to a `DocumentStoreSyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `DocumentStoreSyntax`.
     * @returns {DocumentStoreSyntax}
     */
    public static _from_object (_o: { [_K in keyof (DocumentStoreSyntax)]: (DocumentStoreSyntax)[_K] }): DocumentStoreSyntax {
        return new DocumentStoreSyntax(_o.method, _o.textEncodedHostName, _o.directoryName, _o.fileFsName, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DocumentStoreSyntax */
/**
 * @summary The Leading Root Component Types of DocumentStoreSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_DocumentStoreSyntax: $.ComponentSpec[] = [
    new $.ComponentSpec("method", false, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("textEncodedHostName", false, $.hasTag(_TagClass.universal, 22), undefined, undefined),
    new $.ComponentSpec("directoryName", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("fileFsName", false, $.hasTag(_TagClass.universal, 22), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DocumentStoreSyntax */
/**
 * @summary The Trailing Root Component Types of DocumentStoreSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_DocumentStoreSyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DocumentStoreSyntax */
/**
 * @summary The Extension Addition Component Types of DocumentStoreSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_DocumentStoreSyntax: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DocumentStoreSyntax */
let _cached_decoder_for_DocumentStoreSyntax: $.ASN1Decoder<DocumentStoreSyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_DocumentStoreSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) DocumentStoreSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DocumentStoreSyntax} The decoded data structure.
 */
export
function _decode_DocumentStoreSyntax (el: _Element) {
    if (!_cached_decoder_for_DocumentStoreSyntax) { _cached_decoder_for_DocumentStoreSyntax = function (el: _Element): DocumentStoreSyntax {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let method!: DocumentStoreSyntax_method;
    let textEncodedHostName!: IA5String;
    let directoryName: OPTIONAL<IA5String>;
    let fileFsName!: IA5String;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "method": (_el: _Element): void => { method = _decode_DocumentStoreSyntax_method(_el); },
        "textEncodedHostName": (_el: _Element): void => { textEncodedHostName = $._decodeIA5String(_el); },
        "directoryName": (_el: _Element): void => { directoryName = $._decode_explicit<IA5String>(() => $._decodeIA5String)(_el); },
        "fileFsName": (_el: _Element): void => { fileFsName = $._decodeIA5String(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_DocumentStoreSyntax,
        _extension_additions_list_spec_for_DocumentStoreSyntax,
        _root_component_type_list_2_spec_for_DocumentStoreSyntax,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new DocumentStoreSyntax( /* SEQUENCE_CONSTRUCTOR_CALL */
        method,
        textEncodedHostName,
        directoryName,
        fileFsName,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_DocumentStoreSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DocumentStoreSyntax */
let _cached_encoder_for_DocumentStoreSyntax: $.ASN1Encoder<DocumentStoreSyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DocumentStoreSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_DocumentStoreSyntax */
/**
 * @summary Encodes a(n) DocumentStoreSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DocumentStoreSyntax, encoded as an ASN.1 Element.
 */
export
function _encode_DocumentStoreSyntax (value: DocumentStoreSyntax, elGetter: $.ASN1Encoder<DocumentStoreSyntax>) {
    if (!_cached_encoder_for_DocumentStoreSyntax) { _cached_encoder_for_DocumentStoreSyntax = function (value: DocumentStoreSyntax, elGetter: $.ASN1Encoder<DocumentStoreSyntax>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_DocumentStoreSyntax_method(value.method, $.BER),
            /* REQUIRED   */ $._encodeIA5String(value.textEncodedHostName, $.BER),
            /* IF_ABSENT  */ ((value.directoryName === undefined) ? undefined : $._encode_explicit(_TagClass.context, 0, () => $._encodeIA5String, $.BER)(value.directoryName, $.BER)),
            /* REQUIRED   */ $._encodeIA5String(value.fileFsName, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_DocumentStoreSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DocumentStoreSyntax */

/* eslint-enable */
