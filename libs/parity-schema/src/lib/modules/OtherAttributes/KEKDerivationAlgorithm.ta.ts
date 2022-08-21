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
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
export { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import { PBKDF2_params, _decode_PBKDF2_params, _encode_PBKDF2_params } from "../OtherAttributes/PBKDF2-params.ta";
export { PBKDF2_params, _decode_PBKDF2_params, _encode_PBKDF2_params } from "../OtherAttributes/PBKDF2-params.ta";


/* START_OF_SYMBOL_DEFINITION KEKDerivationAlgorithm */
/**
 * @summary KEKDerivationAlgorithm
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * KEKDerivationAlgorithm ::= SEQUENCE {
 *   kekAlg       AlgorithmIdentifier{{SupportedAlgorithms}},
 *   pbkdf2Param  PBKDF2-params }
 * ```
 * 
 * @class
 */
export
class KEKDerivationAlgorithm {
    constructor (
        /**
         * @summary `kekAlg`.
         * @public
         * @readonly
         */
        readonly kekAlg: AlgorithmIdentifier,
        /**
         * @summary `pbkdf2Param`.
         * @public
         * @readonly
         */
        readonly pbkdf2Param: PBKDF2_params,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a KEKDerivationAlgorithm
     * @description
     * 
     * This takes an `object` and converts it to a `KEKDerivationAlgorithm`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `KEKDerivationAlgorithm`.
     * @returns {KEKDerivationAlgorithm}
     */
    public static _from_object (_o: { [_K in keyof (KEKDerivationAlgorithm)]: (KEKDerivationAlgorithm)[_K] }): KEKDerivationAlgorithm {
        return new KEKDerivationAlgorithm(_o.kekAlg, _o.pbkdf2Param, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_KEKDerivationAlgorithm */
/**
 * @summary The Leading Root Component Types of KEKDerivationAlgorithm
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_KEKDerivationAlgorithm: $.ComponentSpec[] = [
    new $.ComponentSpec("kekAlg", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("pbkdf2Param", false, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_KEKDerivationAlgorithm */
/**
 * @summary The Trailing Root Component Types of KEKDerivationAlgorithm
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_KEKDerivationAlgorithm: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_KEKDerivationAlgorithm */
/**
 * @summary The Extension Addition Component Types of KEKDerivationAlgorithm
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_KEKDerivationAlgorithm: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_KEKDerivationAlgorithm */
let _cached_decoder_for_KEKDerivationAlgorithm: $.ASN1Decoder<KEKDerivationAlgorithm> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _decode_KEKDerivationAlgorithm */
/**
 * @summary Decodes an ASN.1 element into a(n) KEKDerivationAlgorithm
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {KEKDerivationAlgorithm} The decoded data structure.
 */
export
function _decode_KEKDerivationAlgorithm (el: _Element) {
    if (!_cached_decoder_for_KEKDerivationAlgorithm) { _cached_decoder_for_KEKDerivationAlgorithm = function (el: _Element): KEKDerivationAlgorithm {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("KEKDerivationAlgorithm contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "kekAlg";
    sequence[1].name = "pbkdf2Param";
    let kekAlg!: AlgorithmIdentifier;
    let pbkdf2Param!: PBKDF2_params;
    kekAlg = _decode_AlgorithmIdentifier(sequence[0]);
    pbkdf2Param = _decode_PBKDF2_params(sequence[1]);
    return new KEKDerivationAlgorithm(
        kekAlg,
        pbkdf2Param,
        sequence.slice(2),
    );
}; }
    return _cached_decoder_for_KEKDerivationAlgorithm(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_KEKDerivationAlgorithm */
let _cached_encoder_for_KEKDerivationAlgorithm: $.ASN1Encoder<KEKDerivationAlgorithm> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_KEKDerivationAlgorithm */

/* START_OF_SYMBOL_DEFINITION _encode_KEKDerivationAlgorithm */
/**
 * @summary Encodes a(n) KEKDerivationAlgorithm into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The KEKDerivationAlgorithm, encoded as an ASN.1 Element.
 */
export
function _encode_KEKDerivationAlgorithm (value: KEKDerivationAlgorithm, elGetter: $.ASN1Encoder<KEKDerivationAlgorithm>) {
    if (!_cached_encoder_for_KEKDerivationAlgorithm) { _cached_encoder_for_KEKDerivationAlgorithm = function (value: KEKDerivationAlgorithm, elGetter: $.ASN1Encoder<KEKDerivationAlgorithm>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.kekAlg, $.BER),
            /* REQUIRED   */ _encode_PBKDF2_params(value.pbkdf2Param, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_KEKDerivationAlgorithm(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_KEKDerivationAlgorithm */

/* eslint-enable */
