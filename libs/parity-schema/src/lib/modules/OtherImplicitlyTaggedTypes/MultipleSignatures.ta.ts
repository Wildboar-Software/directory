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
import { SignAttrsHash, _decode_SignAttrsHash, _encode_SignAttrsHash } from "../OtherImplicitlyTaggedTypes/SignAttrsHash.ta";
export { SignAttrsHash, _decode_SignAttrsHash, _encode_SignAttrsHash } from "../OtherImplicitlyTaggedTypes/SignAttrsHash.ta";
import { ESSCertIDv2, _decode_ESSCertIDv2, _encode_ESSCertIDv2 } from "../OtherImplicitlyTaggedTypes/ESSCertIDv2.ta";
export { ESSCertIDv2, _decode_ESSCertIDv2, _encode_ESSCertIDv2 } from "../OtherImplicitlyTaggedTypes/ESSCertIDv2.ta";
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION MultipleSignatures */
/**
 * @summary MultipleSignatures
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MultipleSignatures ::= SEQUENCE {
 *     bodyHashAlg         AlgorithmIdentifier{{SupportedAlgorithms}},
 *     signAlg             AlgorithmIdentifier{{SupportedAlgorithms}},
 *     signAttrsHash       SignAttrsHash,
 *     cert                ESSCertIDv2 OPTIONAL }
 * ```
 * 
 * @class
 */
export
class MultipleSignatures {
    constructor (
        /**
         * @summary `bodyHashAlg`.
         * @public
         * @readonly
         */
        readonly bodyHashAlg: AlgorithmIdentifier,
        /**
         * @summary `signAlg`.
         * @public
         * @readonly
         */
        readonly signAlg: AlgorithmIdentifier,
        /**
         * @summary `signAttrsHash`.
         * @public
         * @readonly
         */
        readonly signAttrsHash: SignAttrsHash,
        /**
         * @summary `cert`.
         * @public
         * @readonly
         */
        readonly cert: OPTIONAL<ESSCertIDv2>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a MultipleSignatures
     * @description
     * 
     * This takes an `object` and converts it to a `MultipleSignatures`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `MultipleSignatures`.
     * @returns {MultipleSignatures}
     */
    public static _from_object (_o: { [_K in keyof (MultipleSignatures)]: (MultipleSignatures)[_K] }): MultipleSignatures {
        return new MultipleSignatures(_o.bodyHashAlg, _o.signAlg, _o.signAttrsHash, _o.cert, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MultipleSignatures */
/**
 * @summary The Leading Root Component Types of MultipleSignatures
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_MultipleSignatures: $.ComponentSpec[] = [
    new $.ComponentSpec("bodyHashAlg", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("signAlg", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("signAttrsHash", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("cert", true, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MultipleSignatures */
/**
 * @summary The Trailing Root Component Types of MultipleSignatures
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_MultipleSignatures: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MultipleSignatures */
/**
 * @summary The Extension Addition Component Types of MultipleSignatures
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_MultipleSignatures: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MultipleSignatures */
let _cached_decoder_for_MultipleSignatures: $.ASN1Decoder<MultipleSignatures> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _decode_MultipleSignatures */
/**
 * @summary Decodes an ASN.1 element into a(n) MultipleSignatures
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MultipleSignatures} The decoded data structure.
 */
export
function _decode_MultipleSignatures (el: _Element) {
    if (!_cached_decoder_for_MultipleSignatures) { _cached_decoder_for_MultipleSignatures = function (el: _Element): MultipleSignatures {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let bodyHashAlg!: AlgorithmIdentifier;
    let signAlg!: AlgorithmIdentifier;
    let signAttrsHash!: SignAttrsHash;
    let cert: OPTIONAL<ESSCertIDv2>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "bodyHashAlg": (_el: _Element): void => { bodyHashAlg = _decode_AlgorithmIdentifier(_el); },
        "signAlg": (_el: _Element): void => { signAlg = _decode_AlgorithmIdentifier(_el); },
        "signAttrsHash": (_el: _Element): void => { signAttrsHash = _decode_SignAttrsHash(_el); },
        "cert": (_el: _Element): void => { cert = _decode_ESSCertIDv2(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_MultipleSignatures,
        _extension_additions_list_spec_for_MultipleSignatures,
        _root_component_type_list_2_spec_for_MultipleSignatures,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new MultipleSignatures( /* SEQUENCE_CONSTRUCTOR_CALL */
        bodyHashAlg,
        signAlg,
        signAttrsHash,
        cert,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_MultipleSignatures(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MultipleSignatures */
let _cached_encoder_for_MultipleSignatures: $.ASN1Encoder<MultipleSignatures> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MultipleSignatures */

/* START_OF_SYMBOL_DEFINITION _encode_MultipleSignatures */
/**
 * @summary Encodes a(n) MultipleSignatures into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MultipleSignatures, encoded as an ASN.1 Element.
 */
export
function _encode_MultipleSignatures (value: MultipleSignatures, elGetter: $.ASN1Encoder<MultipleSignatures>) {
    if (!_cached_encoder_for_MultipleSignatures) { _cached_encoder_for_MultipleSignatures = function (value: MultipleSignatures, elGetter: $.ASN1Encoder<MultipleSignatures>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.bodyHashAlg, $.BER),
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.signAlg, $.BER),
            /* REQUIRED   */ _encode_SignAttrsHash(value.signAttrsHash, $.BER),
            /* IF_ABSENT  */ ((value.cert === undefined) ? undefined : _encode_ESSCertIDv2(value.cert, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_MultipleSignatures(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MultipleSignatures */

/* eslint-enable */
