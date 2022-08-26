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
import { METHOD } from "../IN-CS3-SCF-SDF-datatypes/METHOD.oca";
export { METHOD } from "../IN-CS3-SCF-SDF-datatypes/METHOD.oca";
import { SupportedMethods } from "../IN-CS3-SCF-SDF-datatypes/SupportedMethods.osa";
export { SupportedMethods } from "../IN-CS3-SCF-SDF-datatypes/SupportedMethods.osa";


/* START_OF_SYMBOL_DEFINITION MethodIdentifier */
/**
 * @summary MethodIdentifier
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MethodIdentifier ::= SEQUENCE {
 *   methodid         METHOD.&id({SupportedMethods}),
 *   inputAttributes
 *     SET OF METHOD.&InputAttributes.&id({SupportedMethods}{@methodid})
 *       OPTIONAL,
 *   --EDITOR: check this, for METHOD.&InputAttributes is a set of information object classes
 *   --and cannot be the governor of a component of a SEQUENCE
 *   specific-Input
 *     [0]  METHOD.&SpecificInput({SupportedMethods}{@methodid}) OPTIONAL
 * }
 * ```
 * 
 * @class
 */
export
class MethodIdentifier {
    constructor (
        /**
         * @summary `methodid`.
         * @public
         * @readonly
         */
        readonly methodid: OBJECT_IDENTIFIER,
        /**
         * @summary `inputAttributes`.
         * @public
         * @readonly
         */
        readonly inputAttributes: OPTIONAL<_Element[]>,
        /**
         * @summary `specific_Input`.
         * @public
         * @readonly
         */
        readonly specific_Input: OPTIONAL<_Element>
    ) {}

    /**
     * @summary Restructures an object into a MethodIdentifier
     * @description
     * 
     * This takes an `object` and converts it to a `MethodIdentifier`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `MethodIdentifier`.
     * @returns {MethodIdentifier}
     */
    public static _from_object (_o: { [_K in keyof (MethodIdentifier)]: (MethodIdentifier)[_K] }): MethodIdentifier {
        return new MethodIdentifier(_o.methodid, _o.inputAttributes, _o.specific_Input);
    }


}
/* END_OF_SYMBOL_DEFINITION MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MethodIdentifier */
/**
 * @summary The Leading Root Component Types of MethodIdentifier
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_MethodIdentifier: $.ComponentSpec[] = [
    new $.ComponentSpec("methodid", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("inputAttributes", true, $.hasTag(_TagClass.universal, 17), undefined, undefined),
    new $.ComponentSpec("specific-Input", true, $.hasTag(_TagClass.context, 0), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MethodIdentifier */
/**
 * @summary The Trailing Root Component Types of MethodIdentifier
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_MethodIdentifier: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MethodIdentifier */
/**
 * @summary The Extension Addition Component Types of MethodIdentifier
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_MethodIdentifier: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIdentifier */
let _cached_decoder_for_MethodIdentifier: $.ASN1Decoder<MethodIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_MethodIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) MethodIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MethodIdentifier} The decoded data structure.
 */
export
function _decode_MethodIdentifier (el: _Element) {
    if (!_cached_decoder_for_MethodIdentifier) { _cached_decoder_for_MethodIdentifier = function (el: _Element): MethodIdentifier {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let methodid!: OBJECT_IDENTIFIER;
    let inputAttributes: OPTIONAL<_Element[]>;
    let specific_Input: OPTIONAL<_Element>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "methodid": (_el: _Element): void => { methodid = $._decodeObjectIdentifier(_el); },
        "inputAttributes": (_el: _Element): void => { inputAttributes = $._decodeSetOf<_Element>(() => $._decodeAny)(_el); },
        "specific-Input": (_el: _Element): void => { specific_Input = $._decode_explicit<_Element>(() => $._decodeAny)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_MethodIdentifier,
        _extension_additions_list_spec_for_MethodIdentifier,
        _root_component_type_list_2_spec_for_MethodIdentifier,
        undefined,
    );
    return new MethodIdentifier( /* SEQUENCE_CONSTRUCTOR_CALL */
        methodid,
        inputAttributes,
        specific_Input
    );
}; }
    return _cached_decoder_for_MethodIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIdentifier */
let _cached_encoder_for_MethodIdentifier: $.ASN1Encoder<MethodIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_MethodIdentifier */
/**
 * @summary Encodes a(n) MethodIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MethodIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_MethodIdentifier (value: MethodIdentifier, elGetter: $.ASN1Encoder<MethodIdentifier>) {
    if (!_cached_encoder_for_MethodIdentifier) { _cached_encoder_for_MethodIdentifier = function (value: MethodIdentifier, elGetter: $.ASN1Encoder<MethodIdentifier>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodeObjectIdentifier(value.methodid, $.BER),
            /* IF_ABSENT  */ ((value.inputAttributes === undefined) ? undefined : $._encodeSetOf<_Element>(() => $._encodeAny, $.BER)(value.inputAttributes, $.BER)),
            /* IF_ABSENT  */ ((value.specific_Input === undefined) ? undefined : $._encode_explicit(_TagClass.context, 0, () => $._encodeAny, $.BER)(value.specific_Input, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_MethodIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MethodIdentifier */

/* eslint-enable */
