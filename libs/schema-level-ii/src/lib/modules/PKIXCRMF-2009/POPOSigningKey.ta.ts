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
    ASN1UniversalType,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { POPOSigningKeyInput, _decode_POPOSigningKeyInput, _encode_POPOSigningKeyInput } from "../PKIXCRMF-2009/POPOSigningKeyInput.ta";
export { POPOSigningKeyInput, _decode_POPOSigningKeyInput, _encode_POPOSigningKeyInput } from "../PKIXCRMF-2009/POPOSigningKeyInput.ta";
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION POPOSigningKey */
/**
 * @summary POPOSigningKey
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * POPOSigningKey ::= SEQUENCE {
 *     poposkInput           [0] POPOSigningKeyInput OPTIONAL,
 *     algorithmIdentifier   AlgorithmIdentifier{SIGNATURE-ALGORITHM, {SignatureAlgorithms}},
 *     signature             BIT STRING }
 * ```
 * 
 * @class
 */
export
class POPOSigningKey {
    constructor (
        /**
         * @summary `poposkInput`.
         * @public
         * @readonly
         */
        readonly poposkInput: OPTIONAL<POPOSigningKeyInput>,
        /**
         * @summary `algorithmIdentifier`.
         * @public
         * @readonly
         */
        readonly algorithmIdentifier: AlgorithmIdentifier,
        /**
         * @summary `signature`.
         * @public
         * @readonly
         */
        readonly signature: BIT_STRING
    ) {}

    /**
     * @summary Restructures an object into a POPOSigningKey
     * @description
     * 
     * This takes an `object` and converts it to a `POPOSigningKey`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `POPOSigningKey`.
     * @returns {POPOSigningKey}
     */
    public static _from_object (_o: { [_K in keyof (POPOSigningKey)]: (POPOSigningKey)[_K] }): POPOSigningKey {
        return new POPOSigningKey(_o.poposkInput, _o.algorithmIdentifier, _o.signature);
    }


}
/* END_OF_SYMBOL_DEFINITION POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_POPOSigningKey */
/**
 * @summary The Leading Root Component Types of POPOSigningKey
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_POPOSigningKey: $.ComponentSpec[] = [
    new $.ComponentSpec("poposkInput", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("algorithmIdentifier", false, $.hasTag(_TagClass.universal, ASN1UniversalType.sequence), undefined, undefined),
    new $.ComponentSpec("signature", false, $.hasTag(_TagClass.universal, 3), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_POPOSigningKey */
/**
 * @summary The Trailing Root Component Types of POPOSigningKey
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_POPOSigningKey: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_POPOSigningKey */
/**
 * @summary The Extension Addition Component Types of POPOSigningKey
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_POPOSigningKey: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKey */
let _cached_decoder_for_POPOSigningKey: $.ASN1Decoder<POPOSigningKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _decode_POPOSigningKey */
/**
 * @summary Decodes an ASN.1 element into a(n) POPOSigningKey
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {POPOSigningKey} The decoded data structure.
 */
export
function _decode_POPOSigningKey (el: _Element) {
    if (!_cached_decoder_for_POPOSigningKey) { _cached_decoder_for_POPOSigningKey = function (el: _Element): POPOSigningKey {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let poposkInput: OPTIONAL<POPOSigningKeyInput>;
    let algorithmIdentifier!: AlgorithmIdentifier;
    let signature!: BIT_STRING;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "poposkInput": (_el: _Element): void => { poposkInput = $._decode_implicit<POPOSigningKeyInput>(() => _decode_POPOSigningKeyInput)(_el); },
        "algorithmIdentifier": (_el: _Element): void => { algorithmIdentifier = _decode_AlgorithmIdentifier(_el); },
        "signature": (_el: _Element): void => { signature = $._decodeBitString(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_POPOSigningKey,
        _extension_additions_list_spec_for_POPOSigningKey,
        _root_component_type_list_2_spec_for_POPOSigningKey,
        undefined,
    );
    return new POPOSigningKey( /* SEQUENCE_CONSTRUCTOR_CALL */
        poposkInput,
        algorithmIdentifier,
        signature
    );
}; }
    return _cached_decoder_for_POPOSigningKey(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKey */
let _cached_encoder_for_POPOSigningKey: $.ASN1Encoder<POPOSigningKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKey */

/* START_OF_SYMBOL_DEFINITION _encode_POPOSigningKey */
/**
 * @summary Encodes a(n) POPOSigningKey into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The POPOSigningKey, encoded as an ASN.1 Element.
 */
export
function _encode_POPOSigningKey (value: POPOSigningKey, elGetter: $.ASN1Encoder<POPOSigningKey>) {
    if (!_cached_encoder_for_POPOSigningKey) { _cached_encoder_for_POPOSigningKey = function (value: POPOSigningKey, elGetter: $.ASN1Encoder<POPOSigningKey>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.poposkInput === undefined) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_POPOSigningKeyInput, $.BER)(value.poposkInput, $.BER)),
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.algorithmIdentifier, $.BER),
            /* REQUIRED   */ $._encodeBitString(value.signature, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_POPOSigningKey(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_POPOSigningKey */

/* eslint-enable */
