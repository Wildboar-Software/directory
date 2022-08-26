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
import { SecurityLevelofPrivilege_bioSecLevel, _decode_SecurityLevelofPrivilege_bioSecLevel, _encode_SecurityLevelofPrivilege_bioSecLevel } from "../TAI/SecurityLevelofPrivilege-bioSecLevel.ta";
export { SecurityLevelofPrivilege_bioSecLevel, _decode_SecurityLevelofPrivilege_bioSecLevel, _encode_SecurityLevelofPrivilege_bioSecLevel } from "../TAI/SecurityLevelofPrivilege-bioSecLevel.ta";


/* START_OF_SYMBOL_DEFINITION SecurityLevelofPrivilege */
/**
 * @summary SecurityLevelofPrivilege
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SecurityLevelofPrivilege ::= SEQUENCE {
 *   bioSecLevel
 *     CHOICE {x520identifier    UniqueIdentifierOfBioParaInfo,
 *             simpleidentifier  INTEGER}
 * }
 * ```
 * 
 * @class
 */
export
class SecurityLevelofPrivilege {
    constructor (
        /**
         * @summary `bioSecLevel`.
         * @public
         * @readonly
         */
        readonly bioSecLevel: SecurityLevelofPrivilege_bioSecLevel
    ) {}

    /**
     * @summary Restructures an object into a SecurityLevelofPrivilege
     * @description
     * 
     * This takes an `object` and converts it to a `SecurityLevelofPrivilege`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `SecurityLevelofPrivilege`.
     * @returns {SecurityLevelofPrivilege}
     */
    public static _from_object (_o: { [_K in keyof (SecurityLevelofPrivilege)]: (SecurityLevelofPrivilege)[_K] }): SecurityLevelofPrivilege {
        return new SecurityLevelofPrivilege(_o.bioSecLevel);
    }


}
/* END_OF_SYMBOL_DEFINITION SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelofPrivilege */
/**
 * @summary The Leading Root Component Types of SecurityLevelofPrivilege
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_SecurityLevelofPrivilege: $.ComponentSpec[] = [
    new $.ComponentSpec("bioSecLevel", false, $.hasTag(_TagClass.context, 0), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelofPrivilege */
/**
 * @summary The Trailing Root Component Types of SecurityLevelofPrivilege
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_SecurityLevelofPrivilege: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelofPrivilege */
/**
 * @summary The Extension Addition Component Types of SecurityLevelofPrivilege
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_SecurityLevelofPrivilege: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelofPrivilege */
let _cached_decoder_for_SecurityLevelofPrivilege: $.ASN1Decoder<SecurityLevelofPrivilege> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityLevelofPrivilege */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityLevelofPrivilege
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityLevelofPrivilege} The decoded data structure.
 */
export
function _decode_SecurityLevelofPrivilege (el: _Element) {
    if (!_cached_decoder_for_SecurityLevelofPrivilege) { _cached_decoder_for_SecurityLevelofPrivilege = function (el: _Element): SecurityLevelofPrivilege {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 1) {
        throw new _ConstructionError("SecurityLevelofPrivilege contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "bioSecLevel";
    let bioSecLevel!: SecurityLevelofPrivilege_bioSecLevel;
    bioSecLevel = _decode_SecurityLevelofPrivilege_bioSecLevel(sequence[0]);
    return new SecurityLevelofPrivilege(
        bioSecLevel,

    );
}; }
    return _cached_decoder_for_SecurityLevelofPrivilege(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelofPrivilege */
let _cached_encoder_for_SecurityLevelofPrivilege: $.ASN1Encoder<SecurityLevelofPrivilege> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelofPrivilege */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityLevelofPrivilege */
/**
 * @summary Encodes a(n) SecurityLevelofPrivilege into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityLevelofPrivilege, encoded as an ASN.1 Element.
 */
export
function _encode_SecurityLevelofPrivilege (value: SecurityLevelofPrivilege, elGetter: $.ASN1Encoder<SecurityLevelofPrivilege>) {
    if (!_cached_encoder_for_SecurityLevelofPrivilege) { _cached_encoder_for_SecurityLevelofPrivilege = function (value: SecurityLevelofPrivilege, elGetter: $.ASN1Encoder<SecurityLevelofPrivilege>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_SecurityLevelofPrivilege_bioSecLevel(value.bioSecLevel, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_SecurityLevelofPrivilege(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityLevelofPrivilege */

/* eslint-enable */
