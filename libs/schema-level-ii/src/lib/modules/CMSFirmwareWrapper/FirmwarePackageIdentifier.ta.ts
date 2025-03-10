/* eslint-disable */
import {
    OPTIONAL,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";
import { PreferredOrLegacyStalePackageIdentifier, _decode_PreferredOrLegacyStalePackageIdentifier, _encode_PreferredOrLegacyStalePackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyStalePackageIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION FirmwarePackageIdentifier */
/**
 * @summary FirmwarePackageIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FirmwarePackageIdentifier ::= SEQUENCE {
 *     name        PreferredOrLegacyPackageIdentifier,
 *     stale       PreferredOrLegacyStalePackageIdentifier OPTIONAL
 * }
 * ```
 *
 * @class
 */
export
class FirmwarePackageIdentifier {
    constructor (
        /**
         * @summary `name`.
         * @public
         * @readonly
         */
        readonly name: PreferredOrLegacyPackageIdentifier,
        /**
         * @summary `stale`.
         * @public
         * @readonly
         */
        readonly stale: OPTIONAL<PreferredOrLegacyStalePackageIdentifier>
    ) {}

    /**
     * @summary Restructures an object into a FirmwarePackageIdentifier
     * @description
     *
     * This takes an `object` and converts it to a `FirmwarePackageIdentifier`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `FirmwarePackageIdentifier`.
     * @returns {FirmwarePackageIdentifier}
     */
    public static _from_object (_o: { [_K in keyof (FirmwarePackageIdentifier)]: (FirmwarePackageIdentifier)[_K] }): FirmwarePackageIdentifier {
        return new FirmwarePackageIdentifier(_o.name, _o.stale);
    }


}
/* END_OF_SYMBOL_DEFINITION FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageIdentifier */
/**
 * @summary The Leading Root Component Types of FirmwarePackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_FirmwarePackageIdentifier: $.ComponentSpec[] = [
    new $.ComponentSpec("name", false, $.hasAnyTag, undefined, undefined),
    new $.ComponentSpec("stale", true, $.or($.hasTag(_TagClass.universal, 2), $.hasTag(_TagClass.universal, 4)), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageIdentifier */
/**
 * @summary The Trailing Root Component Types of FirmwarePackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_FirmwarePackageIdentifier: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageIdentifier */
/**
 * @summary The Extension Addition Component Types of FirmwarePackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_FirmwarePackageIdentifier: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageIdentifier */
let _cached_decoder_for_FirmwarePackageIdentifier: $.ASN1Decoder<FirmwarePackageIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePackageIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePackageIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePackageIdentifier} The decoded data structure.
 */
export
function _decode_FirmwarePackageIdentifier (el: _Element) {
    if (!_cached_decoder_for_FirmwarePackageIdentifier) { _cached_decoder_for_FirmwarePackageIdentifier = function (el: _Element): FirmwarePackageIdentifier {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let name!: PreferredOrLegacyPackageIdentifier;
    let stale: OPTIONAL<PreferredOrLegacyStalePackageIdentifier>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "name": (_el: _Element): void => { name = _decode_PreferredOrLegacyPackageIdentifier(_el); },
        "stale": (_el: _Element): void => { stale = _decode_PreferredOrLegacyStalePackageIdentifier(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_FirmwarePackageIdentifier,
        _extension_additions_list_spec_for_FirmwarePackageIdentifier,
        _root_component_type_list_2_spec_for_FirmwarePackageIdentifier,
        undefined,
    );
    return new FirmwarePackageIdentifier( /* SEQUENCE_CONSTRUCTOR_CALL */
        name,
        stale
    );
}; }
    return _cached_decoder_for_FirmwarePackageIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageIdentifier */
let _cached_encoder_for_FirmwarePackageIdentifier: $.ASN1Encoder<FirmwarePackageIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePackageIdentifier */
/**
 * @summary Encodes a(n) FirmwarePackageIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePackageIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePackageIdentifier (value: FirmwarePackageIdentifier, elGetter: $.ASN1Encoder<FirmwarePackageIdentifier>) {
    if (!_cached_encoder_for_FirmwarePackageIdentifier) { _cached_encoder_for_FirmwarePackageIdentifier = function (value: FirmwarePackageIdentifier, elGetter: $.ASN1Encoder<FirmwarePackageIdentifier>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_PreferredOrLegacyPackageIdentifier(value.name, $.BER),
            /* IF_ABSENT  */ ((value.stale === undefined) ? undefined : _encode_PreferredOrLegacyStalePackageIdentifier(value.stale, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_FirmwarePackageIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePackageIdentifier */

/* eslint-enable */
