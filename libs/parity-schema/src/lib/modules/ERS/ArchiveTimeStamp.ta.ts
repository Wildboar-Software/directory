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
import { Attributes, _decode_Attributes, _encode_Attributes } from "../ERS/Attributes.ta";
export { Attributes, _decode_Attributes, _encode_Attributes } from "../ERS/Attributes.ta";
import { PartialHashtree, _decode_PartialHashtree, _encode_PartialHashtree } from "../ERS/PartialHashtree.ta";
export { PartialHashtree, _decode_PartialHashtree, _encode_PartialHashtree } from "../ERS/PartialHashtree.ta";
import { ContentInfo, _decode_ContentInfo, _encode_ContentInfo } from "../ERS/ContentInfo.ta";
export { ContentInfo, _decode_ContentInfo, _encode_ContentInfo } from "../ERS/ContentInfo.ta";


/* START_OF_SYMBOL_DEFINITION ArchiveTimeStamp */
/**
 * @summary ArchiveTimeStamp
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ArchiveTimeStamp ::= SEQUENCE {
 *     digestAlgorithm [0] AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
 *     attributes      [1] Attributes OPTIONAL,
 *     reducedHashtree [2] SEQUENCE OF PartialHashtree OPTIONAL,
 *     timeStamp       ContentInfo
 * }
 * ```
 * 
 * @class
 */
export
class ArchiveTimeStamp {
    constructor (
        /**
         * @summary `digestAlgorithm`.
         * @public
         * @readonly
         */
        readonly digestAlgorithm: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `attributes`.
         * @public
         * @readonly
         */
        readonly attributes: OPTIONAL<Attributes>,
        /**
         * @summary `reducedHashtree`.
         * @public
         * @readonly
         */
        readonly reducedHashtree: OPTIONAL<PartialHashtree[]>,
        /**
         * @summary `timeStamp`.
         * @public
         * @readonly
         */
        readonly timeStamp: ContentInfo
    ) {}

    /**
     * @summary Restructures an object into a ArchiveTimeStamp
     * @description
     * 
     * This takes an `object` and converts it to a `ArchiveTimeStamp`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ArchiveTimeStamp`.
     * @returns {ArchiveTimeStamp}
     */
    public static _from_object (_o: { [_K in keyof (ArchiveTimeStamp)]: (ArchiveTimeStamp)[_K] }): ArchiveTimeStamp {
        return new ArchiveTimeStamp(_o.digestAlgorithm, _o.attributes, _o.reducedHashtree, _o.timeStamp);
    }


}
/* END_OF_SYMBOL_DEFINITION ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ArchiveTimeStamp */
/**
 * @summary The Leading Root Component Types of ArchiveTimeStamp
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_ArchiveTimeStamp: $.ComponentSpec[] = [
    new $.ComponentSpec("digestAlgorithm", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("attributes", true, $.hasTag(_TagClass.context, 1), undefined, undefined),
    new $.ComponentSpec("reducedHashtree", true, $.hasTag(_TagClass.context, 2), undefined, undefined),
    new $.ComponentSpec("timeStamp", false, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ArchiveTimeStamp */
/**
 * @summary The Trailing Root Component Types of ArchiveTimeStamp
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_ArchiveTimeStamp: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ArchiveTimeStamp */
/**
 * @summary The Extension Addition Component Types of ArchiveTimeStamp
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_ArchiveTimeStamp: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStamp */
let _cached_decoder_for_ArchiveTimeStamp: $.ASN1Decoder<ArchiveTimeStamp> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStamp */
/**
 * @summary Decodes an ASN.1 element into a(n) ArchiveTimeStamp
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ArchiveTimeStamp} The decoded data structure.
 */
export
function _decode_ArchiveTimeStamp (el: _Element) {
    if (!_cached_decoder_for_ArchiveTimeStamp) { _cached_decoder_for_ArchiveTimeStamp = function (el: _Element): ArchiveTimeStamp {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let digestAlgorithm: OPTIONAL<AlgorithmIdentifier>;
    let attributes: OPTIONAL<Attributes>;
    let reducedHashtree: OPTIONAL<PartialHashtree[]>;
    let timeStamp!: ContentInfo;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "digestAlgorithm": (_el: _Element): void => { digestAlgorithm = $._decode_implicit<AlgorithmIdentifier>(() => _decode_AlgorithmIdentifier)(_el); },
        "attributes": (_el: _Element): void => { attributes = $._decode_implicit<Attributes>(() => _decode_Attributes)(_el); },
        "reducedHashtree": (_el: _Element): void => { reducedHashtree = $._decode_implicit<PartialHashtree[]>(() => $._decodeSequenceOf<PartialHashtree>(() => _decode_PartialHashtree))(_el); },
        "timeStamp": (_el: _Element): void => { timeStamp = _decode_ContentInfo(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_ArchiveTimeStamp,
        _extension_additions_list_spec_for_ArchiveTimeStamp,
        _root_component_type_list_2_spec_for_ArchiveTimeStamp,
        undefined,
    );
    return new ArchiveTimeStamp( /* SEQUENCE_CONSTRUCTOR_CALL */
        digestAlgorithm,
        attributes,
        reducedHashtree,
        timeStamp
    );
}; }
    return _cached_decoder_for_ArchiveTimeStamp(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStamp */
let _cached_encoder_for_ArchiveTimeStamp: $.ASN1Encoder<ArchiveTimeStamp> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStamp */

/* START_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStamp */
/**
 * @summary Encodes a(n) ArchiveTimeStamp into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ArchiveTimeStamp, encoded as an ASN.1 Element.
 */
export
function _encode_ArchiveTimeStamp (value: ArchiveTimeStamp, elGetter: $.ASN1Encoder<ArchiveTimeStamp>) {
    if (!_cached_encoder_for_ArchiveTimeStamp) { _cached_encoder_for_ArchiveTimeStamp = function (value: ArchiveTimeStamp, elGetter: $.ASN1Encoder<ArchiveTimeStamp>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.digestAlgorithm === undefined) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_AlgorithmIdentifier, $.BER)(value.digestAlgorithm, $.BER)),
            /* IF_ABSENT  */ ((value.attributes === undefined) ? undefined : $._encode_implicit(_TagClass.context, 1, () => _encode_Attributes, $.BER)(value.attributes, $.BER)),
            /* IF_ABSENT  */ ((value.reducedHashtree === undefined) ? undefined : $._encode_implicit(_TagClass.context, 2, () => $._encodeSequenceOf<PartialHashtree>(() => _encode_PartialHashtree, $.BER), $.BER)(value.reducedHashtree, $.BER)),
            /* REQUIRED   */ _encode_ContentInfo(value.timeStamp, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_ArchiveTimeStamp(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStamp */

/* eslint-enable */
