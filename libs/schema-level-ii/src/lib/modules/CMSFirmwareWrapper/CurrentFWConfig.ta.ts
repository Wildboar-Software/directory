/* eslint-disable */
import {
    INTEGER,
    OPTIONAL,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";
export { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION CurrentFWConfig */
/**
 * @summary CurrentFWConfig
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CurrentFWConfig ::= SEQUENCE {
 *     fwPkgType                   INTEGER OPTIONAL,
 *     fwPkgName                   PreferredOrLegacyPackageIdentifier
 * }
 * ```
 *
 * @class
 */
export
class CurrentFWConfig {
    constructor (
        /**
         * @summary `fwPkgType`.
         * @public
         * @readonly
         */
        readonly fwPkgType: OPTIONAL<INTEGER>,
        /**
         * @summary `fwPkgName`.
         * @public
         * @readonly
         */
        readonly fwPkgName: PreferredOrLegacyPackageIdentifier
    ) {}

    /**
     * @summary Restructures an object into a CurrentFWConfig
     * @description
     *
     * This takes an `object` and converts it to a `CurrentFWConfig`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CurrentFWConfig`.
     * @returns {CurrentFWConfig}
     */
    public static _from_object (_o: { [_K in keyof (CurrentFWConfig)]: (CurrentFWConfig)[_K] }): CurrentFWConfig {
        return new CurrentFWConfig(_o.fwPkgType, _o.fwPkgName);
    }


}
/* END_OF_SYMBOL_DEFINITION CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CurrentFWConfig */
/**
 * @summary The Leading Root Component Types of CurrentFWConfig
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_CurrentFWConfig: $.ComponentSpec[] = [
    new $.ComponentSpec("fwPkgType", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("fwPkgName", false, $.hasAnyTag, undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CurrentFWConfig */
/**
 * @summary The Trailing Root Component Types of CurrentFWConfig
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_CurrentFWConfig: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CurrentFWConfig */
/**
 * @summary The Extension Addition Component Types of CurrentFWConfig
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_CurrentFWConfig: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CurrentFWConfig */
let _cached_decoder_for_CurrentFWConfig: $.ASN1Decoder<CurrentFWConfig> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _decode_CurrentFWConfig */
/**
 * @summary Decodes an ASN.1 element into a(n) CurrentFWConfig
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CurrentFWConfig} The decoded data structure.
 */
export
function _decode_CurrentFWConfig (el: _Element) {
    if (!_cached_decoder_for_CurrentFWConfig) { _cached_decoder_for_CurrentFWConfig = function (el: _Element): CurrentFWConfig {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let fwPkgType: OPTIONAL<INTEGER>;
    let fwPkgName!: PreferredOrLegacyPackageIdentifier;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "fwPkgType": (_el: _Element): void => { fwPkgType = $._decodeInteger(_el); },
        "fwPkgName": (_el: _Element): void => { fwPkgName = _decode_PreferredOrLegacyPackageIdentifier(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_CurrentFWConfig,
        _extension_additions_list_spec_for_CurrentFWConfig,
        _root_component_type_list_2_spec_for_CurrentFWConfig,
        undefined,
    );
    return new CurrentFWConfig( /* SEQUENCE_CONSTRUCTOR_CALL */
        fwPkgType,
        fwPkgName
    );
}; }
    return _cached_decoder_for_CurrentFWConfig(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CurrentFWConfig */
let _cached_encoder_for_CurrentFWConfig: $.ASN1Encoder<CurrentFWConfig> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CurrentFWConfig */

/* START_OF_SYMBOL_DEFINITION _encode_CurrentFWConfig */
/**
 * @summary Encodes a(n) CurrentFWConfig into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CurrentFWConfig, encoded as an ASN.1 Element.
 */
export
function _encode_CurrentFWConfig (value: CurrentFWConfig, elGetter: $.ASN1Encoder<CurrentFWConfig>) {
    if (!_cached_encoder_for_CurrentFWConfig) { _cached_encoder_for_CurrentFWConfig = function (value: CurrentFWConfig, elGetter: $.ASN1Encoder<CurrentFWConfig>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.fwPkgType === undefined) ? undefined : $._encodeInteger(value.fwPkgType, $.BER)),
            /* REQUIRED   */ _encode_PreferredOrLegacyPackageIdentifier(value.fwPkgName, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_CurrentFWConfig(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CurrentFWConfig */

/* eslint-enable */
