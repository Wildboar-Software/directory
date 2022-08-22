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


/* START_OF_SYMBOL_DEFINITION PBMParameter */
/**
 * @summary PBMParameter
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PBMParameter ::= SEQUENCE {
 *     salt                OCTET STRING,
 *     owf                 AlgorithmIdentifier{{SupportedAlgorithms}},
 *     -- AlgId for a One-Way Function (SHA-1 recommended)
 *     iterationCount      INTEGER,
 *     -- number of times the OWF is applied
 *     mac                 AlgorithmIdentifier{{SupportedAlgorithms}}
 *     -- the MAC AlgId (e.g., DES-MAC, Triple-DES-MAC, or HMAC
 * }
 * ```
 * 
 * @class
 */
export
class PBMParameter {
    constructor (
        /**
         * @summary `salt`.
         * @public
         * @readonly
         */
        readonly salt: OCTET_STRING,
        /**
         * @summary `owf`.
         * @public
         * @readonly
         */
        readonly owf: AlgorithmIdentifier,
        /**
         * @summary `iterationCount`.
         * @public
         * @readonly
         */
        readonly iterationCount: INTEGER,
        /**
         * @summary `mac`.
         * @public
         * @readonly
         */
        readonly mac: AlgorithmIdentifier
    ) {}

    /**
     * @summary Restructures an object into a PBMParameter
     * @description
     * 
     * This takes an `object` and converts it to a `PBMParameter`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PBMParameter`.
     * @returns {PBMParameter}
     */
    public static _from_object (_o: { [_K in keyof (PBMParameter)]: (PBMParameter)[_K] }): PBMParameter {
        return new PBMParameter(_o.salt, _o.owf, _o.iterationCount, _o.mac);
    }


}
/* END_OF_SYMBOL_DEFINITION PBMParameter */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PBMParameter */
/**
 * @summary The Leading Root Component Types of PBMParameter
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_PBMParameter: $.ComponentSpec[] = [
    new $.ComponentSpec("salt", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("owf", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("iterationCount", false, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("mac", false, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PBMParameter */
/**
 * @summary The Trailing Root Component Types of PBMParameter
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_PBMParameter: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PBMParameter */
/**
 * @summary The Extension Addition Component Types of PBMParameter
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_PBMParameter: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PBMParameter */
let _cached_decoder_for_PBMParameter: $.ASN1Decoder<PBMParameter> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _decode_PBMParameter */
/**
 * @summary Decodes an ASN.1 element into a(n) PBMParameter
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PBMParameter} The decoded data structure.
 */
export
function _decode_PBMParameter (el: _Element) {
    if (!_cached_decoder_for_PBMParameter) { _cached_decoder_for_PBMParameter = function (el: _Element): PBMParameter {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 4) {
        throw new _ConstructionError("PBMParameter contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "salt";
    sequence[1].name = "owf";
    sequence[2].name = "iterationCount";
    sequence[3].name = "mac";
    let salt!: OCTET_STRING;
    let owf!: AlgorithmIdentifier;
    let iterationCount!: INTEGER;
    let mac!: AlgorithmIdentifier;
    salt = $._decodeOctetString(sequence[0]);
    owf = _decode_AlgorithmIdentifier(sequence[1]);
    iterationCount = $._decodeInteger(sequence[2]);
    mac = _decode_AlgorithmIdentifier(sequence[3]);
    return new PBMParameter(
        salt,
        owf,
        iterationCount,
        mac,

    );
}; }
    return _cached_decoder_for_PBMParameter(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PBMParameter */
let _cached_encoder_for_PBMParameter: $.ASN1Encoder<PBMParameter> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PBMParameter */

/* START_OF_SYMBOL_DEFINITION _encode_PBMParameter */
/**
 * @summary Encodes a(n) PBMParameter into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PBMParameter, encoded as an ASN.1 Element.
 */
export
function _encode_PBMParameter (value: PBMParameter, elGetter: $.ASN1Encoder<PBMParameter>) {
    if (!_cached_encoder_for_PBMParameter) { _cached_encoder_for_PBMParameter = function (value: PBMParameter, elGetter: $.ASN1Encoder<PBMParameter>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodeOctetString(value.salt, $.BER),
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.owf, $.BER),
            /* REQUIRED   */ $._encodeInteger(value.iterationCount, $.BER),
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.mac, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_PBMParameter(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PBMParameter */

/* eslint-enable */
