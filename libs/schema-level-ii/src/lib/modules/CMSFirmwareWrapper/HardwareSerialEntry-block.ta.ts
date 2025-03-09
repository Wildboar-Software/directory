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



/* START_OF_SYMBOL_DEFINITION HardwareSerialEntry_block */
/**
 * @summary HardwareSerialEntry_block
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * HardwareSerialEntry-block ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 * 
 * @class
 */
export
class HardwareSerialEntry_block {
    constructor (
        /**
         * @summary `low`.
         * @public
         * @readonly
         */
        readonly low: OCTET_STRING,
        /**
         * @summary `high`.
         * @public
         * @readonly
         */
        readonly high: OCTET_STRING
    ) {}

    /**
     * @summary Restructures an object into a HardwareSerialEntry_block
     * @description
     * 
     * This takes an `object` and converts it to a `HardwareSerialEntry_block`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `HardwareSerialEntry_block`.
     * @returns {HardwareSerialEntry_block}
     */
    public static _from_object (_o: { [_K in keyof (HardwareSerialEntry_block)]: (HardwareSerialEntry_block)[_K] }): HardwareSerialEntry_block {
        return new HardwareSerialEntry_block(_o.low, _o.high);
    }


}
/* END_OF_SYMBOL_DEFINITION HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareSerialEntry_block */
/**
 * @summary The Leading Root Component Types of HardwareSerialEntry_block
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_HardwareSerialEntry_block: $.ComponentSpec[] = [
    new $.ComponentSpec("low", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("high", false, $.hasTag(_TagClass.universal, 4), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareSerialEntry_block */
/**
 * @summary The Trailing Root Component Types of HardwareSerialEntry_block
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_HardwareSerialEntry_block: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareSerialEntry_block */
/**
 * @summary The Extension Addition Component Types of HardwareSerialEntry_block
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_HardwareSerialEntry_block: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareSerialEntry_block */
let _cached_decoder_for_HardwareSerialEntry_block: $.ASN1Decoder<HardwareSerialEntry_block> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _decode_HardwareSerialEntry_block */
/**
 * @summary Decodes an ASN.1 element into a(n) HardwareSerialEntry_block
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HardwareSerialEntry_block} The decoded data structure.
 */
export
function _decode_HardwareSerialEntry_block (el: _Element) {
    if (!_cached_decoder_for_HardwareSerialEntry_block) { _cached_decoder_for_HardwareSerialEntry_block = function (el: _Element): HardwareSerialEntry_block {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("HardwareSerialEntry-block contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "low";
    sequence[1].name = "high";
    let low!: OCTET_STRING;
    let high!: OCTET_STRING;
    low = $._decodeOctetString(sequence[0]);
    high = $._decodeOctetString(sequence[1]);
    return new HardwareSerialEntry_block(
        low,
        high,

    );
}; }
    return _cached_decoder_for_HardwareSerialEntry_block(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareSerialEntry_block */
let _cached_encoder_for_HardwareSerialEntry_block: $.ASN1Encoder<HardwareSerialEntry_block> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareSerialEntry_block */

/* START_OF_SYMBOL_DEFINITION _encode_HardwareSerialEntry_block */
/**
 * @summary Encodes a(n) HardwareSerialEntry_block into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HardwareSerialEntry_block, encoded as an ASN.1 Element.
 */
export
function _encode_HardwareSerialEntry_block (value: HardwareSerialEntry_block, elGetter: $.ASN1Encoder<HardwareSerialEntry_block>) {
    if (!_cached_encoder_for_HardwareSerialEntry_block) { _cached_encoder_for_HardwareSerialEntry_block = function (value: HardwareSerialEntry_block, elGetter: $.ASN1Encoder<HardwareSerialEntry_block>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodeOctetString(value.low, $.BER),
            /* REQUIRED   */ $._encodeOctetString(value.high, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_HardwareSerialEntry_block(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HardwareSerialEntry_block */

/* eslint-enable */
