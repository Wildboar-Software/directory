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
import { BdcPKCInformation, _decode_BdcPKCInformation, _encode_BdcPKCInformation } from "../TAI/BdcPKCInformation.ta";
export { BdcPKCInformation, _decode_BdcPKCInformation, _encode_BdcPKCInformation } from "../TAI/BdcPKCInformation.ta";
import { BPUReportInformation, _decode_BPUReportInformation, _encode_BPUReportInformation } from "../TAI/BPUReportInformation.ta";
export { BPUReportInformation, _decode_BPUReportInformation, _encode_BPUReportInformation } from "../TAI/BPUReportInformation.ta";


/* START_OF_SYMBOL_DEFINITION BDCReportContentInformation */
/**
 * @summary BDCReportContentInformation
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BDCReportContentInformation ::= SEQUENCE {
 *   bdcPKCInformation     BdcPKCInformation,
 *   bdcReportInformation  BPUReportInformation
 * }
 * ```
 * 
 * @class
 */
export
class BDCReportContentInformation {
    constructor (
        /**
         * @summary `bdcPKCInformation`.
         * @public
         * @readonly
         */
        readonly bdcPKCInformation: BdcPKCInformation,
        /**
         * @summary `bdcReportInformation`.
         * @public
         * @readonly
         */
        readonly bdcReportInformation: BPUReportInformation
    ) {}

    /**
     * @summary Restructures an object into a BDCReportContentInformation
     * @description
     * 
     * This takes an `object` and converts it to a `BDCReportContentInformation`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BDCReportContentInformation`.
     * @returns {BDCReportContentInformation}
     */
    public static _from_object (_o: { [_K in keyof (BDCReportContentInformation)]: (BDCReportContentInformation)[_K] }): BDCReportContentInformation {
        return new BDCReportContentInformation(_o.bdcPKCInformation, _o.bdcReportInformation);
    }


}
/* END_OF_SYMBOL_DEFINITION BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BDCReportContentInformation */
/**
 * @summary The Leading Root Component Types of BDCReportContentInformation
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_BDCReportContentInformation: $.ComponentSpec[] = [
    new $.ComponentSpec("bdcPKCInformation", false, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("bdcReportInformation", false, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BDCReportContentInformation */
/**
 * @summary The Trailing Root Component Types of BDCReportContentInformation
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_BDCReportContentInformation: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BDCReportContentInformation */
/**
 * @summary The Extension Addition Component Types of BDCReportContentInformation
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_BDCReportContentInformation: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BDCReportContentInformation */
let _cached_decoder_for_BDCReportContentInformation: $.ASN1Decoder<BDCReportContentInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _decode_BDCReportContentInformation */
/**
 * @summary Decodes an ASN.1 element into a(n) BDCReportContentInformation
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BDCReportContentInformation} The decoded data structure.
 */
export
function _decode_BDCReportContentInformation (el: _Element) {
    if (!_cached_decoder_for_BDCReportContentInformation) { _cached_decoder_for_BDCReportContentInformation = function (el: _Element): BDCReportContentInformation {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("BDCReportContentInformation contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "bdcPKCInformation";
    sequence[1].name = "bdcReportInformation";
    let bdcPKCInformation!: BdcPKCInformation;
    let bdcReportInformation!: BPUReportInformation;
    bdcPKCInformation = _decode_BdcPKCInformation(sequence[0]);
    bdcReportInformation = _decode_BPUReportInformation(sequence[1]);
    return new BDCReportContentInformation(
        bdcPKCInformation,
        bdcReportInformation,

    );
}; }
    return _cached_decoder_for_BDCReportContentInformation(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BDCReportContentInformation */
let _cached_encoder_for_BDCReportContentInformation: $.ASN1Encoder<BDCReportContentInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BDCReportContentInformation */

/* START_OF_SYMBOL_DEFINITION _encode_BDCReportContentInformation */
/**
 * @summary Encodes a(n) BDCReportContentInformation into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BDCReportContentInformation, encoded as an ASN.1 Element.
 */
export
function _encode_BDCReportContentInformation (value: BDCReportContentInformation, elGetter: $.ASN1Encoder<BDCReportContentInformation>) {
    if (!_cached_encoder_for_BDCReportContentInformation) { _cached_encoder_for_BDCReportContentInformation = function (value: BDCReportContentInformation, elGetter: $.ASN1Encoder<BDCReportContentInformation>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_BdcPKCInformation(value.bdcPKCInformation, $.BER),
            /* REQUIRED   */ _encode_BPUReportInformation(value.bdcReportInformation, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_BDCReportContentInformation(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BDCReportContentInformation */

/* eslint-enable */
