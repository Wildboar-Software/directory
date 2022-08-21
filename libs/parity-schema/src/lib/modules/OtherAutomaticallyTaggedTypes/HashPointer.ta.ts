/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { Pointers, _decode_Pointers, _encode_Pointers } from "../OtherAutomaticallyTaggedTypes/Pointers.ta";
export { Pointers, _decode_Pointers, _encode_Pointers } from "../OtherAutomaticallyTaggedTypes/Pointers.ta";
import {
    DigestedData,
    _decode_DigestedData,
    _encode_DigestedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/DigestedData.ta";


/* START_OF_SYMBOL_DEFINITION HashPointer */
/**
 * @summary HashPointer
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * HashPointer ::= SEQUENCE {
 *     hash        DigestedData OPTIONAL,
 *     pointers    Pointers OPTIONAL }
 *     ((WITH COMPONENTS {..., hash PRESENT}) | (WITH COMPONENTS {..., pointers PRESENT}))
 * ```
 * 
 * @class
 */
export
class HashPointer {
    constructor (
        /**
         * @summary `hash`.
         * @public
         * @readonly
         */
        readonly hash: OPTIONAL<DigestedData>,
        /**
         * @summary `pointers`.
         * @public
         * @readonly
         */
        readonly pointers: OPTIONAL<Pointers>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a HashPointer
     * @description
     * 
     * This takes an `object` and converts it to a `HashPointer`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `HashPointer`.
     * @returns {HashPointer}
     */
    public static _from_object (_o: { [_K in keyof (HashPointer)]: (HashPointer)[_K] }): HashPointer {
        return new HashPointer(_o.hash, _o.pointers, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION HashPointer */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HashPointer */
/**
 * @summary The Leading Root Component Types of HashPointer
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_HashPointer: $.ComponentSpec[] = [
    new $.ComponentSpec("hash", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("pointers", true, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HashPointer */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HashPointer */
/**
 * @summary The Trailing Root Component Types of HashPointer
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_HashPointer: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HashPointer */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HashPointer */
/**
 * @summary The Extension Addition Component Types of HashPointer
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_HashPointer: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HashPointer */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HashPointer */
let _cached_decoder_for_HashPointer: $.ASN1Decoder<HashPointer> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HashPointer */

/* START_OF_SYMBOL_DEFINITION _decode_HashPointer */
/**
 * @summary Decodes an ASN.1 element into a(n) HashPointer
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HashPointer} The decoded data structure.
 */
export
function _decode_HashPointer (el: _Element) {
    if (!_cached_decoder_for_HashPointer) { _cached_decoder_for_HashPointer = function (el: _Element): HashPointer {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let hash: OPTIONAL<DigestedData>;
    let pointers: OPTIONAL<Pointers>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "hash": (_el: _Element): void => { hash = _decode_DigestedData(_el); },
        "pointers": (_el: _Element): void => { pointers = _decode_Pointers(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_HashPointer,
        _extension_additions_list_spec_for_HashPointer,
        _root_component_type_list_2_spec_for_HashPointer,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new HashPointer( /* SEQUENCE_CONSTRUCTOR_CALL */
        hash,
        pointers,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_HashPointer(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HashPointer */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HashPointer */
let _cached_encoder_for_HashPointer: $.ASN1Encoder<HashPointer> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HashPointer */

/* START_OF_SYMBOL_DEFINITION _encode_HashPointer */
/**
 * @summary Encodes a(n) HashPointer into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HashPointer, encoded as an ASN.1 Element.
 */
export
function _encode_HashPointer (value: HashPointer, elGetter: $.ASN1Encoder<HashPointer>) {
    if (!_cached_encoder_for_HashPointer) { _cached_encoder_for_HashPointer = function (value: HashPointer, elGetter: $.ASN1Encoder<HashPointer>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.hash === undefined) ? undefined : _encode_DigestedData(value.hash, $.BER)),
            /* IF_ABSENT  */ ((value.pointers === undefined) ? undefined : _encode_Pointers(value.pointers, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_HashPointer(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HashPointer */

/* eslint-enable */
