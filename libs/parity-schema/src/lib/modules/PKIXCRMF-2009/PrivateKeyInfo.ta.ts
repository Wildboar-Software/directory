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
import { Attributes, _decode_Attributes, _encode_Attributes } from "../PKIXCRMF-2009/Attributes.ta";
export { Attributes, _decode_Attributes, _encode_Attributes } from "../PKIXCRMF-2009/Attributes.ta";


/* START_OF_SYMBOL_DEFINITION PrivateKeyInfo */
/**
 * @summary PrivateKeyInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PrivateKeyInfo ::= SEQUENCE {
 *     version                   INTEGER,
 *     privateKeyAlgorithm       AlgorithmIdentifier{{SupportedAlgorithms}},
 *     privateKey                OCTET STRING,
 *             --  Structure of public key is in PUBLIC-KEY.&PrivateKey
 *     attributes                [0] IMPLICIT Attributes OPTIONAL
 * }
 * ```
 * 
 * @class
 */
export
class PrivateKeyInfo {
    constructor (
        /**
         * @summary `version`.
         * @public
         * @readonly
         */
        readonly version: INTEGER,
        /**
         * @summary `privateKeyAlgorithm`.
         * @public
         * @readonly
         */
        readonly privateKeyAlgorithm: AlgorithmIdentifier,
        /**
         * @summary `privateKey`.
         * @public
         * @readonly
         */
        readonly privateKey: OCTET_STRING,
        /**
         * @summary `attributes`.
         * @public
         * @readonly
         */
        readonly attributes: OPTIONAL<Attributes>
    ) {}

    /**
     * @summary Restructures an object into a PrivateKeyInfo
     * @description
     * 
     * This takes an `object` and converts it to a `PrivateKeyInfo`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PrivateKeyInfo`.
     * @returns {PrivateKeyInfo}
     */
    public static _from_object (_o: { [_K in keyof (PrivateKeyInfo)]: (PrivateKeyInfo)[_K] }): PrivateKeyInfo {
        return new PrivateKeyInfo(_o.version, _o.privateKeyAlgorithm, _o.privateKey, _o.attributes);
    }


}
/* END_OF_SYMBOL_DEFINITION PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PrivateKeyInfo */
/**
 * @summary The Leading Root Component Types of PrivateKeyInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_PrivateKeyInfo: $.ComponentSpec[] = [
    new $.ComponentSpec("version", false, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("privateKeyAlgorithm", false, $.hasTag(_TagClass.universal, 16), undefined, undefined),
    new $.ComponentSpec("privateKey", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("attributes", true, $.hasTag(_TagClass.context, 0), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PrivateKeyInfo */
/**
 * @summary The Trailing Root Component Types of PrivateKeyInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_PrivateKeyInfo: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PrivateKeyInfo */
/**
 * @summary The Extension Addition Component Types of PrivateKeyInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_PrivateKeyInfo: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PrivateKeyInfo */
let _cached_decoder_for_PrivateKeyInfo: $.ASN1Decoder<PrivateKeyInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _decode_PrivateKeyInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) PrivateKeyInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PrivateKeyInfo} The decoded data structure.
 */
export
function _decode_PrivateKeyInfo (el: _Element) {
    if (!_cached_decoder_for_PrivateKeyInfo) { _cached_decoder_for_PrivateKeyInfo = function (el: _Element): PrivateKeyInfo {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let version!: INTEGER;
    let privateKeyAlgorithm!: AlgorithmIdentifier;
    let privateKey!: OCTET_STRING;
    let attributes: OPTIONAL<Attributes>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "version": (_el: _Element): void => { version = $._decodeInteger(_el); },
        "privateKeyAlgorithm": (_el: _Element): void => { privateKeyAlgorithm = _decode_AlgorithmIdentifier(_el); },
        "privateKey": (_el: _Element): void => { privateKey = $._decodeOctetString(_el); },
        "attributes": (_el: _Element): void => { attributes = $._decode_implicit<Attributes>(() => _decode_Attributes)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_PrivateKeyInfo,
        _extension_additions_list_spec_for_PrivateKeyInfo,
        _root_component_type_list_2_spec_for_PrivateKeyInfo,
        undefined,
    );
    return new PrivateKeyInfo( /* SEQUENCE_CONSTRUCTOR_CALL */
        version,
        privateKeyAlgorithm,
        privateKey,
        attributes
    );
}; }
    return _cached_decoder_for_PrivateKeyInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PrivateKeyInfo */
let _cached_encoder_for_PrivateKeyInfo: $.ASN1Encoder<PrivateKeyInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PrivateKeyInfo */

/* START_OF_SYMBOL_DEFINITION _encode_PrivateKeyInfo */
/**
 * @summary Encodes a(n) PrivateKeyInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PrivateKeyInfo, encoded as an ASN.1 Element.
 */
export
function _encode_PrivateKeyInfo (value: PrivateKeyInfo, elGetter: $.ASN1Encoder<PrivateKeyInfo>) {
    if (!_cached_encoder_for_PrivateKeyInfo) { _cached_encoder_for_PrivateKeyInfo = function (value: PrivateKeyInfo, elGetter: $.ASN1Encoder<PrivateKeyInfo>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodeInteger(value.version, $.BER),
            /* REQUIRED   */ _encode_AlgorithmIdentifier(value.privateKeyAlgorithm, $.BER),
            /* REQUIRED   */ $._encodeOctetString(value.privateKey, $.BER),
            /* IF_ABSENT  */ ((value.attributes === undefined) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_Attributes, $.BER)(value.attributes, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_PrivateKeyInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PrivateKeyInfo */

/* eslint-enable */
