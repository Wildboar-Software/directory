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
import { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";
export { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION FirmwarePackageInfo */
/**
 * @summary FirmwarePackageInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * FirmwarePackageInfo ::= SEQUENCE {
 *     fwPkgType                   INTEGER OPTIONAL,
 *     dependencies                SEQUENCE OF PreferredOrLegacyPackageIdentifier OPTIONAL
 * }
 * ```
 * 
 * @class
 */
export
class FirmwarePackageInfo {
    constructor (
        /**
         * @summary `fwPkgType`.
         * @public
         * @readonly
         */
        readonly fwPkgType: OPTIONAL<INTEGER>,
        /**
         * @summary `dependencies`.
         * @public
         * @readonly
         */
        readonly dependencies: OPTIONAL<PreferredOrLegacyPackageIdentifier[]>
    ) {}

    /**
     * @summary Restructures an object into a FirmwarePackageInfo
     * @description
     * 
     * This takes an `object` and converts it to a `FirmwarePackageInfo`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `FirmwarePackageInfo`.
     * @returns {FirmwarePackageInfo}
     */
    public static _from_object (_o: { [_K in keyof (FirmwarePackageInfo)]: (FirmwarePackageInfo)[_K] }): FirmwarePackageInfo {
        return new FirmwarePackageInfo(_o.fwPkgType, _o.dependencies);
    }


}
/* END_OF_SYMBOL_DEFINITION FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageInfo */
/**
 * @summary The Leading Root Component Types of FirmwarePackageInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_FirmwarePackageInfo: $.ComponentSpec[] = [
    new $.ComponentSpec("fwPkgType", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("dependencies", true, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageInfo */
/**
 * @summary The Trailing Root Component Types of FirmwarePackageInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_FirmwarePackageInfo: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageInfo */
/**
 * @summary The Extension Addition Component Types of FirmwarePackageInfo
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_FirmwarePackageInfo: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageInfo */
let _cached_decoder_for_FirmwarePackageInfo: $.ASN1Decoder<FirmwarePackageInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePackageInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePackageInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePackageInfo} The decoded data structure.
 */
export
function _decode_FirmwarePackageInfo (el: _Element) {
    if (!_cached_decoder_for_FirmwarePackageInfo) { _cached_decoder_for_FirmwarePackageInfo = function (el: _Element): FirmwarePackageInfo {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let fwPkgType: OPTIONAL<INTEGER>;
    let dependencies: OPTIONAL<PreferredOrLegacyPackageIdentifier[]>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "fwPkgType": (_el: _Element): void => { fwPkgType = $._decodeInteger(_el); },
        "dependencies": (_el: _Element): void => { dependencies = $._decodeSequenceOf<PreferredOrLegacyPackageIdentifier>(() => _decode_PreferredOrLegacyPackageIdentifier)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_FirmwarePackageInfo,
        _extension_additions_list_spec_for_FirmwarePackageInfo,
        _root_component_type_list_2_spec_for_FirmwarePackageInfo,
        undefined,
    );
    return new FirmwarePackageInfo( /* SEQUENCE_CONSTRUCTOR_CALL */
        fwPkgType,
        dependencies
    );
}; }
    return _cached_decoder_for_FirmwarePackageInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageInfo */
let _cached_encoder_for_FirmwarePackageInfo: $.ASN1Encoder<FirmwarePackageInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageInfo */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePackageInfo */
/**
 * @summary Encodes a(n) FirmwarePackageInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePackageInfo, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePackageInfo (value: FirmwarePackageInfo, elGetter: $.ASN1Encoder<FirmwarePackageInfo>) {
    if (!_cached_encoder_for_FirmwarePackageInfo) { _cached_encoder_for_FirmwarePackageInfo = function (value: FirmwarePackageInfo, elGetter: $.ASN1Encoder<FirmwarePackageInfo>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.fwPkgType === undefined) ? undefined : $._encodeInteger(value.fwPkgType, $.BER)),
            /* IF_ABSENT  */ ((value.dependencies === undefined) ? undefined : $._encodeSequenceOf<PreferredOrLegacyPackageIdentifier>(() => _encode_PreferredOrLegacyPackageIdentifier, $.BER)(value.dependencies, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_FirmwarePackageInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePackageInfo */

/* eslint-enable */
