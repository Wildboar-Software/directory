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



/* START_OF_SYMBOL_DEFINITION HardwareModuleName */
/**
 * @summary HardwareModuleName
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * HardwareModuleName ::= SEQUENCE {
 *     hwType                      OBJECT IDENTIFIER,
 *     hwSerialNum                 OCTET STRING
 * }
 * ```
 * 
 * @class
 */
export
class HardwareModuleName {
    constructor (
        /**
         * @summary `hwType`.
         * @public
         * @readonly
         */
        readonly hwType: OBJECT_IDENTIFIER,
        /**
         * @summary `hwSerialNum`.
         * @public
         * @readonly
         */
        readonly hwSerialNum: OCTET_STRING
    ) {}

    /**
     * @summary Restructures an object into a HardwareModuleName
     * @description
     * 
     * This takes an `object` and converts it to a `HardwareModuleName`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `HardwareModuleName`.
     * @returns {HardwareModuleName}
     */
    public static _from_object (_o: { [_K in keyof (HardwareModuleName)]: (HardwareModuleName)[_K] }): HardwareModuleName {
        return new HardwareModuleName(_o.hwType, _o.hwSerialNum);
    }


}
/* END_OF_SYMBOL_DEFINITION HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareModuleName */
/**
 * @summary The Leading Root Component Types of HardwareModuleName
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_HardwareModuleName: $.ComponentSpec[] = [
    new $.ComponentSpec("hwType", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("hwSerialNum", false, $.hasTag(_TagClass.universal, 4), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareModuleName */
/**
 * @summary The Trailing Root Component Types of HardwareModuleName
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_HardwareModuleName: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareModuleName */
/**
 * @summary The Extension Addition Component Types of HardwareModuleName
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_HardwareModuleName: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareModuleName */
let _cached_decoder_for_HardwareModuleName: $.ASN1Decoder<HardwareModuleName> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _decode_HardwareModuleName */
/**
 * @summary Decodes an ASN.1 element into a(n) HardwareModuleName
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HardwareModuleName} The decoded data structure.
 */
export
function _decode_HardwareModuleName (el: _Element) {
    if (!_cached_decoder_for_HardwareModuleName) { _cached_decoder_for_HardwareModuleName = function (el: _Element): HardwareModuleName {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("HardwareModuleName contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "hwType";
    sequence[1].name = "hwSerialNum";
    let hwType!: OBJECT_IDENTIFIER;
    let hwSerialNum!: OCTET_STRING;
    hwType = $._decodeObjectIdentifier(sequence[0]);
    hwSerialNum = $._decodeOctetString(sequence[1]);
    return new HardwareModuleName(
        hwType,
        hwSerialNum,

    );
}; }
    return _cached_decoder_for_HardwareModuleName(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareModuleName */
let _cached_encoder_for_HardwareModuleName: $.ASN1Encoder<HardwareModuleName> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareModuleName */

/* START_OF_SYMBOL_DEFINITION _encode_HardwareModuleName */
/**
 * @summary Encodes a(n) HardwareModuleName into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HardwareModuleName, encoded as an ASN.1 Element.
 */
export
function _encode_HardwareModuleName (value: HardwareModuleName, elGetter: $.ASN1Encoder<HardwareModuleName>) {
    if (!_cached_encoder_for_HardwareModuleName) { _cached_encoder_for_HardwareModuleName = function (value: HardwareModuleName, elGetter: $.ASN1Encoder<HardwareModuleName>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodeObjectIdentifier(value.hwType, $.BER),
            /* REQUIRED   */ $._encodeOctetString(value.hwSerialNum, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_HardwareModuleName(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HardwareModuleName */

/* eslint-enable */
